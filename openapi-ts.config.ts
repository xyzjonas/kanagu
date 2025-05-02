import { defineConfig } from '@hey-api/openapi-ts'

const BASE_URL = process.env.BASE_URL ?? 'http://10.0.0.244'


export default defineConfig({
  input: `${BASE_URL}/swagger/v1/swagger.json`,
  output: 'src/client',
  plugins: [
    {
      name: '@hey-api/client-fetch',
    //   runtimeConfigPath: './src/hey-api.ts'
    }
  ]
})
