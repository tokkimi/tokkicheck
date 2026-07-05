-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "nameKo" TEXT NOT NULL,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "nameKo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "barcode" TEXT,
    "nameKo" TEXT NOT NULL,
    "brandKo" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "imageFront" TEXT NOT NULL,
    "imageBack" TEXT,
    "calories" INTEGER,
    "servingSizeG" INTEGER,
    "carbsG" REAL,
    "proteinG" REAL,
    "fatG" REAL,
    "sugarG" REAL,
    "sodiumMg" REAL,
    "ingredientsKo" TEXT,
    "allergensKo" TEXT,
    "price" INTEGER,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ratingAvg" REAL NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ManufacturingIssue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT,
    "countryId" TEXT,
    "titleKo" TEXT NOT NULL,
    "descriptionKo" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "severity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ManufacturingIssue_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ManufacturingIssue_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductRating" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductRating_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "nameKo" TEXT NOT NULL,
    "brandKo" TEXT NOT NULL,
    "categoryId" TEXT,
    "countryNameKo" TEXT,
    "imageFront" TEXT,
    "imageBack" TEXT,
    "note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reviewNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" DATETIME,
    CONSTRAINT "ProductRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AiDiscoveredProduct" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nameKo" TEXT NOT NULL,
    "brandKo" TEXT NOT NULL,
    "categorySlug" TEXT,
    "countryNameKo" TEXT,
    "sourceStore" TEXT,
    "sourceUrl" TEXT,
    "imageFront" TEXT,
    "calories" INTEGER,
    "rawNote" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "discoveredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Country_code_key" ON "Country"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Product_barcode_key" ON "Product"("barcode");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_countryId_idx" ON "Product"("countryId");

-- CreateIndex
CREATE INDEX "Product_isNew_idx" ON "Product"("isNew");

-- CreateIndex
CREATE UNIQUE INDEX "ProductRating_productId_userId_key" ON "ProductRating"("productId", "userId");
