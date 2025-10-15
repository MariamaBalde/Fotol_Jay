-- CreateTable
CREATE TABLE `Signalement` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `raison` TEXT NOT NULL,
    `description` TEXT NOT NULL,
    `statut` VARCHAR(191) NOT NULL DEFAULT 'EN_ATTENTE',
    `signaleurId` VARCHAR(191) NOT NULL,
    `cibleId` VARCHAR(191) NOT NULL,
    `cibleType` VARCHAR(191) NOT NULL,
    `traiteParId` VARCHAR(191) NULL,
    `dateCreation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateTraitement` DATETIME(3) NULL,

    INDEX `Signalement_statut_idx`(`statut`),
    INDEX `Signalement_cibleType_cibleId_idx`(`cibleType`, `cibleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ErreurSysteme` (
    `id` VARCHAR(191) NOT NULL,
    `niveau` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `stackTrace` TEXT NULL,
    `url` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `ip` VARCHAR(191) NULL,
    `utilisateurId` VARCHAR(191) NULL,
    `dateCreation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ErreurSysteme_niveau_dateCreation_idx`(`niveau`, `dateCreation`),
    INDEX `ErreurSysteme_utilisateurId_idx`(`utilisateurId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ParametreVIP` (
    `id` VARCHAR(191) NOT NULL,
    `cle` VARCHAR(191) NOT NULL,
    `valeur` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'STRING',
    `dateCreation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateMiseAJour` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ParametreVIP_cle_key`(`cle`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Signalement` ADD CONSTRAINT `Signalement_signaleurId_fkey` FOREIGN KEY (`signaleurId`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Signalement` ADD CONSTRAINT `Signalement_traiteParId_fkey` FOREIGN KEY (`traiteParId`) REFERENCES `Utilisateur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ErreurSysteme` ADD CONSTRAINT `ErreurSysteme_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `Utilisateur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
