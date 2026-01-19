/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the column `deletedBy` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the `cart_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `carts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `images` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sizes` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountId` to the `tokens` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'ADMIN', 'EMPLOYEE');

-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_cartId_fkey";

-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "carts" DROP CONSTRAINT "carts_userId_fkey";

-- DropForeignKey
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_userId_fkey";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "imageUrl";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "imageUrl",
DROP COLUMN "price",
ADD COLUMN     "images" JSONB NOT NULL,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "sizes" JSONB NOT NULL,
ADD COLUMN     "thumbnail" TEXT;

-- AlterTable
ALTER TABLE "tokens" DROP COLUMN "createdBy",
DROP COLUMN "deletedAt",
DROP COLUMN "deletedBy",
DROP COLUMN "updatedBy",
DROP COLUMN "userId",
ADD COLUMN     "accountId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "cart_items";

-- DropTable
DROP TABLE "carts";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "accounts" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phoneNumber" VARCHAR(20),
    "fullName" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'OTHER',
    "role" "Role" NOT NULL DEFAULT 'CLIENT',
    "imageUrl" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" INTEGER,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
