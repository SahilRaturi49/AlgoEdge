/*
  Warnings:

  - You are about to drop the column `Tags` on the `Problem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "Tags",
ADD COLUMN     "tags" TEXT[];
