/*
  Warnings:

  - The values [NEW_USER] on the enum `ROLES` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `accessToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastLogin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `samlId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `samlProvider` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ROLES_new" AS ENUM ('ADMIN', 'MENTOR', 'MENTEE');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "ROLES_new" USING ("role"::text::"ROLES_new");
ALTER TYPE "ROLES" RENAME TO "ROLES_old";
ALTER TYPE "ROLES_new" RENAME TO "ROLES";
DROP TYPE "ROLES_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'MENTEE';
COMMIT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "accessToken",
DROP COLUMN "lastLogin",
DROP COLUMN "samlId",
DROP COLUMN "samlProvider",
ADD COLUMN     "isSaml" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "role" SET DEFAULT 'MENTEE';
