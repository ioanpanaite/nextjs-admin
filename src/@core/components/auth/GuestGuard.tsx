// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'
import { useSession } from 'next-auth/react'

interface GuestGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const GuestGuard = (props: GuestGuardProps) => {
  const { children, fallback } = props
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (status !== "loading" && session) {
      router.replace('/')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.route])

  if (status === "loading") {
    return fallback
  }

  return <>{children}</>
}

export default GuestGuard
