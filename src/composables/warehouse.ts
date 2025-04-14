import { useLocalStorage } from "@vueuse/core"
import { computed, type Ref } from "vue"


const warehouseIdentifier = useLocalStorage("warehouse-id", "C")

const warehouses = {
    C: "centrála",
    P: "pekárna",
    N: "nosek"
}

export const useWarehouse = () => {

    function getWarehousePlace(place: string) {
        return `${warehouseIdentifier.value}-${place}`
    }

    function stripWarehousePlace(place: string) {
        return place.replace(`${warehouseIdentifier.value}-`, "")
    }


    return {
        warehouseIdentifier,
        warehouses,
        getWarehousePlace,
        stripWarehousePlace
    }
}
