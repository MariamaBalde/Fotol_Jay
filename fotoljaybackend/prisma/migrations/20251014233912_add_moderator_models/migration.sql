-- AlterTable
ALTER TABLE "Utilisateur" ADD COLUMN "statutModerateur" TEXT DEFAULT 'ACTIF';

-- CreateTable
CREATE TABLE "DecisionModeration" (
    "id" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "commentaire" TEXT,
    "tempsDecision" INTEGER NOT NULL,
    "produitId" TEXT NOT NULL,
    "moderateParId" TEXT NOT NULL,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DecisionModeration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackModerateur" (
    "id" TEXT NOT NULL,
    "note" INTEGER NOT NULL,
    "commentaire" TEXT,
    "type" TEXT NOT NULL,
    "moderateurId" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedbackModerateur_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DecisionModeration_moderateParId_dateCreation_idx" 
    ON "DecisionModeration"("moderateParId", "dateCreation");

-- AddForeignKey
ALTER TABLE "DecisionModeration" ADD CONSTRAINT "DecisionModeration_produitId_fkey"
    FOREIGN KEY ("produitId") REFERENCES "Produit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DecisionModeration" ADD CONSTRAINT "DecisionModeration_moderateParId_fkey"
    FOREIGN KEY ("moderateParId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackModerateur" ADD CONSTRAINT "FeedbackModerateur_moderateurId_fkey" FOREIGN KEY ("moderateurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackModerateur" ADD CONSTRAINT "FeedbackModerateur_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;
