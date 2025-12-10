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
    select: {
      id: true,
      title: true,
      description: true,
      videoUrl: true,
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

export const lessonService = {
  createLesson,
  getAllLessons,
  getSingleLesson,
  submitQuizAttempt,
  submitTaskResponse,
  updateLesson,
  deleteLesson,
};
