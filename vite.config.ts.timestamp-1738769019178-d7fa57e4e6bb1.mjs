// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { VitePWA } from "file:///home/jonas/Projects/personal/kanagu/node_modules/vite-plugin-pwa/dist/index.js";
import { defineConfig } from "file:///home/jonas/Projects/personal/kanagu/node_modules/vite/dist/node/index.js";
import vue from "file:///home/jonas/Projects/personal/kanagu/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { quasar, transformAssetUrls } from "file:///home/jonas/Projects/personal/kanagu/node_modules/@quasar/vite-plugin/src/index.js";
import UnoCSS from "file:///home/jonas/Projects/personal/kanagu/node_modules/unocss/dist/vite.mjs";
var __vite_injected_original_import_meta_url = "file:///home/jonas/Projects/personal/kanagu/vite.config.ts";
var vite_config_default = defineConfig({
  base: process.env.BASE_URL,
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    // @quasar/plugin-vite options list:
    // https://github.com/quasarframework/quasar/blob/dev/vite-plugin/index.d.ts
    quasar({
      sassVariables: fileURLToPath(
        new URL("./src/quasar-variables.scss", __vite_injected_original_import_meta_url)
      )
    }),
    UnoCSS(),
    VitePWA({
      manifest: {
        name: "Sklad",
        short_name: "Sklad",
        description: "Skladov\xE1 aplikace pro p\u0159\xEDjem a v\xFDdej zbo\u017E\xED.",
        theme_color: "#3e608a",
        background_color: "#3e608a",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png"
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      },
      registerType: "autoUpdate",
      devOptions: {
        enabled: false
      }
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9qb25hcy9Qcm9qZWN0cy9wZXJzb25hbC9rYW5hZ3VcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2pvbmFzL1Byb2plY3RzL3BlcnNvbmFsL2thbmFndS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9qb25hcy9Qcm9qZWN0cy9wZXJzb25hbC9rYW5hZ3Uvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcblxuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSdcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCB7IHF1YXNhciwgdHJhbnNmb3JtQXNzZXRVcmxzIH0gZnJvbSAnQHF1YXNhci92aXRlLXBsdWdpbidcbmltcG9ydCBVbm9DU1MgZnJvbSAndW5vY3NzL3ZpdGUnXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBiYXNlOiBwcm9jZXNzLmVudi5CQVNFX1VSTCxcbiAgcGx1Z2luczogW1xuICAgIHZ1ZSh7XG4gICAgICB0ZW1wbGF0ZTogeyB0cmFuc2Zvcm1Bc3NldFVybHMgfVxuICAgIH0pLFxuICAgIC8vIEBxdWFzYXIvcGx1Z2luLXZpdGUgb3B0aW9ucyBsaXN0OlxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFzYXJmcmFtZXdvcmsvcXVhc2FyL2Jsb2IvZGV2L3ZpdGUtcGx1Z2luL2luZGV4LmQudHNcbiAgICBxdWFzYXIoe1xuICAgICAgc2Fzc1ZhcmlhYmxlczogZmlsZVVSTFRvUGF0aChcbiAgICAgICAgbmV3IFVSTCgnLi9zcmMvcXVhc2FyLXZhcmlhYmxlcy5zY3NzJywgaW1wb3J0Lm1ldGEudXJsKVxuICAgICAgKVxuICAgIH0pLFxuICAgIFVub0NTUygpLFxuICAgIFZpdGVQV0Eoe1xuICAgICAgbWFuaWZlc3Q6IHtcbiAgICAgICAgbmFtZTogJ1NrbGFkJyxcbiAgICAgICAgc2hvcnRfbmFtZTogJ1NrbGFkJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdTa2xhZG92XHUwMEUxIGFwbGlrYWNlIHBybyBwXHUwMTU5XHUwMEVEamVtIGEgdlx1MDBGRGRlaiB6Ym9cdTAxN0VcdTAwRUQuJyxcbiAgICAgICAgdGhlbWVfY29sb3I6ICcjM2U2MDhhJyxcbiAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogJyMzZTYwOGEnLFxuICAgICAgICBpY29uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogJ3B3YS02NHg2NC5wbmcnLFxuICAgICAgICAgICAgc2l6ZXM6ICc2NHg2NCcsXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiAncHdhLTE5MngxOTIucG5nJyxcbiAgICAgICAgICAgIHNpemVzOiAnMTkyeDE5MicsXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiAncHdhLTUxMng1MTIucG5nJyxcbiAgICAgICAgICAgIHNpemVzOiAnNTEyeDUxMicsXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiAnbWFza2FibGUtaWNvbi01MTJ4NTEyLnBuZycsXG4gICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgICAgICBwdXJwb3NlOiAnbWFza2FibGUnXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgcmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZScsXG4gICAgICBkZXZPcHRpb25zOiB7XG4gICAgICAgIGVuYWJsZWQ6IGZhbHNlXG4gICAgICB9XG4gICAgfSlcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKVxuICAgIH1cbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOFIsU0FBUyxlQUFlLFdBQVc7QUFFalUsU0FBUyxlQUFlO0FBQ3hCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixTQUFTLFFBQVEsMEJBQTBCO0FBQzNDLE9BQU8sWUFBWTtBQU42SixJQUFNLDJDQUEyQztBQVNqTyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFNLFFBQVEsSUFBSTtBQUFBLEVBQ2xCLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxNQUNGLFVBQVUsRUFBRSxtQkFBbUI7QUFBQSxJQUNqQyxDQUFDO0FBQUE7QUFBQTtBQUFBLElBR0QsT0FBTztBQUFBLE1BQ0wsZUFBZTtBQUFBLFFBQ2IsSUFBSSxJQUFJLCtCQUErQix3Q0FBZTtBQUFBLE1BQ3hEO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxPQUFPO0FBQUEsSUFDUCxRQUFRO0FBQUEsTUFDTixVQUFVO0FBQUEsUUFDUixNQUFNO0FBQUEsUUFDTixZQUFZO0FBQUEsUUFDWixhQUFhO0FBQUEsUUFDYixhQUFhO0FBQUEsUUFDYixrQkFBa0I7QUFBQSxRQUNsQixPQUFPO0FBQUEsVUFDTDtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFVBQ1I7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDUjtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNSO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFlBQ04sU0FBUztBQUFBLFVBQ1g7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLE1BQ0EsY0FBYztBQUFBLE1BQ2QsWUFBWTtBQUFBLFFBQ1YsU0FBUztBQUFBLE1BQ1g7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3REO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
