/*
  Warnings:

  - A unique constraint covering the columns `[OtherUserID]` on the table `FriendRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_OtherUserID_key" ON "FriendRequest"("OtherUserID");
