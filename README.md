

# **LMSC E-Learning Platform**

A full-stack Learning Management System (LMS) built with:

* **Backend:** Node.js, Express.js, Prisma ORM, PostgreSQL
* **Frontend:** Next.js (App Router), TypeScript, ShadCN UI
* **Authentication:** JWT-based login (Student + Teacher roles)
* **Features:** Lessons, Quizzes, Tasks, Submissions, Teacher Dashboard, Student Dashboard

---

# 🚀 **Features**

### 👨‍🎓 Student Side

* Login as **student**
* View available lessons (pagination + search)
* Watch lesson videos
* Take quizzes (auto-graded)
* Submit tasks
* View quiz score, task submission result
* Progress statistics

### 👩‍🏫 Teacher Side

* Login as **teacher**
* View teacher-specific lessons
* Lesson engagement dashboard
* View student quiz attempts
* View + grade student task submissions
* Manage lesson analytics

### 🛠 System Features

* REST API
* Prisma ORM migrations
* PostgreSQL database
* Seed script for test data
* Role-based access
* Real-time computed stats for dashboards

---

# 📦 **Tech Stack**

| Layer            | Technology                                         |
| ---------------- | -------------------------------------------------- |
| Frontend         | Next.js (App Router), React, TypeScript, ShadCN UI |
| Backend          | Express.js, TypeScript                             |
| Database         | PostgreSQL                                         |
| ORM              | Prisma                                             |
| Auth             | JWT                                                |
| Deployment-ready | Yes                                                |

---

# ⚙️ **Prerequisites**

Make sure you have installed:

* **Node.js 18+**
* **PostgreSQL 13+**
* **npm or yarn**
* **A `.env` file configured** (see below)

---

# 🔧 **Environment Variables**

Create `.env` in the backend root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/lmsc_db?schema=public"

JWT_SECRET="super-secret-key"
JWT_EXPIRES_IN="30d"
PORT=5000
```

Create `.env.local` in the Next.js frontend root:

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
```

---

# 🗃 **Database Setup**

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Generate Prisma Client

```bash
npx prisma generate
```

### 3️⃣ Run migrations

```bash
npx prisma migrate dev --name init
```

---

# 🌱 **Seed the Database**

The project includes a custom seed script that:

* Clears old data
* Creates teachers + students
* Creates **10 lessons per teacher**
* Generates quizzes + tasks automatically

Run:

```bash
npm run seed
```

Or depending on package.json:

```bash
npx prisma db seed
```

---

# ▶️ **Run Backend Server**

```bash
npm run dev
```

Server runs on:

```
http://localhost:5000
```

---

# ▶️ **Run Next.js Frontend**

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

# 📚 **Folder Structure (Backend)**

```
src/
 ├── app/
 │    ├── modules/
 │    │    ├── lessons/
 │    │    ├── quizzes/
 │    │    ├── students/
 │    │    └── teachers/
 │    ├── middlewares/
 │    └── utils/
 ├── shared/
 │    └── prisma.ts
 └── server.ts
prisma/
 ├── schema.prisma
 └── seed.ts
```

---

# 📚 **Folder Structure (Frontend)**

```
app/
 ├── (student)/
 │     ├── dashboard/
 │     └── lessons/
 ├── (teacher)/
 │     ├── dashboard/
 │     └── lessons/
 ├── login/
 └── layout.tsx
lib/
 ├── auth-context.tsx
 └── api-client.ts
components/ui/
```

---

# 🔐 **Authentication Flow**

### Student Login (`POST /auth/simple-login`)

Body example:

```json
{
  "email": "studentA@example.com",
  "role": "student"
}
```

Returns JWT with:

```json
{
  "id",
  "name",
  "email",
  "role"
}
```

Frontend stores token in memory inside `AuthContext`.

---

# 🧠 **Assumptions**

1. Each teacher must have **at least 10 lessons**.
2. Each lesson must contain:

   * 1 video
   * 5 quiz questions
   * 1 task
3. A student can submit:

   * 1 quiz attempt per lesson
   * 1 task submission per lesson
4. Teachers can:

   * View all engagement
   * Update task marks anytime
5. Lessons, quizzes, and tasks are already created by seeding.
6. Pagination and search are handled on server side.

---

# 🧪 **Testing Accounts**

### 👩‍🏫 Teachers

```
alice@lmsc.org
bob@lmsc.org
charlie@lmsc.org
diana@lmsc.org
edward@lmsc.org
```

### 👨‍🎓 Students

```
studentA@example.com
studentB@example.com
studentC@example.com
studentD@example.com
studentE@example.com
```

All roles use simple login (no password).

---

# 🚀 Deployment Notes

* For production, set:

  * `DATABASE_URL` to cloud PostgreSQL
  * Use HTTPS
  * Set long JWT secrets
* Prisma migrations must run before server starts.

---

# 🧩 **Common Commands**

| Action                 | Command                    |
| ---------------------- | -------------------------- |
| Reset DB               | `npx prisma migrate reset` |
| View DB UI             | `npx prisma studio`        |
| Generate Prisma Client | `npx prisma generate`      |
| Seed Data              | `npm run seed`             |





