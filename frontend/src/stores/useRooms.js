import { useEffect, useState, useCallback } from 'react'
import { api } from '../lib/api'

// Rooms list + reservation actions.
export function useRooms() {
    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const load = useCallback(() => {
        setLoading(true)
        setError(null)
        return api.get('/api/students/rooms')
            .then((res) => setRooms(res.rooms))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => { load() }, [load])

    // Create a reservation. Throws on failure (caller shows the message).
    const reserve = (data) => api.post('/api/students/rooms/reserve', data)

    // Search students to invite.
    const searchStudents = (q) =>
        api.get(`/api/students/search?q=${encodeURIComponent(q)}`).then((r) => r.students)

    return { rooms, loading, error, reserve, searchStudents, refetch: load }
}