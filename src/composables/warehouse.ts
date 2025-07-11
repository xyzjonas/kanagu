import { useLocalStorage } from '@vueuse/core'

const warehouseIdentifier = useLocalStorage('warehouse-id', 'C')

const warehouses = {
  C: 'centrála',
  P: 'pekárna',
  N: 'nosek'
}

export const useWarehouse = () => {
  function getWarehousePlace(place: string) {
    if (place.startsWith(`${warehouseIdentifier.value}-`)) {
      return place
    }
    return `${warehouseIdentifier.value}-${place}`
  }

  function stripWarehousePlace(place: string) {
    return place.replace(`${warehouseIdentifier.value}-`, '')
  }

  function areEqual(place1?: string, place2?: string) {
    return stripWarehousePlace(place1 ?? 'A') === stripWarehousePlace(place2 ?? 'B')
  }

  return {
    warehouseIdentifier,
    warehouses,
    getWarehousePlace,
    stripWarehousePlace,
    areEqual
  }
}
