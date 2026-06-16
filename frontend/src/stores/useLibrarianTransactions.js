import { useEffect, useState, useCallback } from 'react'
import { api } from '../lib/api'

// Librarian transactions: pending borrows/returns + room reservations, with actions.
export function useLibrarianTransactions() {
    const [stats, setStats] = useState({ borrowed: 0, overdue: 0, returnedToday: 0 })
    const [bookTransactions, setBookTransactions] = useState([])
    const [roomTransactions, setRoomTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [busyId, setBusyId] = useState(null)

    const load = useCallback(() => {
        setLoading(true)
        setError(null)
        return api.get('/api/librarian/transactions')
            .then((res) => {
                setStats(res.stats)
                setBookTransactions(res.bookTransactions)
                setRoomTransactions(res.roomTransactions)
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => { load() }, [load])

    // Run an action, then refetch so stats + lists stay in sync.
    const act = async (path, id) => {
        setBusyId(id)
        try {
            await api.post(path)
            await load()
        } finally {
            setBusyId(null)
        }
    }

    const approveBook = (id) => act(`/api/librarian/transactions/approve/${id}`, id)
    const rejectBook = (id) => act(`/api/librarian/transactions/reject/${id}`, id)
    const confirmReturn = (id) => act(`/api/librarian/transactions/return/${id}`, id)
    const approveRoom = (id) => act(`/api/librarian/transactions/room/approve/${id}`, id)
    const rejectRoom = (id) => act(`/api/librarian/transactions/room/reject/${id}`, id)

    // Manual transaction + settle fines: post, then refetch so stats/lists update.
    const createManual = async (payload) => {
        const res = await api.post('/api/librarian/transactions/manual', payload)
        await load()
        return res
    }
    const settleStudentFines = async (studentId) => {
        const res = await api.post('/api/librarian/transactions/settle-fines', { studentId })
        await load()
        return res
    }

    return {
        stats, bookTransactions, roomTransactions, loading, error, busyId,
        approveBook, rejectBook, confirmReturn, approveRoom, rejectRoom,
        createManual, settleStudentFines, refetch: load,
    }
}