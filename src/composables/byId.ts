import type { StockDocument } from '@/client'
import { useApi, type DocumentType } from './useApi'
import { ref } from 'vue'

interface Args {
  id: string
  type: DocumentType
}

export const useStockDocumentById = (args: Args) => {
  const { getStockDocuments } = useApi()

  const stockDocument = ref<StockDocument>()
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
    loading,
    reload,
  }
}
