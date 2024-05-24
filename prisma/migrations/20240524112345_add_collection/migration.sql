-- CreateTable
CREATE TABLE "Collection" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "info" JSONB,
    "adminId" TEXT NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthorizedUsersOnCollections" (
    "collectionId" INTEGER NOT NULL,
    "authorizedUserId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthorizedUsersOnCollections_pkey" PRIMARY KEY ("collectionId","authorizedUserId")
);

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorizedUsersOnCollections" ADD CONSTRAINT "AuthorizedUsersOnCollections_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorizedUsersOnCollections" ADD CONSTRAINT "AuthorizedUsersOnCollections_authorizedUserId_fkey" FOREIGN KEY ("authorizedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
