/*
  Warnings:

  - You are about to drop the column `ExifImageLength` on the `Assets` table. All the data in the column will be lost.
  - You are about to drop the column `ExifImageWidth` on the `Assets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Assets" DROP COLUMN "ExifImageLength",
DROP COLUMN "ExifImageWidth",
ADD COLUMN     "height" TEXT,
ADD COLUMN     "width" TEXT,
ALTER COLUMN "FNumber" SET DATA TYPE TEXT,
ALTER COLUMN "GPSLatitude" SET DATA TYPE TEXT,
ALTER COLUMN "GPSLongitude" SET DATA TYPE TEXT,
ALTER COLUMN "ExposureTime" SET DATA TYPE TEXT,
ALTER COLUMN "ISOSpeedRatings" SET DATA TYPE TEXT,
ALTER COLUMN "GPSAltitude" SET DATA TYPE TEXT;
