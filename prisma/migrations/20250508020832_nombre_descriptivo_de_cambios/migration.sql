/*
  Warnings:

  - You are about to drop the column `sentAt` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Contact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "sentAt",
DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "deletedAt" TIMESTAMP(3);
