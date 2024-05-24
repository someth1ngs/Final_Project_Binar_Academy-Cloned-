/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `categories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "categories_type_key" ON "categories"("type");
