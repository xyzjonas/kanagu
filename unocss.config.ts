// uno.config.ts
import { defineConfig, presetUno, presetIcons, presetWebFonts } from 'unocss'

export default defineConfig({
  rules: [],
  shortcuts: {
    "app-page": "max-w-7xl mx-auto font-sans"
  },
  presets: [
    // https://icones.js.org/collection/hugeicons
    presetIcons({
      extraProperties: {
        'vertical-align': 'middle'
      }
    }),
    presetUno(),
    presetWebFonts({
      provider: 'bunny',
      fonts: {
        sans: 'Poppins:200,300,400,500,600'
      }
    })
  ],
  theme: {
    colors: {
      primary: "#e03a3c",
      secondary: "#3e608a",
    }
  },
})
