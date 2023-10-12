-- CreateTable
CREATE TABLE "authService" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "password" STRING NOT NULL,
    "email" STRING NOT NULL,
    "verified" BOOL NOT NULL DEFAULT false,
    "token" STRING,
    "avatar" STRING,
    "avatarURL" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "authService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taskService" (
    "id" STRING NOT NULL,
    "name" STRING,
    "priority" STRING NOT NULL,
    "taskName" STRING NOT NULL,
    "avatar" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userID" STRING NOT NULL,

    CONSTRAINT "taskService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "authService_email_key" ON "authService"("email");

-- AddForeignKey
ALTER TABLE "taskService" ADD CONSTRAINT "taskService_userID_fkey" FOREIGN KEY ("userID") REFERENCES "authService"("id") ON DELETE CASCADE ON UPDATE CASCADE;
