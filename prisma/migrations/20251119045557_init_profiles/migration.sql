/*
  Warnings:

  - You are about to drop the column `userId` on the `AdminProfile` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `RiderProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[adminId]` on the table `AdminProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[riderId]` on the table `RiderProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adminId` to the `AdminProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `AdminProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `DriverProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `RiderProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `riderId` to the `RiderProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "AdminProfile_userId_key";

-- DropIndex
DROP INDEX "RiderProfile_userId_key";

-- AlterTable
ALTER TABLE "AdminProfile" DROP COLUMN "userId",
ADD COLUMN     "adminId" INTEGER NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DriverProfile" ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RiderProfile" DROP COLUMN "userId",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "riderId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AdminProfile_adminId_key" ON "AdminProfile"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "RiderProfile_riderId_key" ON "RiderProfile"("riderId");
