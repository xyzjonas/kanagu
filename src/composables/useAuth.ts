import { postLogin } from "@/client";
import { useLocalStorage } from "@vueuse/core";
import { useQuasar } from "quasar";
import { computed } from "vue";


const token = useLocalStorage<string>("access-token", "")
const loggedUser = useLocalStorage<string>("logged-user", "")
const expiresAt = useLocalStorage<Date>("access-token-expiration", new Date())

export const useAuth = () => {

    const $q = useQuasar()

    const isLoggedIn = computed(() => {
        if (!token.value) {
            return false
        }

        if (expiresAt.value > new Date()) {
            return true
        }

        return false
    })

    function getNewExpirationDate(expiresInSeconds: number) {
        const expiryDate = new Date()
        expiryDate.setSeconds(expiryDate.getSeconds() + expiresInSeconds)
        return expiryDate
    }

    async function logout() {
        loggedUser.value = ""
        token.value = ""
        expiresAt.value = new Date()
    }

    async function login(email: string, password: string) {
        const response = await postLogin({
            body: {
                email,
                password
            }
        })

        if (response.error) {
            $q.notify({
                color: 'negative',
                message: `Přihlášení selhalo`
            })
            console.error("Login failed", response.error)
            return
        }

        if (!response.data?.accessToken) {
            console.error("Response does not contain access token")
            console.error(response.response)
            console.error(response.data)
            return
        }

        loggedUser.value = email
        token.value = response.data.accessToken
        expiresAt.value = getNewExpirationDate(response.data.expiresIn)
        $q.notify({
            color: "positive",
            message: "Přihlášení proběhlo úspěšně!"
        })
    }

    return {
        login,
        logout,
        token,
        loggedUser,
        expiresAt,
        isLoggedIn
    }
}