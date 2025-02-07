import type { StockDocument } from "./client"

export const rules = {
    notEmpty: (val: any) => !!val || 'Pole nesmí být prazdné',
    atLeastOne: (val: any) => val > 0 || 'Pole musí být číslo větší než 0'
}


export interface StockDocumentStatus {
    itemsCompleted: number
    items: number
}

export const getDocumentStatus = (document: StockDocument): StockDocumentStatus => {
    let itemsCompleted = 0
    const items = document.stockDocumentItems ?? []

    for (const doc of items) {
        if ((doc.quantity ?? 0) - (doc.quantityMoved ?? 0) === 0) {
            itemsCompleted++
        }
    }

    return {
        items: items.length,
        itemsCompleted
    }
}