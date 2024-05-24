/*
  Warnings:

  - You are about to drop the column `capacity` on the `planes` table. All the data in the column will be lost.
  - Added the required column `baggage` to the `planes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "planes" DROP COLUMN "capacity",
ADD COLUMN     "baggage" INTEGER NOT NULL,
ADD COLUMN     "cabin_baggage" INTEGER NOT NULL DEFAULT 15,
ALTER COLUMN "economy_seat" SET DEFAULT 5;
