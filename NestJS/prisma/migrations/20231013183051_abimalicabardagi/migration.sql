/*
  Warnings:

  - You are about to drop the column `ChannelID` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `Content` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `SenderID` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `SenderNick` on the `Message` table. All the data in the column will be lost.
  - Added the required column `channelName` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderID` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderNick` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_ChannelID_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "ChannelID",
DROP COLUMN "Content",
DROP COLUMN "SenderID",
DROP COLUMN "SenderNick",
ADD COLUMN     "channelName" TEXT NOT NULL,
ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "senderID" INTEGER NOT NULL,
ADD COLUMN     "senderNick" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_channelName_fkey" FOREIGN KEY ("channelName") REFERENCES "Channel"("Name") ON DELETE RESTRICT ON UPDATE CASCADE;
