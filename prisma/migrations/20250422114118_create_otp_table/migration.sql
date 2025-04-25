-- CreateEnum
CREATE TYPE "ROLES" AS ENUM ('NEW_USER', 'ADMIN', 'MENTOR', 'MENTEE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "refreshToken" TEXT,
    "accessToken" TEXT,
    "forgetPasswordToken" TEXT,
    "profile" TEXT NOT NULL DEFAULT 'https://cdn.vectorstock.com/i/1000x1000/87/44/preview-stamp-vector-10408744.webp',
    "role" "ROLES" NOT NULL DEFAULT 'NEW_USER',
    "samlProvider" TEXT,
    "samlId" TEXT,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isAccountActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Otp" (
    "email" TEXT,
    "id" TEXT NOT NULL,
    "otpVal" TEXT NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Otp_email_key" ON "Otp"("email");
