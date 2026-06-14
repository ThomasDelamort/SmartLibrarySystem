import { useEffect, useState, useCallback } from 'react'
import { api } from '../lib/api.js'

export function useBag() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const load = useCallback(() => {
        setLoading(true)
        setError(null)
        return api.get('/api/students/bag')
            .then((res) => setItems(res.items) || [])
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => { load() }, [load])

    const remove = async (bookId) => {
        await api.post(`/api/students/bag/remove/${bookId}`)
        setItems((prev) => prev.filter((it) => it.book._id !== bookId))
    }

    const borrowAll = async () => {
        const res = await api.post('/api/students/bag/borrow-all')
        setItems([])
        return res
    }

    return { items, loading, error, remove, borrowAll, refetch: load }
}