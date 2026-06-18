import { useEffect, useState, useCallback } from 'react'
import { api } from '../lib/api'

export function useAdminStudents() {
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [query, setQuery] = useState('')

    const load = useCallback(() => {
        setLoading(true)
        setError(null)
        return api.get(`/api/admin/students?q=${encodeURIComponent(query)}`)
            .then((res) => setStudents(res.students))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [query])

    useEffect(() => { load() }, [load])

    const toggleBorrow = async (id) => {
        const res = await api.post(`/api/admin/students/${id}/toggle-borrow`)
        // Update in place so the row reflects immediately.
        setStudents((list) => list.map((s) => (s.id === id ? { ...s, canBorrow: res.canBorrow } : s)))
        return res
    }

    const deleteStudent = async (id) => {
        await api.post(`/api/admin/students/${id}/delete`)
        setStudents((list) => list.filter((s) => s.id !== id))
    }

    return { students, loading, error, query, setQuery, search: setQuery, toggleBorrow, deleteStudent, refetch: load }
}