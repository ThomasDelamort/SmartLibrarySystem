import { useState } from 'react'
import { useAdminLibrarians } from '../../stores/useAdminLibrarians'
import ConfirmModal from './components/ConfirmModal'
import AdminLibrariansSkeleton from './skeletons/AdminLibrariansSkeleton'

const th = { padding: '10px 12px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, borderBottom: '1px solid var(--border)' }
const td = { padding: '10px 12px', color: 'var(--text-secondary)' }
const initials = (a, b) => `${(a || '')[0] || ''}${(b || '')[0] || ''}`.toUpperCase()
const joined = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default function AdminLibrariansPage() {
    const { librarians, loading, error, deleteLibrarian } = useAdminLibrarians()
    const [confirm, setConfirm] = useState(null)   // librarian
    const [busy, setBusy] = useState(false)

    if (loading) return <AdminLibrariansSkeleton />
    if (error) return <p style={{ fontSize: 13, color: '#dc2626' }}>{error}</p>

    const onConfirm = async () => {
        setBusy(true)
        try {
            await deleteLibrarian(confirm.id)
            setConfirm(null)
        } catch {
            // keep modal open on failure
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="sec">
            <div className="sec-label">Librarians</div>

            <div className="panel">
                <div className="panel-hdr">
                    <div className="panel-title"><i className="ti ti-user-check"></i> All Librarians</div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{librarians.length} total</span>
                </div>

                {librarians.length === 0 ? (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>No librarians found.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                            <thead>
                            <tr style={{ background: '#f8fafc' }}>
                                <th style={th}>Librarian</th>
                                <th style={th}>Email</th>
                                <th style={th}>Sex</th>
                                <th style={th}>Joined</th>
                                <th style={th}>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {librarians.map((l) => (
                                <tr key={l.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '10px 12px' }}>
                                        <div className="acct-row" style={{ padding: 0, border: 'none' }}>
                                            <div className="avatar av-green">{initials(l.firstName, l.lastName)}</div>
                                            <div><div className="acct-name">{l.firstName} {l.lastName}</div></div>
                                        </div>
                                    </td>
                                    <td style={td}>{l.email}</td>
                                    <td style={{ ...td, textTransform: 'capitalize' }}>{l.sex || '—'}</td>
                                    <td style={td}>{joined(l.createdAt)}</td>
                                    <td style={{ padding: '10px 12px' }}>
                                        <button
                                            onClick={() => setConfirm(l)}
                                            style={{ fontSize: 11, padding: '5px 10px', borderRadius: 6, border: '1px solid #fecdd3', background: '#fff1f2', color: '#e11d48', cursor: 'pointer' }}
                                        >
                                            Delete
                                        </button>
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
                    title="Delete librarian?"
                    message={`"${confirm.firstName} ${confirm.lastName}" will be permanently removed. This cannot be undone.`}
                    confirmLabel="Delete"
                    confirmColor="#e11d48"
                    onClose={() => setConfirm(null)}
                    onConfirm={onConfirm}
                />
            )}
        </div>
    )
}