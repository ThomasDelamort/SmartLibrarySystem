import { useEffect, useState, useCallback } from 'react'
import { api } from '../lib/api'

export function useAdminBooks() {
    const [books, setBooks] = useState([])
    const [mostBorrowed, setMostBorrowed] = useState([])
    const [mostLiked, setMostLiked] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [query, setQuery] = useState('')

    const load = useCallback(() => {
        setLoading(true)
        setError(null)
        return api.get(`/api/admin/books?q=${encodeURIComponent(query)}`)
            .then((res) => {
                setBooks(res.books)
                setMostBorrowed(res.mostBorrowed)
                setMostLiked(res.mostLiked)
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [query])

    useEffect(() => { load() }, [load])

    const deleteBook = async (id) => {
        await api.post(`/api/admin/books/${id}/delete`)
        setBooks((list) => list.filter((b) => b.id !== id))
    }

    return { books, mostBorrowed, mostLiked, loading, error, query, search: setQuery, deleteBook, refetch: load }
}