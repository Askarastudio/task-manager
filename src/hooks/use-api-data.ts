import { useState, useEffect, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import { apiClient, isUsingLocalStorage } from '@/lib/api'
import { toast } from 'sonner'

export function useApiData<T>(
  apiGetter: () => Promise<{ success: boolean; data?: T; error?: string }>,
  kvKey: string,
  defaultValue: T
): [T, (value: T | ((current: T) => T)) => Promise<void>, boolean, () => Promise<void>] {
  const [kvData, setKvData] = useKV<T>(kvKey, defaultValue)
  const [apiData, setApiData] = useState<T>(defaultValue)
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    if (isUsingLocalStorage) {
      return
    }

    setLoading(true)
    try {
      const response = await apiGetter()
      if (response.success && response.data) {
        setApiData(response.data)
      } else if (response.error) {
        toast.error(`Gagal memuat data: ${response.error}`)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Gagal memuat data dari server')
    } finally {
      setLoading(false)
    }
  }, [apiGetter])

  useEffect(() => {
    if (!isUsingLocalStorage) {
      fetchData()
    }
  }, [fetchData])

  const updateData = async (value: T | ((current: T) => T)) => {
    if (isUsingLocalStorage) {
      setKvData(value)
    } else {
      const newValue = typeof value === 'function' ? (value as (current: T) => T)(apiData) : value
      setApiData(newValue)
    }
  }

  const currentData = isUsingLocalStorage ? (kvData ?? defaultValue) : apiData

  return [currentData, updateData, loading, fetchData]
}

export function useAuth() {
  const [session, setSession] = useKV<{ token: string; user: any } | null>('auth-session', null)
  const [loading, setLoading] = useState(false)

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      if (isUsingLocalStorage) {
        const DEFAULT_PASSWORD = "Ikuhub@2025"
        if (password !== DEFAULT_PASSWORD) {
          toast.error("Password salah. Gunakan password demo: Ikuhub@2025")
          return false
        }
        
        const newSession = {
          token: 'demo-token',
          user: {
            userId: `user-${Date.now()}`,
            email,
            name: email.split('@')[0],
            loginAt: Date.now(),
          }
        }
        setSession(newSession)
        toast.success(`Selamat datang, ${newSession.user.name}!`)
        return true
      } else {
        const response = await apiClient.login(email, password)
        if (response.success && response.data) {
          setSession(response.data)
          toast.success(`Selamat datang, ${response.data.user.name}!`)
          return true
        } else {
          toast.error(response.error || 'Login gagal')
          return false
        }
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat login')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    if (!isUsingLocalStorage) {
      await apiClient.logout()
    }
    setSession(null)
    toast.info('Anda telah keluar')
  }

  return {
    session,
    login,
    logout,
    loading,
    isAuthenticated: !!session,
  }
}
