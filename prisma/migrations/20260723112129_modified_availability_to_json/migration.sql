/*
  Warnings:

  - You are about to drop the `Availability` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `availability` to the `TechnicianProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Availability" DROP CONSTRAINT "Availability_technicianProfileId_fkey";

-- AlterTable
ALTER TABLE "TechnicianProfile" ADD COLUMN     "availability" JSONB NOT NULL;

-- DropTable
DROP TABLE "Availability";
