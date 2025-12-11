

# 📘 **LMSC E-Learning Backend**

This is the **backend API** for the LMSC Learning Management System.
It supports both **Student** and **Teacher** workflows, providing a complete REST API for lessons, quizzes, tasks, authentication, and engagement tracking.

Built with **Node.js + Express + TypeScript + Prisma + PostgreSQL**.

---

# 🛠 **Tech Stack**

| Feature    | Technology              |
| ---------- | ----------------------- |
| Runtime    | Node.js                 |
| Framework  | Express.js              |
| Language   | TypeScript              |
| ORM        | Prisma ORM              |
| Database   | PostgreSQL              |
| Auth       | JWT (simple login)      |
| Validation | Zod / custom validation |
| Logging    | Custom middleware       |
| Dev Tools  | Nodemon, TS-Node        |
| API Style  | REST                    |

---

# 🚀 **Setup & Run Instructions**

## 1️⃣ Clone the repo

```sh
git clone https://github.com/belalhossain22000/Lesson-Management-LMSC.git
cd Lesson-Management-LMSC
```

## 2️⃣ Install dependencies

```sh
npm install
```

## 3️⃣ Create `.env`

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/lmsc_db"

JWT_SECRET="super-secret-key"
EXPIRES_IN="30d"

PORT=5000
```

## 4️⃣ Run Prisma migrations

```sh
npx prisma migrate dev
```

## 5️⃣ Seed the database

This creates sample teachers, students, lessons, quizzes, and tasks.

```sh
npm run seed
```

(or)

```sh
npx prisma db seed
```

## 6️⃣ Start the server

```sh
npm run dev
```

Backend runs at:

```
http://localhost:5000/api/v1
```

---

# 🔐 **Sample Login Instructions (Required for Assignment)**

Authentication is intentionally **simple**, as allowed in the specification.

### Student Login

```
POST /auth/simple-login
{
  "email": "studentA@example.com",
  "role": "student"
}
```

### Teacher Login

```
POST /auth/simple-login
{
  "email": "alice@lmsc.org",
  "role": "teacher"
}
```

Returns JWT:

```json
{
  "token": "xxxxxxxx",
  "id": "...",
  "email": "...",
  "role": "student or teacher",
  "name": "User Name"
}
```

Frontend uses this token for all authenticated routes.

---

# 📚 **Core API Endpoints**

### 🔹 Authentication

* `POST /auth/simple-login`

### 🔹 Lessons (Public / Student)

* `GET /lessons?page=&limit=&searchTerm=`
* `GET /lessons/:id`

### 🔹 Student Lesson Stats

* `GET /lessons/students/:studentId/dashboard-stats`

### 🔹 Student Quiz

* `POST /lessons/lesson/:lessonId/quiz`
* `GET /lessons/students/:studentId/quizzes`

### 🔹 Student Task Submission

* `POST /lessons/tasks/submission/:taskId`
* `GET /lessons/students/:studentId/tasks`

### 🔹 Teacher Dashboard

* `GET /lessons/teachers/:teacherId/dashboard-stats`
* `GET /lessons/teachers/:teacherId/lessons`

### 🔹 Teacher Lesson Engagement

* `GET /lessons/lesson/:lessonId/engagement`

### 🔹 Teacher Task Marking

* `GET /lessons/lesson/:lessonId/task-submissions`
* `PUT /lessons/submissions/:submissionId/mark`

The API is structured for easy extension and clear separation of responsibilities.

---

# 🗃 **Database Schema Overview**

Key models:

```
Teacher
Student
Lesson
QuizQuestion
QuizAttempt
LessonTask
TaskSubmission
LessonView
```

### Relationships:

* **Teacher 1 → Many Lessons**
* **Lesson 1 → Many QuizQuestions**
* **Lesson 1 → 1 LessonTask**
* **Student 1 → Many QuizAttempts**
* **Student 1 → Many TaskSubmissions**

---

# 🧪 **Test Commands**

To run tests (if implemented):

```sh
npm run test
```

The spec did NOT require full test coverage, but code structure is test-friendly.

---

# 🧩 **Assumptions**

The assignment allowed flexible implementation.
These assumptions were made for clarity and completeness:

1. Authentication is **email + role only** (no password required).
2. A student may have **one quiz attempt** and **one task submission** per lesson.
3. “Viewed” means the student opened the lesson detail page.
4. Teachers can only manage lessons they created.
5. Pagination defaults to **10 items per page**.
6. Search applies to **title and description** only.
7. Quiz scoring is auto-calculated in backend.
8. Task marks are teacher-controlled; the latest mark overwrites previous ones.
9. Lesson video URLs use **YouTube embed format**.
10. Seed script creates **10 lessons per teacher**, each with 5 quiz questions and 1 task.



## 🚧 **Known Limitations / Future Improvements**

The project meets the core requirements, but several enhancements could be added with more time:

1. **Video Uploading** — Replace YouTube links with real video uploading to AWS/GCP using presigned URLs.
2. **Chunked Uploading** — Support multipart/chunked uploads for large video files, resumable uploads, and background processing.
3. **Real-Time Engagement** — Add WebSockets/SSE to show teachers live student activity (views, quiz attempts).
4. **Caching & Performance** — Add Redis caching for dashboard stats and analytics, plus DB indexing for scalability.
5. **Enhanced Error Handling** — Centralized error formatter, retry logic on network failures, and better validation.
6. **Advanced Analytics** — Detailed quiz breakdown, student mastery tracking, and timeline visualization.
7. **RBAC Authorization** — More granular permission system for teachers, admins, and students.
8. **Admin Dashboard** — For managing users, lessons, stats, and platform configuration.
9. **Rich Lesson Editor** — Upload PDFs, images, attachments, and create custom quiz question types.
10. **Comprehensive Tests** — Add Jest + Supertest unit/integration tests and Playwright/Cypress E2E tests.



# 📬 **Submission**

Please review:

* This backend repo
* The corresponding frontend repo
* Seed instructions and setup steps included here

Everything required to run and evaluate the app locally is included.

---

# 🎉 Thank you!


