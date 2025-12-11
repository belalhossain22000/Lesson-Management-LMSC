import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { IUserFilterRequest } from "../User/user.interface";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma } from "@prisma/client";
import { lessonSearchAbleFields } from "./Lesson.constant";
import { QuizAnswerPayload } from "./Lesson.interface";

const createLesson = async (data: any) => {
  //if you wanna add logic here
  const result = await prisma.lesson.create({ data });
  return result;
};

//reterive all users from the database also searcing anf filetering
const getAllLessons = async (
  params: IUserFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.LessonWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: lessonSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereConditions: Prisma.LessonWhereInput = { AND: andConditions };

  const result = await prisma.lesson.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },

    include: {
      teacher: true,
    },
  });
  const total = await prisma.lesson.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

//reterive single user from the database
const getSingleLesson = async (lessonId: string, studentId?: string) => {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      quizQuestions: true,
      lessonTasks: {
        include: {
          submissions: studentId
            ? {
                where: { studentId },
              }
            : false,
        },
      },
      teacher: true,
    },
  });

  if (!lesson) {
    throw new ApiError(httpStatus.NOT_FOUND, "Lesson not found..!!");
  }

  // Mark lesson as viewed (if studentId given)
  if (studentId) {
    await prisma.lessonView.upsert({
      where: {
        lessonId_studentId: {
          lessonId,
          studentId,
        },
      },
      update: {},
      create: {
        lessonId,
        studentId,
      },
    });
  }

  return lesson;
};

//reterive single user from the database
const submitQuizAttempt = async (
  lessonId: string,
  studentId: string,
  answers: QuizAnswerPayload
) => {
  // Check lesson
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { quizQuestions: true },
  });

  if (!lesson) {
    throw new ApiError(httpStatus.NOT_FOUND, "Lesson not found");
  }

  const questions = lesson.quizQuestions;

  if (questions.length === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "No quiz questions found for this lesson"
    );
  }

  // Calculate score
  let correctCount = 0;

  questions.forEach((q) => {
    const studentAnswer = answers[q.id];
    if (studentAnswer && studentAnswer === q.correctOption) {
      correctCount += 1;
    }
  });

  const total = questions.length;
  const scorePercent = Math.round((correctCount / total) * 100);

  // Save quiz attempt
  const attempt = await prisma.quizAttempt.create({
    data: {
      lessonId,
      studentId,
      score: scorePercent,
      answers, // store full JSON
    },
  });

  return {
    message: "Quiz submitted successfully",
    lessonId,
    studentId,
    totalQuestions: total,
    correctAnswers: correctCount,
    score: scorePercent,
    attemptId: attempt,
  };
};

//reterive single user from the database
const submitTaskResponse = async (
  taskId: string,
  studentId: string,
  content: string
) => {
  console.log(taskId);
  // Check if task exists
  const task = await prisma.lessonTask.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, "Task not found");
  }

  // Optional: Check if student already submitted once
  const existing = await prisma.taskSubmission.findFirst({
    where: { taskId, studentId },
  });

  if (existing) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You have already submitted this task"
    );
  }

  // Create submission
  const submission = await prisma.taskSubmission.create({
    data: {
      taskId,
      studentId,
      content,
    },
  });

  return {
    message: "Task submitted successfully",
    taskId,
    studentId,
    submissionId: submission.id,
    submittedAt: submission.submittedAt,
  };
};

