/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `AdminProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[driverId]` on the table `DriverProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `RiderProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `AdminProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `driverId` to the `DriverProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `RiderProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AdminProfile" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'ADMIN',
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "DriverProfile" ADD COLUMN     "driverId" INTEGER NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'DRIVER';

-- AlterTable
ALTER TABLE "RiderProfile" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'RIDER',
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AdminProfile_userId_key" ON "AdminProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DriverProfile_driverId_key" ON "DriverProfile"("driverId");

-- CreateIndex
CREATE UNIQUE INDEX "RiderProfile_userId_key" ON "RiderProfile"("userId");
