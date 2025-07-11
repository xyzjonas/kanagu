import type { StockProduct, WarehousePlace } from "@/client"

export interface MoveItem {
  item?: StockProduct
  place?: WarehousePlace
  quantity: number
}

export interface WarehouseTransfer {
  /** Source warehouse place ID (odkud) */
  sourceWarehousePlaceId: number;
  
  /** Destination warehouse place ID (kam) */
  destinationWarehousePlaceId: number;
  
  /** Stock product ID from api/StockProductApi */
  stockProductId: number;
  
  /** Quantity according to product units (množství podle jednotek u produktu) */
  value: number;
}

export interface WarehouseTransferLocal {
  place: WarehousePlace
  quantity: number
  sent: boolean
}