import { useEffect, useState, useCallback } from 'react'
import { api } from '../lib/api'

export function useAdminLibrarians() {
    const [librarians, setLibrarians] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const load = useCallback(() => {
        setLoading(true)
        setError(null)
        return api.get('/api/admin/librarians')
            .then((res) => setLibrarians(res.librarians))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => { load() }, [load])

    const deleteLibrarian = async (id) => {
        await api.post(`/api/admin/librarians/${id}/delete`)
        setLibrarians((list) => list.filter((l) => l.id !== id))
    }

    return { librarians, loading, error, deleteLibrarian, refetch: load }
}