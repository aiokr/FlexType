/*
  Warnings:

  - The `DateTimeOriginal` column on the `Assets` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `ExifImageLength` column on the `Assets` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `ExifImageWidth` column on the `Assets` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `ExposureTime` column on the `Assets` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `ISOSpeedRatings` column on the `Assets` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Assets" ADD COLUMN     "GPSLatitude" DOUBLE PRECISION,
ADD COLUMN     "GPSLongitude" DOUBLE PRECISION,
DROP COLUMN "DateTimeOriginal",
ADD COLUMN     "DateTimeOriginal" TIMESTAMP(3),
DROP COLUMN "ExifImageLength",
ADD COLUMN     "ExifImageLength" INTEGER,
DROP COLUMN "ExifImageWidth",
ADD COLUMN     "ExifImageWidth" INTEGER,
DROP COLUMN "ExposureTime",
ADD COLUMN     "ExposureTime" DOUBLE PRECISION,
ALTER COLUMN "FNumber" SET DATA TYPE DOUBLE PRECISION,
DROP COLUMN "ISOSpeedRatings",
ADD COLUMN     "ISOSpeedRatings" INTEGER;
