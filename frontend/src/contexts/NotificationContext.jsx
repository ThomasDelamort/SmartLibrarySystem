import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { api } from '../lib/api.js'
import { useAuth } from './AuthContext.jsx'

// Shared student-notification state so the bell (desktop) and the profile
// dropdown (mobile) read the same data — one fetch, counts always in sync.
const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
    const { user } = useAuth()
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)

    const enabled = !!user && user.role === 'student'

    const load = useCallback(() => {
        if (!enabled) {
            setNotifications([])
            setUnreadCount(0)
            return Promise.resolve()
        }
        return api.get('/api/students/notifications')
            .then((res) => {
                setNotifications(res.notifications)
                setUnreadCount(res.unreadCount)
            })
            .catch(() => { /* stay empty on error */ })
    }, [enabled])

    useEffect(() => { load() }, [load])

    const markRead = async (id) => {
        await api.post(`/api/students/notifications/read/${id}`)
        setNotifications((prev) => prev.filter((n) => n.id !== id))
        setUnreadCount((c) => Math.max(0, c - 1))
    }

    const clearAll = async () => {
        await api.post('/api/students/notifications/clear')
        setNotifications([])
        setUnreadCount(0)
    }

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markRead, clearAll, refetch: load }}>
            {children}
        </NotificationContext.Provider>
    )
}

export function useNotifications() {
    return (
        useContext(NotificationContext) || {
            notifications: [], unreadCount: 0,
            markRead: async () => {}, clearAll: async () => {}, refetch: async () => {},
        }
    )
}