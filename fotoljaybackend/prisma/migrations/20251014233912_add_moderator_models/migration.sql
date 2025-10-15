-- AlterTable
ALTER TABLE `Utilisateur` ADD COLUMN `statutModerateur` VARCHAR(191) NULL DEFAULT 'ACTIF';

-- CreateTable
CREATE TABLE `DecisionModeration` (
    `id` VARCHAR(191) NOT NULL,
    `decision` VARCHAR(191) NOT NULL,
    `commentaire` TEXT NULL,
    `tempsDecision` INTEGER NOT NULL,
    `produitId` VARCHAR(191) NOT NULL,
    `moderateParId` VARCHAR(191) NOT NULL,
    `dateCreation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `DecisionModeration_moderateParId_dateCreation_idx`(`moderateParId`, `dateCreation`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeedbackModerateur` (
    `id` VARCHAR(191) NOT NULL,
    `note` INTEGER NOT NULL,
    `commentaire` TEXT NULL,
    `type` VARCHAR(191) NOT NULL,
    `moderateurId` VARCHAR(191) NOT NULL,
    `utilisateurId` VARCHAR(191) NOT NULL,
    `dateCreation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `FeedbackModerateur_moderateurId_idx`(`moderateurId`),
    INDEX `FeedbackModerateur_utilisateurId_idx`(`utilisateurId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DecisionModeration` ADD CONSTRAINT `DecisionModeration_produitId_fkey` FOREIGN KEY (`produitId`) REFERENCES `Produit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DecisionModeration` ADD CONSTRAINT `DecisionModeration_moderateParId_fkey` FOREIGN KEY (`moderateParId`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeedbackModerateur` ADD CONSTRAINT `FeedbackModerateur_moderateurId_fkey` FOREIGN KEY (`moderateurId`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeedbackModerateur` ADD CONSTRAINT `FeedbackModerateur_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `Utilisateur`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
