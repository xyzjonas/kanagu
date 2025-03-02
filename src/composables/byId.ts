import { type StockMovementItemApiModel, type StockDocument } from '@/client'
import { useApi, type DocumentType } from './useApi'
import { ref } from 'vue'
import { useQuasar } from 'quasar'

interface Args {
  id: string
  type: DocumentType
}

export const useStockDocumentById = (args: Args) => {
  const { getStockDocuments, getMovements } = useApi()

  const $q = useQuasar()
  const stockDocument = ref<StockDocument>()
  const movements = ref<StockMovementItemApiModel[]>([])
  const loading = ref(false)

  const getById = async () => {
    const searchResult = await getStockDocuments({
      searchString: args.id,
      type: args.type
    })
    $q.loadingBar.increment()
 
    if (searchResult.length <= 0) {
        stockDocument.value = undefined
        return
    }

    const foundDocument = searchResult[0]

    if (!foundDocument.id) {
      throw Error("Invalid response or document data, missing 'id'")
    }
    movements.value = await (await getMovements(foundDocument.id)).sort((a, b) => (a.stockProductId ?? 0) - (b?.stockProductId ?? 0))
    $q.loadingBar.increment()
    stockDocument.value = searchResult[0]
  }

  const reload = async () => {
    loading.value = true
    try {
        $q.loadingBar.start()
        await getById()
    } finally {
        $q.loadingBar.stop()
        loading.value = false
    }
  }

  return {
    stockDocument,
    movements,
    loading,
    reload,
  }
}
