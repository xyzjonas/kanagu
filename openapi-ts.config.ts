import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: 'http://138.199.147.236:8080/swagger/v1/swagger.json',
  output: 'src/client',
  plugins: [
    {
      name: '@hey-api/client-fetch',
    //   runtimeConfigPath: './src/hey-api.ts'
    }
  ]
})
