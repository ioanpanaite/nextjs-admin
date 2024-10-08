// ** React Imports
import { ReactNode, ReactElement, useCallback } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'
import { useSession } from 'next-auth/react'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props
  const router = useRouter()
  const { data: session, status } = useSession()

  useCallback(
    () => {
      if (!router.isReady) {
        return
      }

      if (!session && status !== "loading") {
        if (router.asPath !== '/') {
          router.replace({
            pathname: '/login',
            query: { returnUrl: router.asPath }
          })
        } else {
          router.replace('/login')
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route]
  )

  if (status === "loading") {
    return <>{fallback}</>
  }

  return <>{children}</>
}

export default AuthGuard
