import type {
  StockDocument,
  StockDocumentItem,
  StockItem,
  StockItemApiModel,
  StockMovementItemApiModel,
  StockProduct
} from './client'

export const rules = {
  notEmpty: (val: any) => !!val || 'Pole nesmí být prazdné',
  isNumber: (val: any) => !isNaN(val) || 'Pole musí být číslo',
  atLeastOne: (val: any) => val > 0 || 'Pole musí být číslo větší než 0',
  max9999: (val: any) => val < 9999 || 'Pole nesmí být číslo větší než 9999'
}

export interface StockDocumentStatus {
  itemsCompleted: number
  items: number
}

export const isItemResolved = (item: StockDocumentItem) =>
  (item.quantity ?? 0) - (item.quantityMoved ?? 0) === 0

export const getDocumentStatus = (document: StockDocument): StockDocumentStatus => {
  let itemsCompleted = 0
  const items = document.stockDocumentItems ?? []

  for (const item of items) {
    if (isItemResolved(item)) {
      itemsCompleted++
    }
  }

  return {
    items: items.length,
    itemsCompleted
  }
}

export const isMovementResolved = (movement: StockMovementItemApiModel) => movement.value === 0

export const isMovementNotResolved = (movement: StockMovementItemApiModel) =>
  !isMovementResolved(movement)

export function round(value: number, precision: number) {
  var multiplier = Math.pow(10, precision || 0)
  return Math.round(value * multiplier) / multiplier
}

export function filterOutPlacesOnly(items: (StockItem | StockItemApiModel)[]) {
  return items
    .filter((place) => !place.warehousePlace?.code?.startsWith('INVENTURA'))
    .filter((place) => {
      const pattern = RegExp(/^[PV]\d/i)
      return !pattern.test(place?.warehousePlace?.code ?? '')
    })
    .filter((place) => !place?.warehousePlaceCode?.startsWith('INVENTURA'))
    .filter((place) => {
      const pattern = RegExp(/^[PV]\d/i)
      return !pattern.test(place?.warehousePlaceCode ?? '')
    })
}
