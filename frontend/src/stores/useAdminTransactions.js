import { useEffect, useState, useCallback } from 'react'
import { api } from '../lib/api'

export function useAdminTransactions() {
    const [bookTransactions, setBookTransactions] = useState([])
    const [roomTransactions, setRoomTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const load = useCallback(() => {
        setLoading(true)
        setError(null)
        return api.get('/api/admin/transactions')
            .then((res) => {
                setBookTransactions(res.bookTransactions)
                setRoomTransactions(res.roomTransactions)
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => { load() }, [load])

    return { bookTransactions, roomTransactions, loading, error, refetch: load }
}