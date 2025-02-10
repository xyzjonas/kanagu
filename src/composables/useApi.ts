import { useLocalStorage } from '@vueuse/core'
import { useQuasar } from 'quasar'
import { watch } from 'vue'

import { client } from '@/client/client.gen'
import {
  getApiStockDocumentApi,
  getApiStockDocumentApiByStockDocumentNumber,
  postLogin,
  postRefresh
} from '@/client'
import { useAuth } from './useAuth'
import { useRouter } from 'vue-router'

export interface Item {
  id: string
  name: string
}

export interface OrderItem {
  id: string
  item: Item
  count: number
  resolved: boolean
}

export interface ReceiveOrder {
  id: string
  received: string
  items: OrderItem[]
  supplier: string
  rackId: string
  resolved: boolean
}

export type DocumentFilter = 'FULLFILED' | 'UNFULLFILED'
export type DocumentType = 'STOCKIN' | 'STOCKOUT'

export interface StockDocumentArgs {
  type: DocumentType
  page?: number
  currentFilter?: DocumentFilter
  searchString?: string
}

const baseUrl = useLocalStorage<string>('base-api-url', 'http://138.199.147.236:8080')

watch(baseUrl, (baseUrl) => {
  client.setConfig({ baseUrl })
})

export const useApi = () => {
  const { currentRoute, push } = useRouter()
  const $q = useQuasar()

  const { token, expiresAt, logout, refresh } = useAuth()

  client.interceptors.request.use((request) => {
    request.headers.set('Authorization', `Bearer ${token.value}`)

    const isForbiddenUrl = request.url.includes("refresh") || request.url.includes("login")
    const deltaMinutes = (expiresAt.value.getTime() - new Date().getTime()) / 1000 / 60
    if (!isForbiddenUrl && deltaMinutes < 30) {
      console.debug(`Refreshing token to be expired at: ${expiresAt.value}`)
      refresh()
    }

    return request
  })

  const relogin = () => {
    $q.notify({
      type: 'negative',
      message: 'Přihlášení vypršelo. Přihlaste se znovu.'
    })
    logout()
    const encodedRoute = encodeURIComponent(JSON.stringify({
      name: currentRoute.value.name,
      query: currentRoute.value.query,
      path: currentRoute.value.path,
      params: currentRoute.value.params,
    }))
    push({ name: 'login', query: { redirect: encodedRoute } })
  }

  const testConnection = async () => {
    try {
      await postLogin({ body: { email: '', password: '' } })
      $q.notify({
        type: 'positive',
        message: 'Test připojení proběhl úspěšně!'
      })
    } catch (err: unknown) {
      $q.notify({
        type: 'negative',
        message: 'Připojení selhalo, zkontrolujte nastavení připojení.',
        caption: `${err}`,
      })
    }
  }

  // API call
  const getStockDocuments = async (args: StockDocumentArgs) => {
    try {
      const res = await getApiStockDocumentApi({
        query: { ...args }
      })
      return res.data ?? []
    } catch (err: unknown) {
      relogin()
    }
  }

  // API call
  const getStockDocument = async (id: string) => {
    try {

      const res = await getApiStockDocumentApiByStockDocumentNumber({
        path: {
          stockDocumentNumber: id
        }
      })
      return res.data
    } catch (err: unknown) {
      relogin()
    }
  }

  return {
    getStockDocument,
    getStockDocuments,
    testConnection,
    baseUrl
  }
}
