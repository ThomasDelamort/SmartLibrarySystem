import { useEffect, useState, useCallback } from 'react'
import { api } from '../lib/api'

// Student's active (pending + approved) room reservations.
export function useReservations() {
    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const load = useCallback(() => {
        setLoading(true)
        setError(null)
        return api.get('/api/students/reservations')
            .then((res) => setReservations(res.reservations))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => { load() }, [load])

    const cancel = async (id) => {
        await api.post(`/api/students/reservations/cancel/${id}`)
        setReservations((prev) => prev.filter((r) => r.id !== id))
    }

    return { reservations, loading, error, cancel, refetch: load }
}