import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { lessonService } from "./Lesson.service";

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
    const results = await lessonService.getAllLessons(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Lessons retrieved successfully",
        data: results,
    });
});

const getSingleLesson = catchAsync(async (req: Request, res: Response) => {
    const result = await lessonService.getSingleLesson(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Lesson retrieved successfully",
        data: result,
    });
});

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
    updateLesson,
    deleteLesson,
};
