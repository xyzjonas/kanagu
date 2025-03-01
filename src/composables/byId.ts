import { type StockMovementItemApiModel, type StockDocument } from '@/client'
import { useApi, type DocumentType } from './useApi'
import { ref } from 'vue'

interface Args {
  id: string
  type: DocumentType
}

export const useStockDocumentById = (args: Args) => {
  const { getStockDocuments, getMovements } = useApi()

  const stockDocument = ref<StockDocument>()
  const movements = ref<StockMovementItemApiModel[]>([])
  const loading = ref(false)

  const getById = async () => {
    const searchResult = await getStockDocuments({
      searchString: args.id,
      type: args.type
    })
 
    if (searchResult.length <= 0) {
        stockDocument.value = undefined
        return
    }

    const foundDocument = searchResult[0]

    if (!foundDocument.id) {
      throw Error("Invalid response or document data, missing 'id'")
    }
    movements.value = await getMovements(foundDocument.id)
    stockDocument.value = searchResult[0]
  }

  const reload = async () => {
    loading.value = true
    try {
        await getById()
    } finally {
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
