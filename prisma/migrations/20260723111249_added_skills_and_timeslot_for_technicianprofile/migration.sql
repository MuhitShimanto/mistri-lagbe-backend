/*
  Warnings:

  - You are about to drop the column `experience` on the `TechnicianProfile` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `TechnicianProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TechnicianProfile" DROP COLUMN "experience",
DROP COLUMN "location",
ADD COLUMN     "experienceYears" INTEGER,
ADD COLUMN     "rating" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "skills" TEXT[];

-- CreateTable
CREATE TABLE "Availability" (
    "id" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "technicianProfileId" TEXT NOT NULL,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_technicianProfileId_fkey" FOREIGN KEY ("technicianProfileId") REFERENCES "TechnicianProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
