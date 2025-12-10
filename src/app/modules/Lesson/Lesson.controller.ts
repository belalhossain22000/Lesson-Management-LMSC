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
})

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

export const lessonController = {
  createLesson,
  getAllLessons,
  getSingleLesson,
  submitQuizAttempt,
  submitTaskResponse,
  updateLesson,
  deleteLesson,
};
