/*
  Warnings:

  - Added the required column `OtherUserNick` to the `Friend` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Friend" ADD COLUMN     "OtherUserNick" TEXT NOT NULL;
