module.exports = {
  theme: {
    extend: {
      colors: {
        yassir: {
          DEFAULT: '#7B2CBF', // Violet principal
          light: '#9D4EDD',   // Violet clair au survol
          dark: '#5A189A',    // Violet foncé
        },
        status: {
          success: '#10B981', // Vert émeraude (Delivered)
          error: '#F87171',   // Rouge pastel (Cancelled)
          warning: '#FBBF24', // Jaune moutarde (En cours)
        },
        background: '#F8F9FA', // Gris très clair pour contraster les cartes
      }
    }
  }
}
