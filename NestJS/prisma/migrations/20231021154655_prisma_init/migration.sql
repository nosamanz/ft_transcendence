/*
  Warnings:

  - You are about to drop the column `imgPath` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "imgPath";

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "UserId" INTEGER NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Image_UserId_key" ON "Image"("UserId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
