import { Router } from "express";
import { lessonController } from "./Lesson.controller";

const router = Router();

// create lesson
router.post("/create", lessonController.createLesson);

// get all quiz attempts by student
router.get(
  "/students/:studentId/quizzes",
  lessonController.getQuizAttemptsByStudent
);

// get all task submissions by student
router.get(
  "/students/:studentId/tasks",
  lessonController.getTaskSubmissionsByStudent
);

//getTeacherLessonsWithStats
router.get(
  "/teachers/:teacherId/lessons",
  lessonController.getTeacherLessonsWithStats
);

//getLessonEngagement
router.get(
  "/lesson/:lessonId/engagement",
  lessonController.getLessonEngagement
);

// getQuizAttemptsForStudent
router.get(
  "/lesson/:lessonId/students/:studentId/quiz-attempts",
  lessonController.getQuizAttemptsForStudent
);

// getTaskSubmissionsForLesson
router.get(
  "/lesson/:lessonId/task-submissions",
  lessonController.getTaskSubmissionsForLesson
);

// updateTaskMark
router.put("/submissions/:submissionId/mark", lessonController.updateTaskMark);

//getStudentProgressSummary
router.get(
  "/lesson/:lessonId/progress-summary",
  lessonController.getStudentProgressSummary
);

//getStudentDashboardStats
router.get(
  "/teachers/:teacherId/dashboard-stats",
  lessonController.getTeacherDashboardStats
);

// getStudentDashboardStats
router.get(
  "/students/:studentId/dashboard-stats",
  lessonController.getStudentDashboardStats
)
// get all lesson
router.get("/", lessonController.getAllLessons);

// get single lesson by id
router.get("/:id", lessonController.getSingleLesson);

// submit quiz attempt
router.post("/lesson/:lessonId/quiz", lessonController.submitQuizAttempt);

// submit task response
router.post("/tasks/submission/:taskId", lessonController.submitTaskResponse);

// update lesson
router.put("/:id", lessonController.updateLesson);

// delete lesson
router.delete("/:id", lessonController.deleteLesson);

export const lessonRoutes = router;
