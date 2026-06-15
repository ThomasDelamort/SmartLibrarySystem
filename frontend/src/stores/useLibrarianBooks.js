import { useEffect, useState, useCallback } from 'react'
import { api } from '../lib/api'

// Librarian book management: paginated list + search + add/edit/delete.
export function useLibrarianBooks() {
    const [books, setBooks] = useState([])
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalBooks: 0 })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [page, setPage] = useState(1)
    const [query, setQuery] = useState('')

    const load = useCallback(() => {
        setLoading(true)
        setError(null)
        return api.get(`/api/librarian/books?page=${page}&q=${encodeURIComponent(query)}`)
            .then((res) => {
                setBooks(res.books)
                setPagination(res.pagination)
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [page, query])

    useEffect(() => { load() }, [load])

    // Add (id null) or edit (id set). Uses FormData for the file uploads.
    const saveBook = async (id, formData) => {
        const url = id ? `/api/librarian/books/${id}` : '/api/librarian/books'
        const res = await fetch(url, { method: 'POST', body: formData, credentials: 'include' })
        if (!res.ok) {
            const d = await res.json().catch(() => ({}))
            throw new Error(d.error || 'Save failed')
        }
        const data = await res.json()
        await load()
        return data
    }

    const deleteBook = async (id) => {
        await api.post(`/api/librarian/books/${id}/delete`)
        await load()
    }

    const search = (q) => { setQuery(q); setPage(1) }

    return { books, pagination, loading, error, page, setPage, query, search, saveBook, deleteBook, refetch: load }
}