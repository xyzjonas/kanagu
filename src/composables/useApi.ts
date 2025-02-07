import { useLocalStorage } from '@vueuse/core'
import { useQuasar } from 'quasar'
import { watch } from 'vue'

import { client } from '@/client/client.gen';
import { getApiStockDocumentApi, postLogin } from '@/client';
import { useAuth } from './useAuth';

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

export type DocumentFilter = "FULLFILED" | "UNFULLFILED"
export type DocumentType = "STOCKIN" | "STOCKOUT"

export interface StockDocumentArgs {
  type: DocumentType
  pageNum?: number
  filter?: DocumentFilter
}

const baseUrl = useLocalStorage<string>('base-api-url', 'http://138.199.147.236:8080')
// const receiveOrders = useLocalStorage<ReceiveOrder[]>('receive-orders', [])

watch(baseUrl, (baseUrl) => {
  client.setConfig({ baseUrl });
})

export const useApi = () => {

  const $q = useQuasar()

  const { token } = useAuth()

  client.interceptors.request.use((request) => {
    request.headers.set('Authorization', `Bearer ${token.value}`); 
    return request;
  });

  const testConnection = async () => {
    try {
      await postLogin({ body: { email: "", password: "" } })
      $q.notify({
        type: 'positive',
        message: 'Test připojení proběhl úspěšně!'
      })
    } catch(err: unknown) {
      console.error(err)
      $q.notify({
        type: 'negative',
        message: 'Připojení selhalo, zkontrolujte nastavení připojení.'
      })
    }
  }

  const getStockDocuments = async (args: StockDocumentArgs) => {
    const res = await getApiStockDocumentApi({
      query: {...args}
    })
    return res.data ?? []
  }

  return {
    getStockDocuments,
    testConnection,
    baseUrl,
  }
}
