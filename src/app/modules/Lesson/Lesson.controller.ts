import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { lessonService } from "./Lesson.service";
import pick from "../../../shared/pick";
import { lessonFilterableFields } from "./Lesson.constant";

const createLesson = catchAsync(async (req: Request, res: Response) => {
  const result = await lessonService.createLesson(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Lesson created successfully",
    data: result,
  });
});

const getAllLessons = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, lessonFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const results = await lessonService.getAllLessons(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Lessons retrieved successfully",
    data: results,
  });
});

const getSingleLesson = catchAsync(async (req: Request, res: Response) => {
  const studentId = req.query.studentId as string;
  const result = await lessonService.getSingleLesson(req.params.id, studentId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Lesson retrieved successfully",
    data: result,
  });
});

//submitQuizAttempt
const submitQuizAttempt = catchAsync(async (req: Request, res: Response) => {
  const result = await lessonService.submitQuizAttempt(
    req.params.lessonId,
    req.body.studentId,
    req.body.answers
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quiz attempt submitted successfully",
    data: result,
  });
});

//submitTaskResponse
const submitTaskResponse = catchAsync(async (req: Request, res: Response) => {
  const result = await lessonService.submitTaskResponse(
    req.params.taskId,
    req.body.studentId,
    req.body.content
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Task response submitted successfully",
    data: result,
  });
});

//getQuizAttemptsByStudent
const getQuizAttemptsByStudent = catchAsync(
  async (req: Request, res: Response) => {
    const result = await lessonService.getQuizAttemptsByStudent(
      req.params.studentId
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Quiz attempts retrieved successfully",
      data: result,
    });
  }
);

// getTaskSubmissionsByStudent;
const getTaskSubmissionsByStudent = catchAsync(
  async (req: Request, res: Response) => {
    const result = await lessonService.getTaskSubmissionsByStudent(
      req.params.studentId
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Task submissions retrieved successfully",
      data: result,
    });
  }
);

const updateLesson = catchAsync(async (req: Request, res: Response) => {
  const result = await lessonService.updateLesson(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Lesson updated successfully",
    data: result,
  });
});

const deleteLesson = catchAsync(async (req: Request, res: Response) => {
  const result = await lessonService.deleteLesson(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Lesson deleted successfully",
    data: result,
  });
});

//getTeacherLessonsWithStats
const getTeacherLessonsWithStats = catchAsync(
  async (req: Request, res: Response) => {
    const result = await lessonService.getTeacherLessonsWithStats(
      req.params.teacherId
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Lessons retrieved successfully",
      data: result,
    });
  }
);

//getLessonEngagement
const getLessonEngagement = catchAsync(async (req: Request, res: Response) => {
  const result = await lessonService.getLessonEngagement(req.params.lessonId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Lesson engagement retrieved successfully",
    data: result,
  });
});

//getQuizAttemptsForStudent
const getQuizAttemptsForStudent = catchAsync(
  async (req: Request, res: Response) => {
    const result = await lessonService.getQuizAttemptsForStudent(
      req.params.lessonId,
      req.params.studentId
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Quiz attempts retrieved successfully",
      data: result,
    });
  }
);

//getTaskSubmissionsForLesson
const getTaskSubmissionsForLesson = catchAsync(
  async (req: Request, res: Response) => {
    const result = await lessonService.getTaskSubmissionsForLesson(
      req.params.lessonId
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Task submissions retrieved successfully",
      data: result,
    });
  }
);

//updateTaskMark
const updateTaskMark = catchAsync(async (req: Request, res: Response) => {
  const result = await lessonService.updateTaskMark(
    req.params.submissionId,
    req.body.mark
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Task mark updated successfully",
    data: result,
  });
});

export const lessonController = {
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
};
