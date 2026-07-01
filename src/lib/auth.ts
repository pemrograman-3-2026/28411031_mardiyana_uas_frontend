export type AdminSession = {
  id_admin: number
  nama_admin: string
  username: string
}

const AUTH_KEY = 'bpjs_admin'

export const saveSession = (admin: AdminSession) => {
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(admin))
}

export const getSession = (): AdminSession | null => {
  if (typeof window === 'undefined') return null

  const raw = sessionStorage.getItem(AUTH_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AdminSession
  } catch {
    return null
  }
}

export const clearSession = () => {
  sessionStorage.removeItem(AUTH_KEY)
}
