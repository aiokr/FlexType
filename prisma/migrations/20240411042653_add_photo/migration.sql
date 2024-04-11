-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "assetsId" INTEGER NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_assetsId_fkey" FOREIGN KEY ("assetsId") REFERENCES "Assets"("assetId") ON DELETE RESTRICT ON UPDATE CASCADE;
