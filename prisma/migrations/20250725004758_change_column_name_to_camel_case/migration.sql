/*
  Warnings:

  - The values [accept,reject] on the enum `invitation_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [in_progress] on the enum `task_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `created_at` on the `Comments` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Comments` table. All the data in the column will be lost.
  - You are about to drop the column `accpeted_at` on the `Invitations` table. All the data in the column will be lost.
  - You are about to drop the column `invited_at` on the `Invitations` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Projects` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Projects` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Subtasks` table. All the data in the column will be lost.
  - You are about to drop the column `is_done` on the `Subtasks` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Subtasks` table. All the data in the column will be lost.
  - You are about to drop the column `file_name` on the `Task_files` table. All the data in the column will be lost.
  - You are about to drop the column `file_url` on the `Task_files` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Task_files` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `due_date` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `started_at` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Tokens` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Tokens` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Users` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `acceptedAt` to the `Invitations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Subtasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileName` to the `Task_files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileUrl` to the `Task_files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Task_files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dueDate` to the `Tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startedAt` to the `Tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `Tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "invitation_status_new" AS ENUM ('pending', 'accepted', 'rejected');
ALTER TABLE "Invitations" ALTER COLUMN "status" TYPE "invitation_status_new" USING ("status"::text::"invitation_status_new");
ALTER TYPE "invitation_status" RENAME TO "invitation_status_old";
ALTER TYPE "invitation_status_new" RENAME TO "invitation_status";
DROP TYPE "invitation_status_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "task_status_new" AS ENUM ('todo', 'inProgress', 'done');
ALTER TABLE "Tasks" ALTER COLUMN "status" TYPE "task_status_new" USING ("status"::text::"task_status_new");
ALTER TYPE "task_status" RENAME TO "task_status_old";
ALTER TYPE "task_status_new" RENAME TO "task_status";
DROP TYPE "task_status_old";
COMMIT;

-- AlterTable
ALTER TABLE "Comments" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Invitations" DROP COLUMN "accpeted_at",
DROP COLUMN "invited_at",
ADD COLUMN     "acceptedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Projects" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Subtasks" DROP COLUMN "created_at",
DROP COLUMN "is_done",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isDone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Task_files" DROP COLUMN "file_name",
DROP COLUMN "file_url",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "fileUrl" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Tasks" DROP COLUMN "created_at",
DROP COLUMN "due_date",
DROP COLUMN "started_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Tokens" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
