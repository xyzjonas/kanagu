import { useLocalStorage } from '@vueuse/core'

const warehouseIdentifier = useLocalStorage('warehouse-id', 'C')

const warehouses = {
  C: 'centrála',
  P: 'pekárna',
  N: 'nosek'
}

export const useWarehouse = () => {
  function getWarehousePlace(place: string) {
    return `${warehouseIdentifier.value}-${place}`
  }

  function stripWarehousePlace(place: string) {
    return place.replace(`${warehouseIdentifier.value}-`, '')
  }

  function areEqual(place1: string, place2: string) {
    return stripWarehousePlace(place1) === stripWarehousePlace(place2)
  }

  return {
    warehouseIdentifier,
    warehouses,
    getWarehousePlace,
    stripWarehousePlace,
    areEqual
  }
}
