import { useEffect, useState, useCallback } from 'react'
import { api } from '../lib/api'

// Librarian notification bell: unread list + count, mark-read, clear-all.
export function useLibrarianNotifications() {
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(true)

    const load = useCallback(() => {
        setLoading(true)
        return api.get('/api/librarian/notifications')
            .then((res) => {
                setNotifications(res.notifications)
                setUnreadCount(res.unreadCount)
            })
            .catch(() => { /* bell stays empty on error */ })
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => { load() }, [load])

    const markRead = async (id) => {
        await api.post(`/api/librarian/notifications/read/${id}`)
        setNotifications((prev) => prev.filter((n) => n.id !== id))
        setUnreadCount((c) => Math.max(0, c - 1))
    }

    const clearAll = async () => {
        await api.post('/api/librarian/notifications/clear')
        setNotifications([])
        setUnreadCount(0)
    }

    return { notifications, unreadCount, loading, markRead, clearAll, refetch: load }
}