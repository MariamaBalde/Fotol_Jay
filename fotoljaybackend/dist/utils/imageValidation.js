export class ValidationImage {
    // Valider les dimensions minimales
    static validerDimensions(largeur, hauteur, largeurMin = 400, hauteurMin = 400) {
        const erreurs = [];
        if (largeur < largeurMin) {
            erreurs.push(`La largeur doit être au moins ${largeurMin}px (actuelle: ${largeur}px)`);
        }
        if (hauteur < hauteurMin) {
            erreurs.push(`La hauteur doit être au moins ${hauteurMin}px (actuelle: ${hauteur}px)`);
        }
        return {
            valide: erreurs.length === 0,
            erreurs,
        };
    }
    // Valider le ratio (pour éviter les images trop étirées)
    static validerRatio(largeur, hauteur) {
        const ratio = largeur / hauteur;
        const erreurs = [];
        // Ratio acceptable entre 0.5 (vertical) et 2 (horizontal)
        if (ratio < 0.5 || ratio > 2) {
            erreurs.push(`Le ratio de l'image doit être entre 1:2 et 2:1 (actuel: ${ratio.toFixed(2)})`);
        }
        return {
            valide: erreurs.length === 0,
            erreurs,
        };
    }
    // Valider le nombre d'images
    static validerNombre(fichiers, min = 1, max = 5) {
        const erreurs = [];
        if (!fichiers || fichiers.length === 0) {
            erreurs.push(`Au moins ${min} image est requise`);
        }
        else if (fichiers.length < min) {
            erreurs.push(`Minimum ${min} image(s) requise(s) (actuellement: ${fichiers.length})`);
        }
        else if (fichiers.length > max) {
            erreurs.push(`Maximum ${max} images autorisées (actuellement: ${fichiers.length})`);
        }
        return {
            valide: erreurs.length === 0,
            erreurs,
        };
    }
    // Validation complète
    static async validerTout(fichiers, options = {}) {
        const { largeurMin = 400, hauteurMin = 400, validerRatio = true, min = 1, max = 5, } = options;
        const erreurs = [];
        // Valider le nombre
        const validationNombre = this.validerNombre(fichiers, min, max);
        erreurs.push(...validationNombre.erreurs);
        if (!validationNombre.valide) {
            return { valide: false, erreurs };
        }
        // Valider chaque image (dimensions seront vérifiées après traitement)
        // Pour l'instant, on fait confiance à Multer pour le type MIME
        return {
            valide: erreurs.length === 0,
            erreurs,
        };
    }
}
//# sourceMappingURL=imageValidation.js.map