import type { StockDocument } from '@/client'
import { type DocumentFilter, type DocumentType, useApi } from '@/composables/useApi'
import { useLocalStorage } from '@vueuse/core'
import { ref, watch } from 'vue'


export interface PaginatedDocumentsArgs {
    localStorageFilterId: string
    localStoragePageId: string
    type: DocumentType
}


export const usePaginatedDocuments = (args: PaginatedDocumentsArgs) => {

    const { getStockDocuments } = useApi()

    const loading = ref(true)
    const filter = useLocalStorage<DocumentFilter | undefined>(args.localStorageFilterId, undefined)
    const current = useLocalStorage<number>(args.localStoragePageId, 1)
    const receiveOrders = ref<StockDocument[]>([])
    const thatsIt = ref(false)

    const fetchDocuments = async () => {
        loading.value = true
        const documents = await getStockDocuments({
            type: args.type,
            page: current.value,
            currentFilter: filter.value
        }) ?? []
        if (documents.length === 0) {
            thatsIt.value = true
        }
        setTimeout(() => (loading.value = false), 250)
        return documents
    }

    const fetchAndSetDocuments = async () => {
        receiveOrders.value = await fetchDocuments()
    }

    const next = async () => {
        current.value += 1
        receiveOrders.value.push(...await fetchDocuments())
    }

    const reset = async () => {
        current.value = 1
        thatsIt.value = false
        receiveOrders.value = []
        fetchAndSetDocuments()
    }

    watch(filter, reset)

    return {
        receiveOrders,
        next,
        reset,
        thatsIt,
        loading,
        filter,
        current,
    }
}