import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import { useAuth } from '../../stores/AuthContext.jsx'
import Header from '../../components/header/Header.jsx'
import Footer from '../../components/footer/Footer.jsx'

import '../../styles/style.css'
import '../../styles/layout.css'
import '../../styles/book.css'

export default function BookDetailPage() {
    const { title } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    const [book, setBook] = useState(null)
    const [liked, setLiked] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [notice, setNotice] = useState(null)          // { type, text }
    const [modal, setModal] = useState(null)            // { mode, dueDate, submitting, error }

    useEffect(() => {
        let active = true
        setLoading(true)
        setError(null)

        api.get(`/api/books/${encodeURIComponent(title)}`)
            .then((res) => {
                if (!active) return
                setBook(res.book)
                setLiked(res.likedBooks?.includes(res.book._id) || false)
                setLoading(false)
            })
            .catch((err) => { if (active) { setError(err.message); setLoading(false) } })

        return () => { active = false }
    }, [title])

    const requireLogin = () => {
        if (!user) { navigate('/login'); return false }
        return true
    }

    const handleLike = async () => {
        if (!requireLogin()) return
        try {
            const res = await api.post(`/api/students/like/${book._id}`)
            setLiked(res.liked)
            setBook((b) => ({ ...b, likes: res.likes }))
        } catch (err) {
            setNotice({ type: 'danger', text: err.message })
        }
    }

    const openModal = (mode) => {
        if (!requireLogin()) return
        setNotice(null)
        setModal({ mode, dueDate: '', submitting: false, error: null })
    }

    const submitModal = async () => {
        setModal((m) => ({ ...m, submitting: true, error: null }))
        const endpoint = modal.mode === 'borrow' ? '/api/students/borrow' : '/api/students/bag'
        try {
            await api.post(endpoint, { bookId: book._id, dueDate: modal.dueDate })
            setModal(null)
            setNotice({
                type: 'success',
                text: modal.mode === 'borrow'
                    ? 'Borrow request submitted! Show your reference to the librarian.'
                    : 'Added to your bag.',
            })
        } catch (err) {
            setModal((m) => ({ ...m, submitting: false, error: err.message }))
        }
    }

    return (
        <>
            <Header />

            <div className="container">
                <div className="book-container max-auto" style={{ maxWidth: 1280 }}>
                    {loading && <p className="text-muted mb-0">Loading…</p>}
                    {error && <div className="alert alert-danger mb-0">{error}</div>}

                    {!loading && !error && book && (
                        <>
                            {notice && (
                                <div className={`alert alert-${notice.type}`} role="alert">
                                    {notice.text}
                                </div>
                            )}

                            <div className="d-flex align-items-start gap-5 book-wrapper">

                                <div>
                                    <img src={book.image} alt={book.title} id="book-image" className="img-fluid" />
                                </div>

                                <div className="flex-grow-1">

                                    <div className="title-status">
                                        <h1 className="book-title">{book.title}</h1>
                                        <span
                                            className={`status-pill ${
                                                book.status === 'available' ? 'status-available' : 'status-borrowed'
                                            }`}
                                        >
                                            {book.status}
                                        </span>
                                        <button
                                            type="button"
                                            className="btn btn-sm"
                                            onClick={handleLike}
                                            style={{ fontSize: '1.5rem', background: 'none', border: 'none', padding: 0 }}
                                        >
                                            {liked ? '⭐' : '☆'}
                                        </button>
                                    </div>

                                    <p className="book-meta mb-1"><strong>Likes:</strong> {book.likes}</p>
                                    <p className="book-meta mb-2"><strong>Author:</strong> {book.author.join(', ')}</p>
                                    <p className="book-meta mb-3"><strong>Category:</strong> {book.category.join(', ')}</p>
                                    <hr />

                                    <div className="book-description">
                                        <h5 className="mb-3">Description</h5>
                                        <p>{book.description}</p>
                                    </div>

                                    <div className="book-actions d-flex gap-3 flex-wrap">
                                        {book.status !== 'borrowed' ? (
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary btn-lg"
                                                onClick={() => openModal('borrow')}
                                            >
                                                Borrow Book
                                            </button>
                                        ) : (
                                            <button className="btn btn-secondary btn-lg" disabled>
                                                Unavailable
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            className="btn btn-outline-success btn-lg"
                                            onClick={() => openModal('bag')}
                                        >
                                            🎒 Add to Bag
                                        </button>

                                        <a href={`/api/books/${book._id}/pdf`} className="btn btn-danger btn-lg">
                                            📄 Download PDF
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="space"></div>
            <Footer />

            {/* Date modal (borrow / bag) — plain React state, no Bootstrap JS needed */}
            {modal && (
                <div
                    onClick={() => setModal(null)}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050,
                    }}
                >
                    <div className="card p-4 shadow" style={{ width: 360 }} onClick={(e) => e.stopPropagation()}>
                        <h5 className="mb-3">{modal.mode === 'borrow' ? 'Borrow Book' : '🎒 Add to Bag'}</h5>

                        <label className="form-label">
                            Select {modal.mode === 'borrow' ? 'Return' : 'Due'} Date
                        </label>
                        <input
                            type="date"
                            className="form-control"
                            value={modal.dueDate}
                            onChange={(e) => setModal((m) => ({ ...m, dueDate: e.target.value }))}
                        />

                        {modal.error && <p className="text-danger small mt-2 mb-0">{modal.error}</p>}

                        <div className="d-flex justify-content-end gap-2 mt-3">
                            <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>
                                Cancel
                            </button>
                            <button
                                type="button"
                                className={modal.mode === 'borrow' ? 'btn btn-primary' : 'btn btn-success'}
                                onClick={submitModal}
                                disabled={modal.submitting}
                            >
                                {modal.submitting ? 'Submitting…' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}