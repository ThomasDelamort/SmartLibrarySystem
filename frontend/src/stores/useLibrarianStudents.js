import { useEffect, useState, useCallback } from 'react'
import { api } from '../lib/api'

// Librarian students list: paginated + searchable.
export function useLibrarianStudents() {
    const [students, setStudents] = useState([])
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalStudents: 0 })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [page, setPage] = useState(1)
    const [query, setQuery] = useState('')

    const load = useCallback(() => {
        setLoading(true)
        setError(null)
        return api.get(`/api/librarian/students?page=${page}&q=${encodeURIComponent(query)}`)
            .then((res) => {
                setStudents(res.students)
                setPagination(res.pagination)
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [page, query])

    useEffect(() => { load() }, [load])

    const search = (q) => { setQuery(q); setPage(1) }

    return { students, pagination, loading, error, page, setPage, query, search, refetch: load }
}