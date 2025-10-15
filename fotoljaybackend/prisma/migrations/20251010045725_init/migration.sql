/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `isRead` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `titre` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `utilisateurId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Notification` DROP FOREIGN KEY `Notification_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_userId_fkey`;

-- DropForeignKey
ALTER TABLE `ProductImage` DROP FOREIGN KEY `ProductImage_productId_fkey`;

-- DropIndex
DROP INDEX `Notification_createdAt_idx` ON `Notification`;

-- DropIndex
DROP INDEX `Notification_userId_isRead_idx` ON `Notification`;

-- AlterTable
ALTER TABLE `Notification` DROP COLUMN `createdAt`,
    DROP COLUMN `isRead`,
    DROP COLUMN `title`,
    DROP COLUMN `userId`,
    ADD COLUMN `dateCreation` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN `estLu` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `titre` TEXT NOT NULL,
    ADD COLUMN `utilisateurId` TEXT NOT NULL;

-- DropTable
DROP TABLE `Product`;

-- DropTable
DROP TABLE `ProductImage`;

-- DropTable
DROP TABLE `User`;

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('UTILISATEUR', 'VIP', 'MODERATEUR', 'ADMINISTRATEUR');

-- CreateEnum
CREATE TYPE "StatutProduit" AS ENUM ('EN_ATTENTE', 'APPROUVE', 'REFUSE', 'EXPIRE');

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "photoProfil" TEXT,
    "localisation" TEXT,
    "role" "Role" NOT NULL DEFAULT 'UTILISATEUR',
    "finVip" TIMESTAMP(3),
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produit" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prix" DOUBLE PRECISION NOT NULL,
    "categorie" TEXT NOT NULL,
    "etat" TEXT NOT NULL,
    "statut" "StatutProduit" NOT NULL DEFAULT 'EN_ATTENTE',
    "raisonRefus" TEXT,
    "vues" INTEGER NOT NULL DEFAULT 0,
    "nombreContacts" INTEGER NOT NULL DEFAULT 0,
    "utilisateurId" TEXT NOT NULL,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Produit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageProduit" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL,
    "produitId" TEXT NOT NULL,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImageProduit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "estLu" BOOLEAN NOT NULL DEFAULT false,
    "utilisateurId" TEXT NOT NULL,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");
CREATE INDEX "Utilisateur_email_idx" ON "Utilisateur"("email");
CREATE INDEX "Produit_utilisateurId_statut_idx" ON "Produit"("utilisateurId", "statut");
CREATE INDEX "ImageProduit_produitId_idx" ON "ImageProduit"("produitId");
CREATE INDEX "Notification_utilisateurId_estLu_idx" ON "Notification"("utilisateurId", "estLu");
CREATE INDEX "Notification_dateCreation_idx" ON "Notification"("dateCreation");

-- AddForeignKey
ALTER TABLE "Produit" ADD CONSTRAINT "Produit_utilisateurId_fkey" 
    FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageProduit" ADD CONSTRAINT "ImageProduit_produitId_fkey" 
    FOREIGN KEY ("produitId") REFERENCES "Produit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_utilisateurId_fkey" 
    FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;
