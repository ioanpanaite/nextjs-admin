// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, LoginParams, ErrCallbackType, UserDataType } from './types'
import { signIn, useSession } from 'next-auth/react'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    const initAuth = () => {
      if (status === "loading") {
        setLoading(true)
      } else {
        setLoading(false)
        if (!session) {
          setLoading(false)
          if (!router.pathname.includes('login')) {
            router.replace('/login')
          }
        } else {
          const user = { ...session?.user } as UserDataType
          setUser(user);
        }
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session])

  const handleLogin = async (params: LoginParams, errorCallback?: ErrCallbackType) => {
    const data = {
      redirect: false,
      email: params.email,
      password: params.password,
      rememberMe: false,
    }

    setLoading(true)
    const response = await signIn('credentials', data);
    if (response?.ok) {
      setLoading(false)
      router.push('/dashboard')
    } else {
      setLoading(false)
      const error = { "error": response?.error as string }
      if (errorCallback) errorCallback(error)
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
