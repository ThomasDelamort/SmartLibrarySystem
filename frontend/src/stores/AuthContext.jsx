import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Restore the logged-in user on first load (session cookie -> /api/me).
    useEffect(() => {
        api.get('/api/me')
            .then((res) => setUser(res.user))
            .catch(() => setUser(null)) // 401 = not logged in
            .finally(() => setLoading(false))
    }, [])

    const login = async (email, password) => {
        const res = await api.post('/api/login', { email, password })
        setUser(res.user)
        return res.user
    }

    const logout = async () => {
        try {
            await api.post('/api/logout')
        } catch {
            // ignore network/None errors — we still clear local state
        }
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
    return ctx
}