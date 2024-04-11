/*
  Warnings:

  - You are about to drop the column `lensMake` on the `Assets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Assets" DROP COLUMN "lensMake",
ADD COLUMN     "ApertureValue" DOUBLE PRECISION,
ADD COLUMN     "FocalLengthIn35mmFilm" TEXT,
ADD COLUMN     "GPSAltitude" DOUBLE PRECISION,
ADD COLUMN     "LensMake" TEXT;
