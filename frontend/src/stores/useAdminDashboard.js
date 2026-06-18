import { useEffect, useState, useCallback } from 'react'
import { api } from '../lib/api'

// Admin dashboard overview data.
export function useAdminDashboard() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const load = useCallback(() => {
        setLoading(true)
        setError(null)
        return api.get('/api/admin/dashboard')
            .then(setData)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => { load() }, [load])

    return { data, loading, error, refetch: load }
}