//reterive single user from the database
const getQuizAttemptsByStudent = async (studentId: string) => {
  const attempts = await prisma.quizAttempt.findMany({
    where: { studentId },
    include: {
      lesson: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: { submittedAt: "desc" },
  });

  return attempts.map((a) => ({
    attemptId: a.id,
    lessonId: a.lessonId,
    lessonTitle: a.lesson.title,
    score: a.score,
    submittedAt: a.submittedAt,
  }));
};

//reterive single user from the database
const getTaskSubmissionsByStudent = async (studentId: string) => {
  const submissions = await prisma.taskSubmission.findMany({
    where: { studentId },
    include: {
      lessonTask: {
        include: {
          lesson: {
            select: { id: true, title: true },
          },
        },
      },
    },
    orderBy: { submittedAt: "desc" },
  });

  return submissions.map((s) => ({
    submissionId: s.id,
    lessonId: s.lessonTask.lesson.id,
    lessonTitle: s.lessonTask.lesson.title,
    taskId: s.taskId,
    content: s.content,
    mark: s.mark,
    submittedAt: s.submittedAt,
  }));
};

const updateLesson = async (id: string, data: any) => {
  const existingLesson = await prisma.lesson.findUnique({ where: { id } });
  if (!existingLesson) {
    throw new ApiError(httpStatus.NOT_FOUND, "Lesson not found..!!");
  }
  const result = await prisma.lesson.update({ where: { id }, data });
  return result;
};

const deleteLesson = async (id: string) => {
  const existingLesson = await prisma.lesson.findUnique({ where: { id } });
  if (!existingLesson) {
    throw new ApiError(httpStatus.NOT_FOUND, "Lesson not found..!!");
  }
  const result = await prisma.lesson.delete({ where: { id } });
  return null;
};

// reterive single user from the database
export const getTeacherLessonsWithStats = async (teacherId: string) => {
  // Get all lessons owned by teacher
  const lessons = await prisma.lesson.findMany({
    where: { teacherId },
    include: {
      lessonViews: true,
      quizAttempts: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return lessons.map((lesson) => {
    // Unique students who completed quiz
    const completedQuizStudentIds = new Set(
      lesson.quizAttempts.map((a) => a.studentId)
    );

    // Average score
    let avgScore = 0;
    if (lesson.quizAttempts.length > 0) {
      const totalScore = lesson.quizAttempts.reduce(
        (sum, a) => sum + (a.score ?? 0),
        0
      );
      avgScore = Math.round(totalScore / lesson.quizAttempts.length);
    }

    return {
      lessonId: lesson.id,
      title: lesson.title,
      description: lesson.description,
      viewedCount: lesson.lessonViews.length,
      completedQuizCount: completedQuizStudentIds.size,
      avgScore,
    };
  });
};


// reterive single user from the database
const getLessonEngagement = async (lessonId: string) => {
  const task = await prisma.lessonTask.findFirst({
    where: { lessonId },
  });

  const students = await prisma.student.findMany({
    orderBy: { createdAt: "asc" },
  });

  const engagement = await Promise.all(
    students.map(async (student) => {
      const viewed = await prisma.lessonView.findFirst({
        where: { lessonId, studentId: student.id },
      });

      const quizAttempt = await prisma.quizAttempt.findFirst({
        where: { lessonId, studentId: student.id },
        orderBy: { submittedAt: "desc" },
      });

      const submission = task
        ? await prisma.taskSubmission.findFirst({
            where: { taskId: task.id, studentId: student.id },
          })
        : null;

      return {
        studentId: student.id,
        studentName: student.name,

        viewed: !!viewed,

        quizSubmitted: !!quizAttempt,
        quizScore: quizAttempt?.score || null,

        taskSubmitted: !!submission,
        taskMark: submission?.mark || null,
      };
    })
  );

  return engagement;
};

// reterive single user from the database
const getQuizAttemptsForStudent = async (
  lessonId: string,
  studentId: string
) => {
  const attempts = await prisma.quizAttempt.findMany({
    where: { lessonId, studentId },
    orderBy: { submittedAt: "desc" },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return attempts.map((a) => ({
    attemptId: a.id,
    studentId: a.student.id,
    studentName: a.student.name,
    score: a.score,
    submittedAt: a.submittedAt,
  }));
};

const getTaskSubmissionsForLesson = async (lessonId: string) => {
  // Find the task for this lesson (1 task per lesson)
  const task = await prisma.lessonTask.findFirst({
    where: { lessonId },
  });

  if (!task) {
    return [];
  }

  // Get all submissions for this task
  const submissions = await prisma.taskSubmission.findMany({
    where: { taskId: task.id },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { submittedAt: "desc" },
  });

  return submissions.map((s) => ({
    submissionId: s.id,
    studentId: s.student.id,
    studentName: s.student.name,
    studentEmail: s.student.email,
    content: s.content,
    mark: s.mark,
    submittedAt: s.submittedAt,
  }));
};

// reterive single user from the database
const updateTaskMark = async (submissionId: string, mark: number) => {
  const updated = await prisma.taskSubmission.update({
    where: { id: submissionId },
    data: { mark },
  });

  return {
    message: "Mark updated successfully",
    submissionId: updated.id,
    mark: updated.mark,
  };
};

// reterive single user from the database
const getStudentProgressSummary = async (lessonId: string) => {
  // Find the lesson’s task (1 per lesson)
  const task = await prisma.lessonTask.findFirst({
    where: { lessonId },
  });

  // Fetch ALL students
  const students = await prisma.student.findMany({
    orderBy: { name: "asc" },
  });

  // For each student check: viewed, quiz, task
  const summary = await Promise.all(
    students.map(async (student) => {
      // Viewed?
      const viewed = await prisma.lessonView.findFirst({
        where: { lessonId, studentId: student.id },
      });

      // Quiz submission?
      const quiz = await prisma.quizAttempt.findFirst({
        where: { lessonId, studentId: student.id },
        orderBy: { submittedAt: "desc" },
      });

      // Task submission?
      const submission = task
        ? await prisma.taskSubmission.findFirst({
            where: { taskId: task.id, studentId: student.id },
          })
        : null;

      // Calculate "activities completed"
      // 1 = viewed
      // +1 = quiz submitted
      // +1 = task submitted
      const completedCount =
        (viewed ? 1 : 0) + (quiz ? 1 : 0) + (submission ? 1 : 0);

      return {
        studentId: student.id,
        studentName: student.name,

        viewed: !!viewed,
        quizSubmitted: !!quiz,
        quizScore: quiz?.score || null,

        taskSubmitted: !!submission,
        taskMark: submission?.mark || null,

        completedCount, // number of activities completed
        totalActivities: 3, // viewed + quiz + task
      };
    })
  );

  return summary;
};

//student dashboard stats
const getStudentDashboardStats = async (studentId: string) => {
  const totalLessons = await prisma.lesson.count();

  const completedQuiz = await prisma.quizAttempt.findMany({
    where: { studentId },
    select: { lessonId: true },
  });

  const completedTasks = await prisma.taskSubmission.findMany({
    where: { studentId },
    include: {
      lessonTask: true,
    },
  });

  const completedLessonIds = new Set<string>([
    ...completedQuiz.map((q) => q.lessonId),
    ...completedTasks.map((t) => t.lessonTask.lessonId),
  ]);

  const completedLessons = completedLessonIds.size;

  const allAttempts = await prisma.quizAttempt.findMany({
    where: { studentId },
    select: { score: true },
  });

  let avgScore = 0;

  if (allAttempts.length > 0) {
    const totalScore = allAttempts.reduce((sum, a) => sum + (a.score ?? 0), 0);
    avgScore = Math.round(totalScore / allAttempts.length);
  }

  // For demo: assume each completed lesson = 1 hour
  const learningHours = completedLessons * 1;

  return {
    totalLessons,
    completedLessons,
    avgScore,
    learningHours,
  };
};

// teacher dashboard stats
const getTeacherDashboardStats = async (teacherId: string) => {
  const lessons = await prisma.lesson.findMany({
    where: { teacherId },
    select: { id: true },
  });

  const lessonIds = lessons.map((l) => l.id);
  const totalLessons = lessonIds.length;

  if (totalLessons === 0) {
    return {
      totalLessons: 0,
      studentsEngaged: 0,
      quizSubmissions: 0,
      taskSubmissions: 0,
    };
  }

  const lessonViews = await prisma.lessonView.findMany({
    where: {
      lessonId: { in: lessonIds },
    },
    select: { studentId: true },
  });

  const uniqueStudentsEngaged = new Set(lessonViews.map((v) => v.studentId))
    .size;

  const quizSubmissions = await prisma.quizAttempt.count({
    where: {
      lessonId: { in: lessonIds },
    },
  });

  const tasks = await prisma.lessonTask.findMany({
    where: { lessonId: { in: lessonIds } },
    select: { id: true },
  });

  const taskIds = tasks.map((t) => t.id);

  const taskSubmissions = await prisma.taskSubmission.count({
    where: {
      taskId: { in: taskIds },
    },
  });

  return {
    totalLessons,
    studentsEngaged: uniqueStudentsEngaged,
    quizSubmissions,
    taskSubmissions,
  };
};

export const lessonService = {
  createLesson,
  getAllLessons,
  getSingleLesson,
  submitQuizAttempt,
  submitTaskResponse,
  getQuizAttemptsByStudent,
  getTaskSubmissionsByStudent,
  updateLesson,
  deleteLesson,
  getTeacherLessonsWithStats,
  getLessonEngagement,
  getQuizAttemptsForStudent,
  getTaskSubmissionsForLesson,
  updateTaskMark,
  getStudentProgressSummary,
  getStudentDashboardStats,
  getTeacherDashboardStats,
};
