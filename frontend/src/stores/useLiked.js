import { useEffect, useState, useCallback } from 'react'
import { api } from '../lib/api'

// Student's liked books + unlike action.
export function useLiked() {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const load = useCallback(() => {
        setLoading(true)
        setError(null)
        return api.get('/api/students/liked')
            .then((res) => setBooks(res.books))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => { load() }, [load])

    // Toggling like on an already-liked book unlikes it -> drop it from the list.
    const unlike = async (bookId) => {
        await api.post(`/api/students/like/${bookId}`)
        setBooks((prev) => prev.filter((b) => b.id !== bookId))
    }

    return { books, loading, error, unlike, refetch: load }
}