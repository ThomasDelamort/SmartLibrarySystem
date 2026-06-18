import { useAdminTransactions } from '../../stores/useAdminTransactions'
import AdminTransactionsSkeleton from './skeletons/AdminTransactionsSkeleton'

const th = { padding: '10px 12px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, borderBottom: '1px solid var(--border)' }
const td = { padding: '10px 12px', color: 'var(--text-secondary)' }
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—')

const bookStatusClass = (s) =>
    s === 'approved' ? 'badge-green' : s === 'pending' ? 'badge-warn' : s === 'overdue' ? 'badge-red' : s === 'returned' ? 'badge-blue' : ''
const roomStatusClass = (s) =>
    ['approved', 'completed'].includes(s) ? 'badge-green' : s === 'pending' ? 'badge-warn' : ['rejected', 'cancelled'].includes(s) ? 'badge-red' : 'badge-blue'

export default function AdminTransactionsPage() {
    const { bookTransactions, roomTransactions, loading, error } = useAdminTransactions()

    if (loading) return <AdminTransactionsSkeleton />
    if (error) return <p style={{ fontSize: 13, color: '#dc2626' }}>{error}</p>

    return (
        <div className="sec">
            <div className="sec-label">Transactions</div>

            {/* Book Transactions */}
            <div className="panel" style={{ marginBottom: 10 }}>
                <div className="panel-hdr">
                    <div className="panel-title"><i className="ti ti-book"></i> Book Transactions</div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{bookTransactions.length} records</span>
                </div>
                {bookTransactions.length === 0 ? (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>No book transactions.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                            <thead>
                            <tr style={{ background: '#f8fafc' }}>
                                <th style={th}>Student</th>
                                <th style={th}>Book</th>
                                <th style={th}>Type</th>
                                <th style={th}>Status</th>
                                <th style={th}>Due Date</th>
                                <th style={th}>Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {bookTransactions.map((t) => (
                                <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '10px 12px' }}>
                                        <div className="acct-name">{t.student}</div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.studentId}</div>
                                    </td>
                                    <td style={{ ...td, maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.book}</td>
                                    <td style={{ padding: '10px 12px' }}>
                                        <span className={`badge ${t.transactionType === 'borrow' ? 'badge-blue' : 'badge-warn'}`}>{t.transactionType}</span>
                                    </td>
                                    <td style={{ padding: '10px 12px' }}><span className={`badge ${bookStatusClass(t.status)}`}>{t.status}</span></td>
                                    <td style={td}>{fmtDate(t.dueDate)}</td>
                                    <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{fmtDate(t.createdAt)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Room Reservations */}
            <div className="panel">
                <div className="panel-hdr">
                    <div className="panel-title"><i className="ti ti-building"></i> Room Reservations</div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{roomTransactions.length} records</span>
                </div>
                {roomTransactions.length === 0 ? (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>No room reservations.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                            <thead>
                            <tr style={{ background: '#f8fafc' }}>
                                <th style={th}>Student</th>
                                <th style={th}>Room</th>
                                <th style={th}>Date</th>
                                <th style={th}>Time</th>
                                <th style={th}>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {roomTransactions.map((t) => (
                                <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '10px 12px' }}><div className="acct-name">{t.student}</div></td>
                                    <td style={td}>{t.room}</td>
                                    <td style={td}>{fmtDate(t.reservationDate)}</td>
                                    <td style={td}>{t.startTime && t.endTime ? `${t.startTime} - ${t.endTime}` : '—'}</td>
                                    <td style={{ padding: '10px 12px' }}><span className={`badge ${roomStatusClass(t.status)}`}>{t.status}</span></td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}