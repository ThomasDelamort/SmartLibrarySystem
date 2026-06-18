import { useState } from 'react'
import { useAdminBooks } from '../../stores/useAdminBooks'
import ConfirmModal from './components/ConfirmModal'
import AdminBooksSkeleton from './skeletons/AdminBooksSkeleton'

const th = { padding: '10px 12px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, borderBottom: '1px solid var(--border)' }
const td = { padding: '10px 12px', color: 'var(--text-secondary)' }
const statusClass = (s) => (s === 'available' ? 'badge-green' : s === 'borrowed' ? 'badge-warn' : 'badge-red')

const RankList = ({ items, metric }) => (
    <>
        {items.length === 0 && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>No data yet.</p>}
        {items.map((item, i) => (
            <div className="stat-book" key={item.id}>
                <div className="book-rank">{i + 1}</div>
                <div className="book-info">
                    <div className="book-title">{item.title}</div>
                    <div className="book-author">{item.author}</div>
                </div>
                <div className="book-count">{metric === 'likes' ? `⭐ ${item.likes}` : `${item.count} x`}</div>
            </div>
        ))}
    </>
)

export default function AdminBooksPage() {
    const { books, mostBorrowed, mostLiked, loading, error, query, search, deleteBook } = useAdminBooks()
    const [term, setTerm] = useState(query)
    const [confirm, setConfirm] = useState(null)
    const [busy, setBusy] = useState(false)

    if (loading) return <AdminBooksSkeleton />
    if (error) return <p style={{ fontSize: 13, color: '#dc2626' }}>{error}</p>

    const onConfirm = async () => {
        setBusy(true)
        try {
            await deleteBook(confirm.id)
            setConfirm(null)
        } catch {
            // keep modal open
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="sec">
            <div className="sec-label">Books</div>

            {/* Stats row */}
            <div className="two-col" style={{ marginBottom: 10 }}>
                <div className="panel">
                    <div className="panel-hdr"><div className="panel-title"><i className="ti ti-refresh"></i>Most Borrowed</div></div>
                    <RankList items={mostBorrowed} metric="count" />
                </div>
                <div className="panel">
                    <div className="panel-hdr"><div className="panel-title"><i className="ti ti-star"></i>Most Liked</div></div>
                    <RankList items={mostLiked} metric="likes" />
                </div>
            </div>

            {/* Search */}
            <div className="panel" style={{ marginBottom: 10 }}>
                <form onSubmit={(e) => { e.preventDefault(); search(term.trim()) }} style={{ display: 'flex', gap: 8 }}>
                    <input
                        type="text" value={term} onChange={(e) => setTerm(e.target.value)}
                        placeholder="Search by title or author..."
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
                    <div className="panel-title"><i className="ti ti-book"></i> All Books</div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{books.length} total</span>
                </div>

                {books.length === 0 ? (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>No books found.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                            <thead>
                            <tr style={{ background: '#f8fafc' }}>
                                <th style={th}>Book</th>
                                <th style={th}>Author</th>
                                <th style={th}>Category</th>
                                <th style={th}>Status</th>
                                <th style={th}>Likes</th>
                                <th style={th}>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {books.map((b) => (
                                <tr key={b.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '10px 12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <img src={b.image} alt={b.title} style={{ width: 32, height: 42, objectFit: 'cover', borderRadius: 4 }} />
                                            <div className="book-title" style={{ maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.title}</div>
                                        </div>
                                    </td>
                                    <td style={td}>{b.author}</td>
                                    <td style={td}>{b.category}</td>
                                    <td style={{ padding: '10px 12px' }}><span className={`badge ${statusClass(b.status)}`}>{b.status}</span></td>
                                    <td style={td}>⭐ {b.likes}</td>
                                    <td style={{ padding: '10px 12px' }}>
                                        <button
                                            onClick={() => setConfirm(b)}
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
                    title="Delete book?"
                    message={`"${confirm.title}" will be permanently removed. This cannot be undone.`}
                    confirmLabel="Delete"
                    confirmColor="#e11d48"
                    onClose={() => setConfirm(null)}
                    onConfirm={onConfirm}
                />
            )}
        </div>
    )
}