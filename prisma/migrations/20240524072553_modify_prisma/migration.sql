/*
  Warnings:

  - You are about to drop the column `image` on the `profiles` table. All the data in the column will be lost.
  - Added the required column `citizenship` to the `passengers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "passengers" ADD COLUMN     "citizenship" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "image";
