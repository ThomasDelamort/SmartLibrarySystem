import { useState } from 'react'
import { useAdminRooms } from '../../stores/useAdminRooms'
import ConfirmModal from './components/ConfirmModal'
import AdminRoomsSkeleton from './skeletons/AdminRoomsSkeleton'

const th = { padding: '10px 12px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, borderBottom: '1px solid var(--border)' }
const td = { padding: '10px 12px', color: 'var(--text-secondary)' }
const inp = { width: '100%', fontSize: 12, padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 8, background: '#f8fafc', color: 'var(--text-primary)' }
const lbl = { fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }
const statusClass = (s) => (s === 'available' ? 'badge-green' : s === 'reserved' ? 'badge-warn' : 'badge-red')

export default function AdminRoomsPage() {
    const { rooms, loading, error, addRoom, deleteRoom, updateStatus } = useAdminRooms()
    const [form, setForm] = useState({ number: '', capacity: '', description: '' })
    const [adding, setAdding] = useState(false)
    const [formError, setFormError] = useState(null)
    const [confirm, setConfirm] = useState(null)
    const [busy, setBusy] = useState(false)

    if (loading) return <AdminRoomsSkeleton />
    if (error) return <p style={{ fontSize: 13, color: '#dc2626' }}>{error}</p>

    const submitAdd = async (e) => {
        e.preventDefault()
        setFormError(null)
        setAdding(true)
        try {
            await addRoom(form)
            setForm({ number: '', capacity: '', description: '' })
        } catch (err) {
            setFormError(err.message)
        } finally {
            setAdding(false)
        }
    }

    const onConfirm = async () => {
        setBusy(true)
        try {
            await deleteRoom(confirm.id)
            setConfirm(null)
        } catch {
            // keep modal open
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="sec">
            <div className="sec-label">Rooms</div>

            {/* Add Room */}
            <div className="panel" style={{ marginBottom: 10 }}>
                <div className="panel-hdr"><div className="panel-title"><i className="ti ti-plus"></i>Add Room</div></div>
                {formError && <p style={{ fontSize: 12, color: '#e11d48', marginBottom: 8 }}>{formError}</p>}
                <form onSubmit={submitAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10, alignItems: 'end' }}>
                    <div>
                        <label style={lbl}>Room Number</label>
                        <input type="text" required placeholder="e.g. 101" value={form.number} onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))} style={inp} />
                    </div>
                    <div>
                        <label style={lbl}>Capacity</label>
                        <input type="number" required min={1} placeholder="e.g. 10" value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))} style={inp} />
                    </div>
                    <div>
                        <label style={lbl}>Description</label>
                        <input type="text" placeholder="Optional" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} style={inp} />
                    </div>
                    <button type="submit" disabled={adding} style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        <i className="ti ti-plus"></i> {adding ? 'Adding…' : 'Add Room'}
                    </button>
                </form>
            </div>

            {/* Table */}
            <div className="panel">
                <div className="panel-hdr">
                    <div className="panel-title"><i className="ti ti-building"></i> All Rooms</div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{rooms.length} total</span>
                </div>

                {rooms.length === 0 ? (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>No rooms found.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                            <thead>
                            <tr style={{ background: '#f8fafc' }}>
                                <th style={th}>Room</th>
                                <th style={th}>Capacity</th>
                                <th style={th}>Description</th>
                                <th style={th}>Status</th>
                                <th style={th}>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {rooms.map((r) => (
                                <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '10px 12px' }}><div className="acct-name">Room {r.number}</div></td>
                                    <td style={td}>{r.capacity} pax</td>
                                    <td style={td}>{r.description || '—'}</td>
                                    <td style={{ padding: '10px 12px' }}><span className={`badge ${statusClass(r.status)}`}>{r.status}</span></td>
                                    <td style={{ padding: '10px 12px' }}>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <select
                                                value={r.status}
                                                onChange={(e) => updateStatus(r.id, e.target.value)}
                                                style={{ fontSize: 11, padding: '4px 6px', border: '1px solid var(--border)', borderRadius: 6, background: '#fff', color: 'var(--text-primary)' }}
                                            >
                                                <option value="available">Available</option>
                                                <option value="reserved">Reserved</option>
                                                <option value="maintenance">Maintenance</option>
                                            </select>
                                            <button
                                                onClick={() => setConfirm(r)}
                                                style={{ fontSize: 11, padding: '5px 10px', borderRadius: 6, border: '1px solid #fecdd3', background: '#fff1f2', color: '#e11d48', cursor: 'pointer' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {confirm && (
                <ConfirmModal
                    busy={busy}
                    title="Delete room?"
                    message={`Room ${confirm.number} will be permanently removed. This cannot be undone.`}
                    confirmLabel="Delete"
                    confirmColor="#e11d48"
                    onClose={() => setConfirm(null)}
                    onConfirm={onConfirm}
                />
            )}
        </div>
    )
}