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
        sans: 'Inter:200,300,400,500,600'
      }
    })
  ],
  theme: {
    colors: {
      primary: "#3e608a",
      secondary: "#3e608a",
      positive: "#4ea152",
      negative: "#c01818",
      stockout: "#007074",
      stockin: "#3e608a",
      quicksell: "#d05630"
    }
  },
})
