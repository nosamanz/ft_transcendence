/*
  Warnings:

  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `imgPath` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_UserId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "imgPath" TEXT NOT NULL;

-- DropTable
DROP TABLE "Image";
