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

    const { getStockDocumentsWithPagination } = useApi()

    const loading = ref(true)
    const filter = useLocalStorage<DocumentFilter | undefined>(args.localStorageFilterId, undefined)
    const current = useLocalStorage<number>(args.localStoragePageId, 1)
    const receiveOrders = ref<StockDocument[]>([])
    const thatsIt = ref(false)
    const totalItems = ref(0)

    const fetchDocuments = async () => {
        loading.value = true
        const res = await getStockDocumentsWithPagination({
            type: args.type,
            page: current.value,
            currentFilter: filter.value
        })

        if (!res || !res?.pagination) {
            console.error("Pagination data missing in response!")
            return []
        }

        totalItems.value = res.pagination.totalItems ?? 0
        
        if (res.pagination.totalPages === current.value) {
            thatsIt.value = true
        }

        setTimeout(() => (loading.value = false), 250)
        return res.data ?? []
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
        totalItems,
        next,
        reset,
        thatsIt,
        loading,
        filter,
        current,
    }
}