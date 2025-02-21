import { computed, type Ref } from "vue"

export const usePolozky = (count: Ref<number>) => {

    const polozky = computed(() => {
        if (count.value === 1) {
            return "položka"
        } else if (count.value >= 2 && count.value <= 4) {
            return "položky"
        }

        return "položek"
    })

    return { polozky }
}