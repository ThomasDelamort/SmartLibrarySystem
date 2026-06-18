import { useState } from 'react'
import { useAdminStudents } from '../../stores/useAdminStudents'
import ConfirmModal from './components/ConfirmModal'
import AdminStudentsSkeleton from './skeletons/AdminStudentsSkeleton'

const th = { padding: '10px 12px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, borderBottom: '1px solid var(--border)' }
const td = { padding: '10px 12px', color: 'var(--text-secondary)' }
const initials = (a, b) => `${(a || '')[0] || ''}${(b || '')[0] || ''}`.toUpperCase()

export default function AdminStudentsPage() {
    const { students, loading, error, query, search, toggleBorrow, deleteStudent } = useAdminStudents()
    const [term, setTerm] = useState(query)
    const [confirm, setConfirm] = useState(null)   // { kind, student }
    const [busy, setBusy] = useState(false)

    if (loading) return <AdminStudentsSkeleton />
    if (error) return <p style={{ fontSize: 13, color: '#dc2626' }}>{error}</p>

    const onConfirm = async () => {
        setBusy(true)
        try {
            if (confirm.kind === 'delete') await deleteStudent(confirm.student.id)
            else await toggleBorrow(confirm.student.id)
            setConfirm(null)
        } catch {
            // keep modal open on failure
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="sec">
            <div className="sec-label">Students</div>

            {/* Search */}
            <div className="panel" style={{ marginBottom: 10 }}>
                <form onSubmit={(e) => { e.preventDefault(); search(term.trim()) }} style={{ display: 'flex', gap: 8 }}>
                    <input
                        type="text" value={term} onChange={(e) => setTerm(e.target.value)}
                        placeholder="Search by name, email, ID..."
                        style={{ flex: 1, fontSize: 12, padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 8, background: '#f8fafc', color: 'var(--text-primary)' }}
                    />
                    <button type="submit" style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, cursor: 'pointer' }}>
                        <i className="ti ti-search"></i> Search
                    </button>
                </form>
            </div>

            {/* Table */}
            <div className="panel">
                <div className="panel-hdr">
                    <div className="panel-title"><i className="ti ti-users"></i> All Students</div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{students.length} total</span>
                </div>

                {students.length === 0 ? (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>No students found.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                            <thead>
                            <tr style={{ background: '#f8fafc' }}>
                                <th style={th}>Student</th>
                                <th style={th}>ID</th>
                                <th style={th}>Email</th>
                                <th style={th}>Fines</th>
                                <th style={th}>Borrow</th>
                                <th style={th}>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {students.map((s) => (
                                <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '10px 12px' }}>
                                        <div className="acct-row" style={{ padding: 0, border: 'none' }}>
                                            <div className="avatar av-blue">{initials(s.firstName, s.lastName)}</div>
                                            <div><div className="acct-name">{s.firstName} {s.lastName}</div></div>
                                        </div>
                                    </td>
                                    <td style={td}>{s.studentId}</td>
                                    <td style={td}>{s.email}</td>
                                    <td style={{ padding: '10px 12px' }}>
                                        <span style={{ color: s.fines > 0 ? '#e11d48' : '#16a34a', fontWeight: 600 }}>₱{s.fines}</span>
                                    </td>
                                    <td style={{ padding: '10px 12px' }}>
                                            <span className={`badge ${s.canBorrow ? 'badge-green' : 'badge-warn'}`}>
                                                {s.canBorrow ? 'true' : 'false'}
                                            </span>
                                    </td>
                                    <td style={{ padding: '10px 12px' }}>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button
                                                onClick={() => setConfirm({ kind: 'toggle', student: s })}
                                                style={{ fontSize: 11, padding: '5px 10px', borderRadius: 6, border: '1px solid var(--border)', background: '#fff', cursor: 'pointer' }}
                                            >
                                                {s.canBorrow ? 'Revoke' : 'Restore'}
                                            </button>
                                            <button
                                                onClick={() => setConfirm({ kind: 'delete', student: s })}
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
                    onClose={() => setConfirm(null)}
                    onConfirm={onConfirm}
                    {...(confirm.kind === 'delete'
                        ? {
                            title: 'Delete student?',
                            message: `"${confirm.student.firstName} ${confirm.student.lastName}" will be permanently removed. This cannot be undone.`,
                            confirmLabel: 'Delete',
                            confirmColor: '#e11d48',
                        }
                        : {
                            title: confirm.student.canBorrow ? 'Revoke borrowing?' : 'Restore borrowing?',
                            message: confirm.student.canBorrow
                                ? 'This will prevent the student from borrowing books.'
                                : 'This will allow the student to borrow books again.',
                            confirmLabel: confirm.student.canBorrow ? 'Revoke' : 'Restore',
                            confirmColor: confirm.student.canBorrow ? '#d97706' : '#16a34a',
                        })}
                />
            )}
        </div>
    )
}