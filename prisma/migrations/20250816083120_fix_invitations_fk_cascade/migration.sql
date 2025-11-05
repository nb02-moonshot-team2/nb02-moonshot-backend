-- DropForeignKey
ALTER TABLE "Invitations" DROP CONSTRAINT "Invitations_projectId_fkey";

-- AddForeignKey
ALTER TABLE "Invitations" ADD CONSTRAINT "Invitations_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
