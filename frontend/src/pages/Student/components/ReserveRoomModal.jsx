import { useState } from 'react'

const todayISO = () => new Date().toISOString().split('T')[0]

// Lightweight React modal (no Bootstrap JS) for reserving a room.
export default function ReserveRoomModal({ room, onClose, reserve, searchStudents }) {
    const [form, setForm] = useState({
        reservationDate: '',
        startTime: '',
        endTime: '',
        purpose: '',
        attendeesCount: 1,
    })
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [searched, setSearched] = useState(false)
    const [invited, setInvited] = useState([])
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    const runSearch = async () => {
        const q = query.trim()
        if (!q) return
        try {
            const found = await searchStudents(q)
            // Hide already-invited students from the results.
            setResults(found.filter((s) => !invited.some((i) => i.id === s.id)))
            setSearched(true)
        } catch {
            setResults([])
            setSearched(true)
        }
    }

    const addInvite = (s) => {
        setInvited((prev) => [...prev, s])
        setResults((prev) => prev.filter((r) => r.id !== s.id))
        setQuery('')
        setSearched(false)
    }

    const removeInvite = (id) => setInvited((prev) => prev.filter((i) => i.id !== id))

    const submit = async (e) => {
        e.preventDefault()
        setError(null)
        setSubmitting(true)
        try {
            await reserve({
                roomId: room.id,
                reservationDate: form.reservationDate,
                startTime: form.startTime,
                endTime: form.endTime,
                purpose: form.purpose,
                attendeesCount: form.attendeesCount,
                invites: invited.map((i) => i.id),
            })
            onClose(true) // success -> let parent refresh / redirect
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
                padding: '5vh 1rem', zIndex: 1050, overflowY: 'auto',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded shadow"
                style={{ width: '100%', maxWidth: 500 }}
            >
                <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                    <h5 className="fw-bold mb-0">Reserve Room {room.number}</h5>
                    <button type="button" className="btn-close" onClick={() => onClose(false)} />
                </div>

                <form onSubmit={submit}>
                    <div className="p-3 d-flex flex-column gap-3">
                        {error && <div className="alert alert-danger mb-0">{error}</div>}

                        <div>
                            <label className="form-label">Date</label>
                            <input
                                type="date" className="form-control" required min={todayISO()}
                                value={form.reservationDate}
                                onChange={(e) => setForm({ ...form, reservationDate: e.target.value })}
                            />
                        </div>

                        <div className="row g-2">
                            <div className="col">
                                <label className="form-label">Start Time</label>
                                <input
                                    type="time" className="form-control" required
                                    value={form.startTime}
                                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                                />
                            </div>
                            <div className="col">
                                <label className="form-label">End Time</label>
                                <input
                                    type="time" className="form-control" required
                                    value={form.endTime}
                                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Purpose</label>
                            <input
                                type="text" className="form-control" maxLength={300} placeholder="e.g. Group Study"
                                value={form.purpose}
                                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="form-label">Number of Attendees</label>
                            <input
                                type="number" className="form-control" min={1} max={room.capacity} required
                                value={form.attendeesCount}
                                onChange={(e) => setForm({ ...form, attendeesCount: e.target.value })}
                            />
                            <small className="text-muted">Room capacity: {room.capacity}</small>
                        </div>

                        {/* Invite students */}
                        <div>
                            <label className="form-label">
                                Invite Students <small className="text-muted">(optional)</small>
                            </label>
                            <div className="input-group mb-2">
                                <input
                                    type="text" className="form-control"
                                    placeholder="Search by name, email, or ID..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); runSearch() } }}
                                />
                                <button type="button" className="btn btn-outline-dark" onClick={runSearch}>
                                    Search
                                </button>
                            </div>

                            {/* Search results */}
                            <div className="d-flex flex-column gap-1 mb-2">
                                {searched && results.length === 0 && (
                                    <small className="text-muted">No students found.</small>
                                )}
                                {results.map((s) => (
                                    <div key={s.id} className="d-flex justify-content-between align-items-center p-2 border rounded">
                                        <div>
                                            <small className="fw-semibold">{s.firstName} {s.lastName}</small>
                                            <small className="text-muted d-block">{s.email}</small>
                                        </div>
                                        <button type="button" className="btn btn-sm btn-outline-dark" onClick={() => addInvite(s)}>
                                            Invite
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Invited list */}
                            <div className="d-flex flex-column gap-1">
                                {invited.map((s) => (
                                    <div key={s.id} className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                                        <div>
                                            <small className="fw-semibold">{s.firstName} {s.lastName}</small>
                                            <small className="text-muted d-block">{s.email}</small>
                                        </div>
                                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeInvite(s.id)}>
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2 p-3 border-top">
                        <button type="button" className="btn btn-secondary" onClick={() => onClose(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Reserving…' : 'Confirm Reservation'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}