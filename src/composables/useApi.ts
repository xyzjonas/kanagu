
export interface Item {
  id: string
  name: string
}

export interface OrderItem {
  item: Item
  count: number
}

export interface ReceiveOrder {
  id: string
  received: Date
  items: OrderItem[]
  supplier: string,
  rackId: string
}

export const useApi = () => {
  const items: { [key: string]: Item } = {
    bolt14: {
      id: '938-016-0800-12',
      name: 'Šr. závit do oceli 8.4 M14'
    },
    bolt12: {
      id: '938-016-0800-12',
      name: 'Šr. závit do oceli 8.4 M12'
    },
    bolt10: {
      id: '938-016-0800-12',
      name: 'Šr. závit do oceli 8.4 M10'
    }
  }

  const receiveOrders: ReceiveOrder[] = [
    {
      id: "P0004908099104280691",
      supplier: 'FISCHER',
      received: new Date(),
      rackId: "A3552-22-ax",
      items: [
        {
          item: items.bolt14,
          count: 100
        },
        {
          item: items.bolt12,
          count: 500
        },
        {
          item: items.bolt10,
          count: 1500
        }
      ]
    },
    {
      id: "P0004908099104280692",
      supplier: 'FISCHER',
      received: new Date(),
      rackId: "A3552-22-ax",
      items: [
        {
          item: items.bolt14,
          count: 100
        },
        {
          item: items.bolt12,
          count: 500
        },
        {
          item: items.bolt10,
          count: 1500
        }
      ]
    },
    {
      id: "P0004908099104280693",
      supplier: 'FISCHER',
      received: new Date(),
      rackId: "A3552-22-ax",
      items: [
        {
          item: items.bolt14,
          count: 100
        },
        {
          item: items.bolt12,
          count: 500
        },
        {
          item: items.bolt10,
          count: 1500
        }
      ]
    },
    {
      id: "P0004908099104280694",
      supplier: 'FISCHER',
      received: new Date(),
      rackId: "A3552-22-ax",
      items: [
        {
          item: items.bolt14,
          count: 100
        },
        {
          item: items.bolt12,
          count: 500
        },
        {
          item: items.bolt10,
          count: 1500
        }
      ]
    },
    {
      id: "P0004908099104280695",
      supplier: 'FISCHER',
      received: new Date(),
      rackId: "A3552-22-ax",
      items: [
        {
          item: items.bolt14,
          count: 100
        },
        {
          item: items.bolt12,
          count: 500
        },
        {
          item: items.bolt10,
          count: 1500
        }
      ]
    }
  ]

  const purchaseOrders: ReceiveOrder[] = [
    {
      id: 'P0004908099104280696',
      supplier: 'FISCHER',
      received: new Date(),
      rackId: "A3552-22-ax",
      items: [
        {
          item: items.bolt14,
          count: 100
        },
        {
          item: items.bolt12,
          count: 500
        },
        {
          item: items.bolt10,
          count: 1500
        }
      ]
    }
  ]


  return {
    receiveOrders,
    purchaseOrders,
  }
}
