import { Router } from "express";
import { lessonController } from "./Lesson.controller";

const router = Router();

// create lesson
router.post("/create", lessonController.createLesson);

// get all lesson
router.get("/", lessonController.getAllLessons);

// get single lesson by id
router.get("/:id", lessonController.getSingleLesson);

// update lesson
router.put("/:id", lessonController.updateLesson);

// delete lesson
router.delete("/:id", lessonController.deleteLesson);

export const lessonRoutes = router;
