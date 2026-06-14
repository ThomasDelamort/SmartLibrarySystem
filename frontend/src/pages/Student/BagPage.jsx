import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/header/Header.jsx'
import Footer from '../../components/footer/Footer.jsx'
import { useBag } from '../../stores/useBag'
import RowCardSkeleton from './components/RowCardSkeleton'

import '../../styles/style.css'
import '../../styles/layout.css'

const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

export default function BagPage() {
    const { items, loading, error, remove, borrowAll } = useBag()
    const [notice, setNotice] = useState(null)
    const [working, setWorking] = useState(false)

    const handleRemove = async (bookId) => {
        try {
            await remove(bookId)
        } catch (err) {
            setNotice({ type: 'danger', text: err.message })
        }
    }

    const handleBorrowAll = async () => {
        setWorking(true)
        setNotice(null)
        try {
            const res = await borrowAll()
            setNotice({
                type: 'success',
                text: `Borrow request submitted for ${res.borrowed} book${res.borrowed !== 1 ? 's' : ''}.`,
            })
        } catch (err) {
            setNotice({ type: 'danger', text: err.message })
        } finally {
            setWorking(false)
        }
    }

    return (
        <>
            <Header />

            <div className="container-fluid mt-4">
                <div className="container">

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold mb-0">🎒 My Bag</h2>
                        <span className="badge bg-dark fs-6">
                            {items.length} Item{items.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {notice && <div className={`alert alert-${notice.type}`}>{notice.text}</div>}

                    {loading && (
                        <div className="d-flex flex-column gap-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <RowCardSkeleton key={i} />
                            ))}
                        </div>
                    )}
                    {error && <div className="alert alert-danger">{error}</div>}

                    {!loading && !error && items.length === 0 && (
                        <div className="text-center mt-5">
                            <p className="text-muted fs-5">Your bag is empty.</p>
                            <Link to="/books" className="btn btn-outline-dark mt-2">Browse Books</Link>
                        </div>
                    )}

                    {!loading && !error && items.length > 0 && (
                        <>
                            <div className="d-flex flex-column gap-3 mb-4">
                                {items.map((item) => (
                                    <div className="card border-0 shadow-sm p-3" key={item.book._id}>
                                        <div className="row align-items-center">
                                            <div className="col-md-1 text-center">
                                                <img
                                                    src={item.book.image}
                                                    alt={item.book.title}
                                                    className="img-fluid rounded"
                                                    style={{ maxHeight: 120, objectFit: 'cover' }}
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <h5 className="fw-bold mb-1">{item.book.title}</h5>
                                                <p className="text-muted mb-1">{item.book.author.join(', ')}</p>
                                                <small className="text-muted">
                                                    Due: <strong>{formatDate(item.dueDate)}</strong>
                                                </small>
                                            </div>

                                            <div className="col-md-2">
                                                <span
                                                    className={`badge fs-6 ${
                                                        item.book.status === 'available' ? 'bg-success' : 'bg-secondary'
                                                    }`}
                                                >
                                                    {item.book.status.charAt(0).toUpperCase() + item.book.status.slice(1)}
                                                </span>
                                            </div>

                                            <div className="col-md-3">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger w-100"
                                                    onClick={() => handleRemove(item.book._id)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="d-flex justify-content-end gap-3">
                                <Link to="/books" className="btn btn-outline-secondary btn-lg">
                                    Continue Browsing
                                </Link>
                                <button
                                    type="button"
                                    className="btn btn-primary btn-lg"
                                    onClick={handleBorrowAll}
                                    disabled={working}
                                >
                                    {working ? 'Submitting…' : `Borrow All (${items.length})`}
                                </button>
                            </div>
                        </>
                    )}

                </div>
            </div>

            <Footer />
        </>
    )
}