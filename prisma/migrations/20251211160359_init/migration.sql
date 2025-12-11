/*
  Warnings:

  - The values [ADMIN,SUPER_ADMIN,STUDENT,TEACHER,SUPERVISOR] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('admin', 'superAdmin', 'teacher', 'student');
ALTER TABLE "Students" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Teachers" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TABLE "Students" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TABLE "Teachers" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "Students" ALTER COLUMN "role" SET DEFAULT 'student';
ALTER TABLE "Teachers" ALTER COLUMN "role" SET DEFAULT 'teacher';
ALTER TABLE "Users" ALTER COLUMN "role" SET DEFAULT 'student';
COMMIT;

-- AlterTable
ALTER TABLE "Students" ALTER COLUMN "role" SET DEFAULT 'student';

-- AlterTable
ALTER TABLE "Teachers" ALTER COLUMN "role" SET DEFAULT 'teacher';

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "role" SET DEFAULT 'student';
