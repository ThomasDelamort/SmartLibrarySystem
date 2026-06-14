import { useEffect, useState, useCallback } from 'react'
import { api } from '../lib/api'

// Student's fines + overdue books.
export function useStatus() {
    const [fines, setFines] = useState(0)
    const [overdueBooks, setOverdueBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const load = useCallback(() => {
        setLoading(true)
        setError(null)
        return api.get('/api/students/status')
            .then((res) => {
                setFines(res.fines)
                setOverdueBooks(res.overdueBooks)
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => { load() }, [load])

    return { fines, overdueBooks, loading, error, refetch: load }
}