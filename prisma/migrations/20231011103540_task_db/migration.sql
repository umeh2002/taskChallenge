-- CreateTable
CREATE TABLE "authService" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "token" TEXT,
    "avatar" TEXT,
    "avatarURL" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "authService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taskService" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "priority" TEXT NOT NULL,
    "taskName" TEXT NOT NULL,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userID" TEXT NOT NULL,

    CONSTRAINT "taskService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "authService_email_key" ON "authService"("email");

-- AddForeignKey
ALTER TABLE "taskService" ADD CONSTRAINT "taskService_userID_fkey" FOREIGN KEY ("userID") REFERENCES "authService"("id") ON DELETE CASCADE ON UPDATE CASCADE;
