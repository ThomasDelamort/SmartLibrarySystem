import { useEffect, useState, useCallback } from 'react'
import { api } from '../lib/api'

// Student's completed/cancelled book + room transactions.
export function useHistory() {
    const [bookHistory, setBookHistory] = useState([])
    const [roomHistory, setRoomHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const load = useCallback(() => {
        setLoading(true)
        setError(null)
        return api.get('/api/students/history')
            .then((res) => {
                setBookHistory(res.bookHistory)
                setRoomHistory(res.roomHistory)
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => { load() }, [load])

    return { bookHistory, roomHistory, loading, error, refetch: load }
}