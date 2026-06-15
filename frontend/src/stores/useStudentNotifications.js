import { useEffect, useState, useCallback } from 'react'
import { api } from '../lib/api'

// Student notification bell: unread list + count, mark-read, clear-all.
export function useStudentNotifications() {
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(true)

    const load = useCallback(() => {
        setLoading(true)
        return api.get('/api/students/notifications')
            .then((res) => {
                setNotifications(res.notifications)
                setUnreadCount(res.unreadCount)
            })
            .catch(() => { /* bell stays empty on error */ })
            .finally(() => setLoading(false))
    }, [])

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

    return { notifications, unreadCount, loading, markRead, clearAll, refetch: load }
}