/*
  Warnings:

  - A unique constraint covering the columns `[OtherUserID]` on the table `Friend` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[OtherUserID]` on the table `FriendRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Friend_OtherUserID_key" ON "Friend"("OtherUserID");

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_OtherUserID_key" ON "FriendRequest"("OtherUserID");
