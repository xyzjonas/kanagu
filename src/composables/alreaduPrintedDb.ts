import { useLocalStorage } from '@vueuse/core'

type Schema = {
  stockId: string
  movementId: string
}

const db = useLocalStorage<Schema[]>('printed-db', [])

export const useAlreadyPrintedDb = () => {
    return {
        db
    }
}
