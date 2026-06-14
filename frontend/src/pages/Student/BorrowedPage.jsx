import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/header/Header.jsx'
import Footer from '../../components/footer/Footer.jsx'
import { useBorrowed } from '../../stores/useBorrowed'

import '../../styles/style.css'
import '../../styles/layout.css'

const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'

const authorText = (author) =>
    Array.isArray(author) ? author.join(', ') : (author || '')

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '')

export default function BorrowedPage() {
    const { transactions, loading, error, returnBook } = useBorrowed()
    const [notice, setNotice] = useState(null)

    // Skip any transaction whose book was deleted (book === null after populate).
    const items = (transactions || []).filter((t) => t.book)

    const handleReturn = async (transactionId) => {
        setNotice(null)
        try {
            await returnBook(transactionId)
            setNotice({ type: 'success', text: 'Return requested. A librarian will confirm it.' })
        } catch (err) {
            setNotice({ type: 'danger', text: err.message })
        }
    }

    return (
        <>
            <Header />

            <div className="container-fluid mt-4">
                <div className="container">

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold mb-0">My Borrowed Books</h2>
                        <span className="badge bg-dark fs-6">{items.length} Active</span>
                    </div>

                    {notice && <div className={`alert alert-${notice.type}`}>{notice.text}</div>}

                    {loading && <p className="text-muted">Loading…</p>}
                    {error && <div className="alert alert-danger">{error}</div>}

                    {!loading && !error && items.length === 0 && (
                        <div className="text-center mt-5">
                            <p className="text-muted fs-5">You have no borrowed books at the moment.</p>
                            <Link to="/books" className="btn btn-outline-dark mt-2">Browse Books</Link>
                        </div>
                    )}

                    {!loading && !error && items.length > 0 && (
                        <div className="d-flex flex-column gap-3">
                            {items.map((txn) => (
                                <div className="card border-0 shadow-sm p-3" key={txn._id}>
                                    <div className="row align-items-center">

                                        <div className="col-md-1 text-center">
                                            <img
                                                src={txn.book.image}
                                                alt={txn.book.title}
                                                className="img-fluid rounded"
                                                style={{ maxHeight: 120, objectFit: 'cover' }}
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <h5 className="fw-bold mb-1">{txn.book.title}</h5>
                                            <p className="text-muted mb-1">{authorText(txn.book.author)}</p>
                                            <small className="text-muted">
                                                Borrowed: <strong>{formatDate(txn.borrowDate)}</strong>
                                            </small>
                                            <br />
                                            <small className="text-muted">
                                                Due: <strong>{formatDate(txn.dueDate)}</strong>
                                            </small>
                                        </div>

                                        <div className="col-md-2">
                                            <span
                                                className={`badge fs-6 ${
                                                    txn.status === 'overdue' ? 'bg-danger' : 'bg-success'
                                                }`}
                                            >
                                                {cap(txn.status)}
                                            </span>
                                        </div>

                                        <div className="col-md-3">
                                            {txn.pendingReturn ? (
                                                <button className="btn btn-secondary w-100" disabled>
                                                    Return Pending…
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-dark w-100"
                                                    onClick={() => handleReturn(txn._id)}
                                                >
                                                    Return
                                                </button>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>

            <Footer />
        </>
    )
}