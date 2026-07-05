-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "originCountryCodes" TEXT[] DEFAULT ARRAY[]::TEXT[];
