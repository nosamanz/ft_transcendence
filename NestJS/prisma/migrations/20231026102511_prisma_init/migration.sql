-- CreateTable
CREATE TABLE "Friend" (
    "id" SERIAL NOT NULL,
    "OtherUserID" INTEGER NOT NULL,
    "OtherUserNick" TEXT NOT NULL,
    "UserId" INTEGER NOT NULL,

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FriendRequest" (
    "id" SERIAL NOT NULL,
    "OtherUserID" INTEGER NOT NULL,
    "OtherUserNick" TEXT NOT NULL,
    "UserId" INTEGER NOT NULL,

    CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ignore" (
    "id" SERIAL NOT NULL,
    "OtherUserID" INTEGER NOT NULL,
    "UserId" INTEGER NOT NULL,

    CONSTRAINT "Ignore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "History" (
    "id" SERIAL NOT NULL,
    "RivalNick" TEXT NOT NULL,
    "Score" INTEGER NOT NULL,
    "RivalScore" INTEGER NOT NULL,
    "UserId" INTEGER NOT NULL,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL,
    "login" TEXT NOT NULL,
    "nick" TEXT NOT NULL,
    "IsFormSigned" BOOLEAN NOT NULL,
    "TFAuth" BOOLEAN NOT NULL,
    "TFSecret" TEXT NOT NULL,
    "secretAscii" TEXT NOT NULL,
    "WinCount" INTEGER NOT NULL,
    "LoseCount" INTEGER NOT NULL,
    "LatterLevel" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievements" (
    "id" SERIAL NOT NULL,
    "Ac1" BOOLEAN NOT NULL,
    "Ac2" BOOLEAN NOT NULL,
    "Ac3" BOOLEAN NOT NULL,
    "Ac4" BOOLEAN NOT NULL,
    "UserID" INTEGER NOT NULL,

    CONSTRAINT "Achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "ChannelOwnerID" INTEGER NOT NULL,
    "AdminIDs" INTEGER[],
    "BannedIDs" INTEGER[],
    "MutedIDs" INTEGER[],
    "InvitedIDs" INTEGER[],
    "Password" TEXT NOT NULL,
    "IsDirect" BOOLEAN NOT NULL,
    "IsInviteOnly" BOOLEAN NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "senderID" INTEGER NOT NULL,
    "senderNick" TEXT NOT NULL,
    "channelName" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChannelToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Friend_OtherUserID_key" ON "Friend"("OtherUserID");

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_OtherUserID_key" ON "FriendRequest"("OtherUserID");

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "User_nick_key" ON "User"("nick");

-- CreateIndex
CREATE UNIQUE INDEX "Achievements_UserID_key" ON "Achievements"("UserID");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_Name_key" ON "Channel"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelToUser_AB_unique" ON "_ChannelToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelToUser_B_index" ON "_ChannelToUser"("B");

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ignore" ADD CONSTRAINT "Ignore_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievements" ADD CONSTRAINT "Achievements_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_channelName_fkey" FOREIGN KEY ("channelName") REFERENCES "Channel"("Name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToUser" ADD CONSTRAINT "_ChannelToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToUser" ADD CONSTRAINT "_ChannelToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
