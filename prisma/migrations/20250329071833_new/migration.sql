/*
  Warnings:

  - You are about to drop the `CategoryStore` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CategoryStore" DROP CONSTRAINT "CategoryStore_storeId_fkey";

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "isOpen" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "CategoryStore";

-- CreateTable
CREATE TABLE "StoreCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoreCategoryRelation" (
    "id" SERIAL NOT NULL,
    "storeId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoreCategoryRelation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StoreCategory_name_key" ON "StoreCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "StoreCategory_slug_key" ON "StoreCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "StoreCategoryRelation_storeId_categoryId_key" ON "StoreCategoryRelation"("storeId", "categoryId");

-- AddForeignKey
ALTER TABLE "StoreCategoryRelation" ADD CONSTRAINT "StoreCategoryRelation_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreCategoryRelation" ADD CONSTRAINT "StoreCategoryRelation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "StoreCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
