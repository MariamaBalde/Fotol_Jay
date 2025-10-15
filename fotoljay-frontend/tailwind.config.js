/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette moderne inspirée du design e-commerce (orange corail)
        primary: '#F9A826', // Orange corail - Couleur principale (CTA, prix)
        secondary: '#2B8B8B', // Teal - Couleur secondaire (liens, accents)
        accent: '#FFD700', // Doré - VIP et éléments premium
        background: '#FFFFFF', // Blanc pur - Fond principal
        surface: '#F7F7F7', // Gris très clair - Fonds secondaires
        surfaceSecondary: '#FAFAFA', // Gris encore plus clair - Variations
        textPrimary: '#212121', // Charbon foncé - Titres et texte principal
        textSecondary: '#757575', // Gris moyen - Descriptions et métadonnées
        textMuted: '#BDBDBD', // Gris clair - Texte désactivé/placeholder

        // Couleurs fonctionnelles (statuts et feedback)
        success: '#27AE60', // Vert - Succès, approuvé
        error: '#E53935', // Rouge - Erreur, refusé
        warning: '#FB8C00', // Orange - Avertissement, expiration
        info: '#42A5F5', // Bleu - Information, en attente
        disabled: '#E0E0E0', // Gris neutre - Désactivé

        // Spécifique à l'app
        vip: '#FFD700', // Doré pour VIP
        vipAccent: '#FFED4E', // Doré clair pour effets VIP
        border: '#E9ECEF', // Bordures légères
        shadow: 'rgba(0,0,0,0.1)', // Ombres douces

        // Variante mode sombre (optionnel)
        dark: {
          background: '#0D1117',
          surface: '#1E1E1E',
          textPrimary: '#E0E0E0',
          textSecondary: '#BDBDBD',
          primary: '#F9A826',
          accent: '#FFD700',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0,0,0,0.1)',
        'medium': '0 4px 12px rgba(0,0,0,0.15)',
        'large': '0 8px 24px rgba(0,0,0,0.2)',
        'vip': '0 4px 16px rgba(255, 215, 0, 0.3)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}