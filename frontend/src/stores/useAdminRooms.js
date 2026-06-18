import { useEffect, useState, useCallback } from 'react'
import { api } from '../lib/api'

export function useAdminRooms() {
    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const load = useCallback(() => {
        setLoading(true)
        setError(null)
        return api.get('/api/admin/rooms')
            .then((res) => setRooms(res.rooms))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => { load() }, [load])

    const addRoom = async (data) => {
        const res = await api.post('/api/admin/rooms', data)
        setRooms((list) => [...list, res.room].sort((a, b) => String(a.number).localeCompare(String(b.number))))
        return res
    }

    const deleteRoom = async (id) => {
        await api.post(`/api/admin/rooms/${id}/delete`)
        setRooms((list) => list.filter((r) => r.id !== id))
    }

    const updateStatus = async (id, status) => {
        await api.post(`/api/admin/rooms/${id}/status`, { status })
        setRooms((list) => list.map((r) => (r.id === id ? { ...r, status } : r)))
    }

    return { rooms, loading, error, addRoom, deleteRoom, updateStatus, refetch: load }
}