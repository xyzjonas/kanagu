import { useQuasar } from 'quasar'

import {
  getApiCustomerApi,
  getApiFastOrderApiPaymentTypes,
  getApiStockDocumentApi,
  getApiStockDocumentApiByStockDocumentNumber,
  getApiStockMovementApiById,
  getApiStockProductApi,
  getApiWarehousePlaceApi,
  postApiFastOrderApi,
  postApiStockMovementApi,
  postApiStockMovementApiPrintExportLabel,
  postApiStockMovementApiPrintImportLabel,
  postLogin,
  type FastOrder,
  type StockDocument,
  type StockDocumentPagedData
} from '@/client'
import { client } from '@/client/client.gen'
import { useRouter } from 'vue-router'
import { useAuth } from './useAuth'

export interface PostStockMovement {
  // fake interface for post movement body
  id: number
  stockProductId: number
  place?: string
  value: number
  lineNumber: number
  Values: string
}

export type DocumentFilter = 'FULFILLED' | 'UNFULFILLED'
export type DocumentType = 'STOCKIN' | 'STOCKOUT'

export interface StockDocumentArgs {
  type: DocumentType
  page?: number
  currentFilter?: DocumentFilter
  searchString?: string
}

interface ErrorMessage {
  type: string
  title: string
  status: number
  detail: string
  traceId: string
}


export const baseUrl = import.meta.env.VITE_BASE_URL
console.info(`Server base URL: ${import.meta.env.VITE_BASE_URL}`)
client.setConfig({ baseUrl })

interface ErrorResponse {
  error: ErrorMessage
}

function notifyError(res: unknown, $q: ReturnType<typeof useQuasar>) {
  const err = (res as ErrorResponse).error
  if (typeof err === 'string') {
    $q.notify({
      type: 'negative',
      message: 'Něco se pokazilo.',
      caption: err
    })
    return false
  }

  // const err = (res as ErrorResponse).error
  $q.notify({
    type: 'negative',
    message: 'Něco se pokazilo.',
    caption: err.detail ?? err.title ?? 'Nesrozumitelná chyba :('
  })
}

export const useApi = () => {
  const { currentRoute, push } = useRouter()
  const $q = useQuasar()

  const { token, expiresAt, logout, refresh } = useAuth()

  client.interceptors.request.use((request) => {
    request.headers.set('Authorization', `Bearer ${token.value}`)

    const isForbiddenUrl = request.url.includes('refresh') || request.url.includes('login')
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
    const encodedRoute = encodeURIComponent(
      JSON.stringify({
        name: currentRoute.value.name,
        query: currentRoute.value.query,
        path: currentRoute.value.path,
        params: currentRoute.value.params
      })
    )
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
        caption: `${err}`
      })
    }
  }

  // API call
  const getStockDocumentsWithPagination = async (
    args: StockDocumentArgs
  ): Promise<StockDocumentPagedData | undefined> => {
    try {
      const res = await getApiStockDocumentApi({
        query: { ...args }
      })
      return res.data
    } catch (err: unknown) {
      console.error(err)
      // relogin()
    }
    return undefined
  }

  // API call
  const getStockDocuments = async (args: StockDocumentArgs): Promise<StockDocument[]> => {
    try {
      const res = await getStockDocumentsWithPagination(args)
      return res?.data ?? []
    } catch (err: unknown) {
      console.error(err)
      // relogin()
    }
    return []
  }

  const getMovements = async (documentUuid: string) => {
    try {
      const res = await getApiStockMovementApiById({ path: { id: documentUuid } })
      return res.data?.stockMovements ?? []
    } catch (err: unknown) {
      console.error(err)
      // relogin()
    }
    return []
  }

  // API call
  const getStockDocument = async (id: string) => {
    try {
      const res = await getApiStockDocumentApiByStockDocumentNumber({
        path: {
          stockDocumentNumber: id
        }
      })

      if (res.response.status >= 400) {
        const err = res.error as ErrorMessage
        $q.notify({
          type: 'negative',
          message: 'Něco se pokazilo.',
          caption: err.detail ?? err.title
        })
      }

      return res.data
    } catch (err: unknown) {
      console.error(err)
      // relogin()
    }
  }

  // API call
  const postStockMovement = async (documentId: string, movements: PostStockMovement[]) => {
    try {
      const res = await postApiStockMovementApi({
        body: {
          stockDocumentId: documentId,
          stockMovements: movements
        }
      })
      if (res.response.status === 200) {
        return true
      }
      const err = res.error as ErrorMessage
      $q.notify({
        type: 'negative',
        message: 'Něco se pokazilo.',
        caption: err.detail ?? err.title ?? 'Nesrozumitelná chyba :('
      })

      return false
    } catch (err: unknown) {
      console.error(err)
      // relogin()
    }
  }

  // API call
  const searchCustomers = async (searchString: string) => {
    try {
      const response = await getApiCustomerApi({
        query: { searchString }
      })
      return response.data || []
    } catch (err: unknown) {
      console.error(err)
      // relogin()
      return []
    }
  }

  // API call
  const searchItems = async (searchString: string) => {
    try {
      const response = await getApiStockProductApi({ query: { searchString } })
      return response.data || []
    } catch (err: unknown) {
      console.error(err)
      // relogin()
      return []
    }
  }

  // API call
  const searchWarehousePlaces = async (searchString: string) => {
    try {
      const response = await getApiWarehousePlaceApi({ query: { searchString, allowAll: true } })
      return response.data || []
    } catch (err: unknown) {
      console.error(err)
      // relogin()
      return []
    }
  }

  // API call
  const getPayments = async () => {
    try {
      const response = await getApiFastOrderApiPaymentTypes()
      return response.data || []
    } catch (err: unknown) {
      // relogin()
      return []
    }
  }

  // API call
  const postFastOrder = async (order: FastOrder) => {
    try {
      const res = await postApiFastOrderApi({ body: order })
      if (res.response.status === 200) {
        return true
      }
      notifyError(res, $q)

      return false
    } catch (err: unknown) {
      console.error(err)
      // relogin()
    }
  }

  // API call
  const printStockin = async (stockProductId: number, count: number) => {
    try {
      const res = await postApiStockMovementApiPrintImportLabel({
        query: {
          count,
          id: stockProductId
        }
      })
      if (res.response.status === 200) {
        return true
      }
      notifyError(res, $q)

      return false
    } catch (err: unknown) {
      console.error(err)
      // relogin()
    }
  }


  const printStockout = async (stockProductId: number, quantity?: number) => {
    try {
      const res = await postApiStockMovementApiPrintExportLabel({
        query: {
          quantity: quantity ?? 1,
          id: stockProductId
        }
      })
      if (res.response.status === 200) {
        return true
      }
      notifyError(res, $q)

      return false
    } catch (err: unknown) {
      console.error(err)
      // relogin()
    }
  }


  return {
    getStockDocument,
    getStockDocuments,
    getStockDocumentsWithPagination,
    getMovements,
    getPayments,
    searchCustomers,
    searchItems,
    searchWarehousePlaces,
    postStockMovement,
    postFastOrder,
    testConnection,
    printStockin,
    printStockout,
    // baseUrl
  }
}
