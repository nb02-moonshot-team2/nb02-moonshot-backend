/*
  Warnings:

  - You are about to drop the column `usersId` on the `Subtasks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subtasks" DROP CONSTRAINT "Subtasks_usersId_fkey";

-- AlterTable
ALTER TABLE "Subtasks" DROP COLUMN "usersId",
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Tasks" ALTER COLUMN "description" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Subtasks" ADD CONSTRAINT "Subtasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
