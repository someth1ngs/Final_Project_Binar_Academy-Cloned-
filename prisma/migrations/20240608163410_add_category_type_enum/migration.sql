/*
  Warnings:

  - Changed the type of `type` on the `categories` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CATEGORY_TYPE" AS ENUM ('adult', 'child', 'baby');

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "type",
ADD COLUMN     "type" "CATEGORY_TYPE" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "categories_type_key" ON "categories"("type");
