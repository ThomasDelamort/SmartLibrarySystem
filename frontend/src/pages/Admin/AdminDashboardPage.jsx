import { useState } from 'react'
import { useAdminDashboard } from '../../stores/useAdminDashboard'
import TrafficChart from './components/TrafficChart'
import ReservationChart from './components/ReservationChart'
import AdminDashboardSkeleton from './skeletons/AdminDashboardSkeleton'

const initials = (name) => name.split(' ').map((p) => p[0] || '').join('').slice(0, 2).toUpperCase()
const shortDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

export default function AdminDashboardPage() {
    const { data, loading, error } = useAdminDashboard()
    const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0])

    if (loading) return <AdminDashboardSkeleton />
    if (error) return <p style={{ fontSize: 13, color: '#dc2626' }}>{error}</p>
    if (!data) return null

    const { stats, reservations, recentStudents, recentLibrarians, mostBorrowed, recentActivity } = data

    return (
        <>
            <div className="sec-label" style={{ marginBottom: 16 }}>Overview</div>

            {/* Stats */}
            <div className="stat-grid">
                <div className="stat-card">
                    <div className="stat-label"><i className="ti ti-users" style={{ fontSize: 13 }}></i>Students</div>
                    <div className="stat-val">{stats.totalStudents}</div>
                    <div className="stat-sub">Active accounts</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label"><i className="ti ti-user-check" style={{ fontSize: 13 }}></i>Librarians</div>
                    <div className="stat-val">{stats.totalLibrarians}</div>
                    <div className="stat-sub">Staff accounts</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label"><i className="ti ti-book" style={{ fontSize: 13 }}></i>Books</div>
                    <div className="stat-val">{stats.totalBooks}</div>
                    <div className="stat-sub">In catalogue</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label"><i className="ti ti-activity" style={{ fontSize: 13 }}></i>Reservations</div>
                    <div className="stat-val">{reservations.processed}</div>
                    <div className="stat-sub">Processed total</div>
                </div>
            </div>

            {/* Analytics */}
            <div className="sec" style={{ marginTop: 16 }}>
                <div className="sec-label">Analytics</div>

                <TrafficChart />

                <div className="two-col">
                    <ReservationChart initialProcessed={reservations.processed} initialCancelled={reservations.cancelled} />

                    <div className="panel">
                        <div className="panel-hdr">
                            <div className="panel-title"><i className="ti ti-file-text"></i>Daily log</div>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            Exports all activity for the selected date as a CSV file.
                        </div>
                        <div style={{ marginTop: 10 }}>
                            <label style={{ fontSize: 11, color: 'var(--text-muted)' }}>Log date</label>
                            <input
                                type="date" value={logDate} onChange={(e) => setLogDate(e.target.value)}
                                style={{ width: '100%', marginTop: 4, fontSize: 12, padding: '6px 8px', border: '1px solid var(--border)', borderRadius: 6, background: '#f8fafc', color: 'var(--text-primary)' }}
                            />
                        </div>
                        <button className="dl-btn" onClick={() => window.open(`/api/admin/log/download?date=${logDate}`, '_blank')}>
                            <i className="ti ti-download"></i> Download CSV
                        </button>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="sec">
                <div className="sec-label">Statistics</div>
                <div className="two-col">
                    <div className="panel">
                        <div className="panel-hdr">
                            <div className="panel-title"><i className="ti ti-refresh"></i>Most borrowed</div>
                        </div>
                        {mostBorrowed.length === 0 && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>No data yet.</p>}
                        {mostBorrowed.map((item, i) => (
                            <div className="stat-book" key={item.id}>
                                <div className="book-rank">{i + 1}</div>
                                <div className="book-info">
                                    <div className="book-title">{item.title}</div>
                                </div>
                                <div className="book-count">{item.count} x</div>
                            </div>
                        ))}
                    </div>

                    <div className="panel">
                        <div className="panel-hdr">
                            <div className="panel-title"><i className="ti ti-users"></i>Recent accounts</div>
                        </div>
                        {recentStudents.map((s) => (
                            <div className="acct-row" key={s.id}>
                                <div className="avatar av-blue">{initials(s.name)}</div>
                                <div style={{ flex: 1 }}>
                                    <div className="acct-name">{s.name}</div>
                                    <div className="acct-email">{s.email}</div>
                                </div>
                                <span className="badge badge-blue">Student</span>
                            </div>
                        ))}
                        {recentLibrarians.map((l) => (
                            <div className="acct-row" key={l.id}>
                                <div className="avatar av-green">{initials(l.name)}</div>
                                <div style={{ flex: 1 }}>
                                    <div className="acct-name">{l.name}</div>
                                    <div className="acct-email">{l.email}</div>
                                </div>
                                <span className="badge badge-green">Librarian</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="sec">
                <div className="sec-label">Recent Activity</div>
                <div className="two-col">
                    <div className="panel">
                        <div className="panel-hdr">
                            <div className="panel-title">Pending transactions</div>
                        </div>
                        {recentActivity.length === 0 && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>No pending transactions.</p>}
                        {recentActivity.map((txn) => (
                            <div className="activity-item" key={txn.id}>
                                <div className="act-icon ic-blue"><i className="ti ti-book"></i></div>
                                <div style={{ flex: 1 }}>
                                    <div className="act-title">{txn.student}</div>
                                    <div className="act-desc">Borrow: {txn.book}</div>
                                </div>
                                <div className="act-time">{shortDate(txn.createdAt)}</div>
                            </div>
                        ))}
                    </div>

                    <div className="panel">
                        <div className="panel-hdr">
                            <div className="panel-title">Quick actions</div>
                        </div>
                        <a className="qa-btn" style={{ cursor: 'pointer' }} onClick={() => document.getElementById('students')?.scrollIntoView({ behavior: 'smooth' })}><i className="ti ti-users"></i> Manage Students</a>
                        <a className="qa-btn" style={{ cursor: 'pointer' }} onClick={() => document.getElementById('librarians')?.scrollIntoView({ behavior: 'smooth' })}><i className="ti ti-user-check"></i> Manage Librarians</a>
                        <a className="qa-btn" style={{ cursor: 'pointer' }} onClick={() => document.getElementById('books')?.scrollIntoView({ behavior: 'smooth' })}><i className="ti ti-book"></i> Manage Books</a>
                        <a className="qa-btn" style={{ cursor: 'pointer' }} onClick={() => document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' })}><i className="ti ti-building"></i> Manage Rooms</a>
                    </div>
                </div>
            </div>
        </>
    )
}