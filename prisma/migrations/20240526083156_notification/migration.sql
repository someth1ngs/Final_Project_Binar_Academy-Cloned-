/*
  Warnings:

  - You are about to drop the column `ticket_price` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `from_id` on the `flights` table. All the data in the column will be lost.
  - You are about to drop the column `plane_id` on the `flights` table. All the data in the column will be lost.
  - You are about to drop the column `to_id` on the `flights` table. All the data in the column will be lost.
  - The `status` column on the `payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[airport_code]` on the table `airports` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[plane_code]` on the table `planes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `airport_code` to the `airports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_price` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `from_code` to the `flights` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plane_code` to the `flights` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_code` to the `flights` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qr_url` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "STATUS_PAID" AS ENUM ('ISSUED', 'UNPAID', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "flights" DROP CONSTRAINT "flights_from_id_fkey";

-- DropForeignKey
ALTER TABLE "flights" DROP CONSTRAINT "flights_plane_id_fkey";

-- DropForeignKey
ALTER TABLE "flights" DROP CONSTRAINT "flights_to_id_fkey";

-- AlterTable
ALTER TABLE "airports" ADD COLUMN     "airport_code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "ticket_price",
ADD COLUMN     "include_return" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "total_price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "flights" DROP COLUMN "from_id",
DROP COLUMN "plane_id",
DROP COLUMN "to_id",
ADD COLUMN     "from_code" TEXT NOT NULL,
ADD COLUMN     "is_return" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "plane_code" TEXT NOT NULL,
ADD COLUMN     "return_arriveAt" TIMESTAMP(3),
ADD COLUMN     "return_departureAt" TIMESTAMP(3),
ADD COLUMN     "to_code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "qr_url" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "STATUS_PAID" NOT NULL DEFAULT 'UNPAID';

-- CreateIndex
CREATE UNIQUE INDEX "airports_airport_code_key" ON "airports"("airport_code");

-- CreateIndex
CREATE UNIQUE INDEX "planes_plane_code_key" ON "planes"("plane_code");

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_plane_code_fkey" FOREIGN KEY ("plane_code") REFERENCES "planes"("plane_code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_from_code_fkey" FOREIGN KEY ("from_code") REFERENCES "airports"("airport_code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_to_code_fkey" FOREIGN KEY ("to_code") REFERENCES "airports"("airport_code") ON DELETE CASCADE ON UPDATE CASCADE;
