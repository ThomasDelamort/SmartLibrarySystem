import { useEffect, useState, useCallback } from 'react'
import { api } from '../lib/api'

// Data store for the student's borrowed books.
export function useBorrowed() {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const load = useCallback(() => {
        setLoading(true)
        setError(null)
        return api.get('/api/students/borrowed')
            .then((res) => setTransactions(res.transactions || []))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => { load() }, [load])

    const returnBook = async (transactionId) => {
        await api.post('/api/students/return', { transactionId })
        // Reflect the pending return locally so the button flips immediately.
        setTransactions((prev) =>
            prev.map((t) => (t._id === transactionId ? { ...t, pendingReturn: true } : t))
        )
    }

    return { transactions, loading, error, returnBook, refetch: load }
}