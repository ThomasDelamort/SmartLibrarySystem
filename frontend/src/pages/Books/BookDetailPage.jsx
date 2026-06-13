import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../../lib/api'
import Header from '../../components/header/Header.jsx'
import Footer from '../../components/footer/Footer.jsx'

// Same stylesheets the EJS book page loads.
import '../../styles/style.css'
import '../../styles/layout.css'
import '../../styles/book.css'

export default function BookDetailPage() {
    const { title } = useParams()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let active = true
        setLoading(true)
        setError(null)

        api.get(`/api/books/${encodeURIComponent(title)}`)
            .then((res) => { if (active) { setData(res); setLoading(false) } })
            .catch((err) => { if (active) { setError(err.message); setLoading(false) } })

        return () => { active = false }
    }, [title])

    const book = data?.book
    const liked = book ? data.likedBooks?.includes(book._id) : false

    return (
        <>
            <Header />

            <div className="container">
                <div className="book-container mx-auto" style={{ maxWidth: 1280 }}>
                    {loading && <p className="text-muted mb-0">Loading…</p>}
                    {error && <div className="alert alert-danger mb-0">{error}</div>}

                    {!loading && !error && book && (
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
                                        <button type="button" className="btn btn-outline-primary btn-lg">
                                            Borrow Book
                                        </button>
                                    ) : (
                                        <button className="btn btn-secondary btn-lg" disabled>
                                            Unavailable
                                        </button>
                                    )}

                                    <button type="button" className="btn btn-outline-success btn-lg">
                                        🛒 Add to Bag
                                    </button>

                                    <a href={`/api/books/${book._id}/pdf`} className="btn btn-danger btn-lg">
                                        Download PDF
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    )
}