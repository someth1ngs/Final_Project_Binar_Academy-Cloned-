-- AlterTable
ALTER TABLE "planes" ALTER COLUMN "economy_seat" DROP DEFAULT,
ALTER COLUMN "baggage" SET DEFAULT 15,
ALTER COLUMN "cabin_baggage" SET DEFAULT 5;
