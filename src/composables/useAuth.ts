import { postLogin, postRefresh, type PostRefreshResponse } from '@/client'
import { useLocalStorage } from '@vueuse/core'
import { useQuasar } from 'quasar'
import { computed } from 'vue'

const token = useLocalStorage<string>('access-token', '')
const refreshtoken = useLocalStorage<string>('refresh-token', '')
const loggedUser = useLocalStorage<string>('logged-user', '')
const expiresAt = useLocalStorage<Date>('access-token-expiration', new Date())

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

  function setNewState(email: string, response?: PostRefreshResponse) {
    if (!response) {
      throw new Error('Empty response!')
    }

    if (!response.accessToken) {
      console.error(response)
      throw new Error('Response does not contain access token')
    }

    loggedUser.value = email
    token.value = response.accessToken
    refreshtoken.value = response.refreshToken
    expiresAt.value = getNewExpirationDate(response.expiresIn)
  }

  async function logout() {
    loggedUser.value = ''
    token.value = ''
    refreshtoken.value = ''
    expiresAt.value = new Date()
  }

  async function refresh() {
    try {
      const response = await postRefresh({
        body: {
          refreshToken: refreshtoken.value
        }
      })

      setNewState(loggedUser.value, response.data)
    } catch (err: unknown) {
      $q.notify({
        type: 'negative',
        message: `Nastala chyba při obnovovení přihlášení, zkuste zopakovat přihlášení.`
      })
      throw err
    }
  }

  async function login(email: string, password: string) {
    try {
      const response = await postLogin({
        body: {
          email,
          password
        }
      })

      if (!response.response.ok || response.error) {
        $q.notify({
          type: 'negative',
          message: `Přihlášení selhalo`
        })
        console.error('Login failed', response.error)
        return
      }

      setNewState(email, response.data)

      $q.notify({
        type: 'positive',
        message: 'Přihlášení proběhlo úspěšně!',
        timeout: 500
      })
    } catch (err: unknown) {
      $q.notify({
        type: 'negative',
        message: `Nastala chyba při přihlašování, zkontrolujte nastavení připojení.`
      })
      throw err
    }
  }

  return {
    login,
    logout,
    refresh,
    token,
    loggedUser,
    expiresAt,
    isLoggedIn
  }
}
