import { useEffect, useState } from 'react'
import { api } from '../../../lib/api'

const TYPES = [
    { key: 'borrow', label: 'Borrow' },
    { key: 'return', label: 'Return' },
    { key: 'room', label: 'Reserve Room' },
    { key: 'settle', label: 'Settle Fines' },
]

// Librarian "Create Transaction" modal. Handles borrow / return / room / settle.
// Student search reuses GET /api/librarian/students?q=.
export default function ManualTransactionModal({ onClose, createManual, settleStudentFines }) {
    const [type, setType] = useState('borrow')

    // Student search
    const [term, setTerm] = useState('')
    const [results, setResults] = useState([])
    const [searching, setSearching] = useState(false)
    const [student, setStudent] = useState(null)   // { id, name, email, fines, canBorrow }

    // Dropdown options
    const [availableBooks, setAvailableBooks] = useState([])
    const [rooms, setRooms] = useState([])
    const [borrowedBooks, setBorrowedBooks] = useState([])

    // Form fields
    const [bookId, setBookId] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [roomId, setRoomId] = useState('')
    const [reservationDate, setReservationDate] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [purpose, setPurpose] = useState('')
    const [attendeesCount, setAttendeesCount] = useState(1)

    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    // Load available books + rooms once.
    useEffect(() => {
        api.get('/api/librarian/manual/options')
            .then((res) => { setAvailableBooks(res.availableBooks); setRooms(res.rooms) })
            .catch(() => {})
    }, [])

    // When a student is chosen and we're returning, fetch what they currently hold.
    useEffect(() => {
        if (type === 'return' && student) {
            setBookId('')
            api.get(`/api/librarian/students/${student.id}/borrowed`)
                .then((res) => setBorrowedBooks(res.books))
                .catch(() => setBorrowedBooks([]))
        }
    }, [type, student])

    const doSearch = async (e) => {
        e.preventDefault()
        if (!term.trim()) return
        setSearching(true)
        try {
            const res = await api.get(`/api/librarian/students?q=${encodeURIComponent(term.trim())}`)
            setResults(res.students)
        } catch (err) {
            setError(err.message)
        } finally {
            setSearching(false)
        }
    }

    const pickStudent = (s) => {
        setStudent({
            id: s.id,
            name: `${s.firstName} ${s.lastName}`,
            email: s.email,
            fines: s.fines,
            canBorrow: s.canBorrow,
        })
        setResults([])
        setTerm('')
    }

    const submit = async () => {
        setError(null)
        if (!student) { setError('Please search for and select a student first.'); return }

        setSubmitting(true)
        try {
            if (type === 'settle') {
                await settleStudentFines(student.id)
            } else {
                const payload = { type, studentId: student.id }
                if (type === 'borrow') Object.assign(payload, { bookId, dueDate })
                if (type === 'return') Object.assign(payload, { bookId })
                if (type === 'room') Object.assign(payload, { roomId, reservationDate, startTime, endTime, purpose, attendeesCount })
                await createManual(payload)
            }
            onClose(true)
        } catch (err) {
            setError(err.message)
            setSubmitting(false)
        }
    }

    return (
        <div
            onClick={() => onClose(false)}
            style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                padding: '5vh 1rem', zIndex: 1055, overflowY: 'auto',
            }}
        >
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded shadow" style={{ width: '100%', maxWidth: 560 }}>
                <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                    <h5 className="fw-bold mb-0">Create Transaction</h5>
                    <button type="button" className="btn-close" onClick={() => onClose(false)} />
                </div>

                <div className="p-3 d-flex flex-column gap-3">
                    {error && <div className="alert alert-danger mb-0">{error}</div>}

                    {/* Type selector */}
                    <div className="btn-group w-100" role="group">
                        {TYPES.map((t) => (
                            <button
                                key={t.key} type="button"
                                className={`btn ${type === t.key ? 'btn-dark' : 'btn-outline-dark'}`}
                                onClick={() => { setType(t.key); setError(null) }}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Student search */}
                    <div>
                        <label className="form-label fw-semibold">Student</label>
                        {student ? (
                            <div className="d-flex justify-content-between align-items-center border rounded p-2">
                                <div>
                                    <div className="fw-semibold">{student.name}</div>
                                    <small className="text-muted">{student.email} · Fines: ₱{student.fines}</small>
                                </div>
                                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setStudent(null)}>Change</button>
                            </div>
                        ) : (
                            <>
                                <div className="input-group">
                                    <input
                                        type="text" className="form-control"
                                        placeholder="Search by name, email, or ID…"
                                        value={term}
                                        onChange={(e) => setTerm(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') doSearch(e) }}
                                    />
                                    <button type="button" className="btn btn-outline-dark" onClick={doSearch} disabled={searching}>
                                        {searching ? '…' : 'Search'}
                                    </button>
                                </div>
                                {results.length > 0 && (
                                    <ul className="list-group mt-2" style={{ maxHeight: 180, overflowY: 'auto' }}>
                                        {results.map((s) => (
                                            <li
                                                key={s.id}
                                                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => pickStudent(s)}
                                            >
                                                <span>{s.firstName} {s.lastName} <small className="text-muted">({s.studentId})</small></span>
                                                <small className="text-muted">{s.email}</small>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </>
                        )}
                    </div>

                    {/* Conditional fields */}
                    {type === 'borrow' && (
                        <>
                            <div>
                                <label className="form-label fw-semibold">Book</label>
                                <select className="form-select" value={bookId} onChange={(e) => setBookId(e.target.value)}>
                                    <option value="">Select an available book…</option>
                                    {availableBooks.map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="form-label fw-semibold">Due Date</label>
                                <input type="date" className="form-control" value={dueDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setDueDate(e.target.value)} />
                            </div>
                        </>
                    )}

                    {type === 'return' && (
                        <div>
                            <label className="form-label fw-semibold">Book to Return</label>
                            <select className="form-select" value={bookId} onChange={(e) => setBookId(e.target.value)} disabled={!student}>
                                <option value="">{student ? 'Select a borrowed book…' : 'Select a student first'}</option>
                                {borrowedBooks.map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
                            </select>
                            {student && borrowedBooks.length === 0 && (
                                <small className="text-muted">This student has no borrowed books.</small>
                            )}
                        </div>
                    )}

                    {type === 'room' && (
                        <>
                            <div>
                                <label className="form-label fw-semibold">Room</label>
                                <select className="form-select" value={roomId} onChange={(e) => setRoomId(e.target.value)}>
                                    <option value="">Select an available room…</option>
                                    {rooms.map((r) => <option key={r.id} value={r.id}>Room {r.number}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="form-label fw-semibold">Date</label>
                                <input type="date" className="form-control" value={reservationDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setReservationDate(e.target.value)} />
                            </div>
                            <div className="row g-3">
                                <div className="col-6">
                                    <label className="form-label fw-semibold">Start Time</label>
                                    <input type="time" className="form-control" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                                </div>
                                <div className="col-6">
                                    <label className="form-label fw-semibold">End Time</label>
                                    <input type="time" className="form-control" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                                </div>
                            </div>
                            <div className="row g-3">
                                <div className="col-8">
                                    <label className="form-label fw-semibold">Purpose</label>
                                    <input type="text" className="form-control" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
                                </div>
                                <div className="col-4">
                                    <label className="form-label fw-semibold">Attendees</label>
                                    <input type="number" className="form-control" min={1} value={attendeesCount} onChange={(e) => setAttendeesCount(e.target.value)} />
                                </div>
                            </div>
                        </>
                    )}

                    {type === 'settle' && (
                        <div className="alert alert-warning mb-0">
                            {student
                                ? <>This will clear <strong>₱{student.fines}</strong> in fines for <strong>{student.name}</strong> and restore borrowing privileges.</>
                                : 'Select a student to settle their fines.'}
                        </div>
                    )}
                </div>

                <div className="d-flex justify-content-end gap-2 p-3 border-top">
                    <button type="button" className="btn btn-secondary" onClick={() => onClose(false)}>Cancel</button>
                    <button type="button" className="btn btn-dark" onClick={submit} disabled={submitting}>
                        {submitting ? 'Processing…' : type === 'settle' ? 'Settle Fines' : 'Create'}
                    </button>
                </div>
            </div>
        </div>
    )
}