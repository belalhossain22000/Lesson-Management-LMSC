import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";

const createLesson = async (data: any) => {

//if you wanna add logic here
    const result = await prisma.lesson.create({ data });
    return result;
};

const getAllLessons = async (query: Record<string, any>) => {
    const result = await prisma.lesson.findMany();
    return result;
};

const getSingleLesson = async (id: string) => {
    const result = await prisma.lesson.findUnique({ where: { id } });
    if(!result){
     throw new ApiError(httpStatus.NOT_FOUND, "Lesson not found..!!")
    }
    return result;
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
    updateLesson,
    deleteLesson,
};
