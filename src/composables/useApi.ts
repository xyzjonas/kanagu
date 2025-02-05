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

  // const items: { [key: string]: Item } = {
  //   bolt14: {
  //     id: '938-016-0800-12',
  //     name: 'Šr. závit do oceli 8.4 M14'
  //   },
  //   bolt12: {
  //     id: '938-016-0800-12',
  //     name: 'Šr. závit do oceli 8.4 M12'
  //   },
  //   bolt10: {
  //     id: '938-016-0800-12',
  //     name: 'Šr. závit do oceli 8.4 M10'
  //   }
  // }

  // function getRandomCount(number: number) {
  //   return Math.ceil((1 + Math.random()) * 10 * Math.pow(number + 1 + 10, 2))
  // }

  // function randomBool() {
  //   return Math.random() > 0.5
  // }

  // function resetDummyData() {
  //   receiveOrders.value = []
  //   const now = new Date()
  //   for (let index = 0; index < 10; index++) {
  //     receiveOrders.value.push({
  //       id: `P000490809910428069${index}`,
  //       supplier: 'FISCHER',
  //       received: now.toISOString(),
  //       rackId: 'A3552-22-ax',
  //       resolved: randomBool(),
  //       items: [
  //         {
  //           id: `order-item-${index}-1`,
  //           item: items.bolt14,
  //           count: getRandomCount(index),
  //           resolved: randomBool(),
  //         },
  //         {
  //           id: `order-item-${index}-2`,
  //           item: items.bolt12,
  //           count: getRandomCount(index),
  //           resolved: randomBool(),
  //         },
  //         {
  //           id: `order-item-${index}-3`,
  //           item: items.bolt10,
  //           count: getRandomCount(index),
  //           resolved: randomBool(),
  //         }
  //       ]
  //     })
  //   }

  //   $q.notify({
  //     color: "positive",
  //     message: "Testovací data úspěšně resetována"
  //   })
    
  // }

  // if (receiveOrders.value.length === 0) {
  //   resetDummyData()
  // }

  const testConnection = async () => {
    try {
      await postLogin({ body: { email: "", password: "" } })
      $q.notify({
        color: 'positive',
        message: 'Test připojení proběhl úspěšně!'
      })
    } catch(err: unknown) {
      console.error(err)
      $q.notify({
        color: 'negative',
        message: 'Připojení selhalo, zkus zkontrolovat adresu serveru'
      })
    }
  }

  const getStockinOrders = async () => {
    const res = await getApiStockDocumentApi({
      query: {
        type: 'STOCKIN'
      }
    })
    return res.data
  }

  const getStockoutOrders = async () => {
    const res = await getApiStockDocumentApi({
      query: {
        type: 'STOCKOUT'
      }
    })
    return res.data
  }

  return {
    getStockinOrders,
    getStockoutOrders,
    // purchaseOrders,
    // resetDummyData,
    testConnection,
    baseUrl,
  }
}
