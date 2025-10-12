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
    ADD COLUMN `dateCreation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `estLu` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `titre` VARCHAR(191) NOT NULL,
    ADD COLUMN `utilisateurId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Product`;

-- DropTable
DROP TABLE `ProductImage`;

-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `Utilisateur` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `motDePasse` VARCHAR(191) NOT NULL,
    `prenom` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(191) NOT NULL,
    `photoProfil` VARCHAR(191) NULL,
    `localisation` VARCHAR(191) NULL,
    `role` ENUM('UTILISATEUR', 'VIP', 'MODERATEUR', 'ADMINISTRATEUR') NOT NULL DEFAULT 'UTILISATEUR',
    `finVip` DATETIME(3) NULL,
    `dateCreation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateMiseAJour` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Utilisateur_email_key`(`email`),
    INDEX `Utilisateur_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Produit` (
    `id` VARCHAR(191) NOT NULL,
    `titre` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `prix` DOUBLE NOT NULL,
    `categorie` VARCHAR(191) NOT NULL,
    `etat` VARCHAR(191) NOT NULL,
    `statut` ENUM('EN_ATTENTE', 'APPROUVE', 'REFUSE', 'EXPIRE') NOT NULL DEFAULT 'EN_ATTENTE',
    `raisonRefus` TEXT NULL,
    `vues` INTEGER NOT NULL DEFAULT 0,
    `nombreContacts` INTEGER NOT NULL DEFAULT 0,
    `utilisateurId` VARCHAR(191) NOT NULL,
    `dateCreation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateExpiration` DATETIME(3) NOT NULL,
    `dateMiseAJour` DATETIME(3) NOT NULL,

    INDEX `Produit_statut_dateCreation_idx`(`statut`, `dateCreation`),
    INDEX `Produit_utilisateurId_idx`(`utilisateurId`),
    INDEX `Produit_dateExpiration_idx`(`dateExpiration`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImageProduit` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `ordre` INTEGER NOT NULL,
    `produitId` VARCHAR(191) NOT NULL,
    `dateCreation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ImageProduit_produitId_idx`(`produitId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Notification_utilisateurId_estLu_idx` ON `Notification`(`utilisateurId`, `estLu`);

-- CreateIndex
CREATE INDEX `Notification_dateCreation_idx` ON `Notification`(`dateCreation`);

-- AddForeignKey
ALTER TABLE `Produit` ADD CONSTRAINT `Produit_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `Utilisateur`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImageProduit` ADD CONSTRAINT `ImageProduit_produitId_fkey` FOREIGN KEY (`produitId`) REFERENCES `Produit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `Utilisateur`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
