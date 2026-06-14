import { Link } from 'react-router-dom'
import Header from '../../components/header/Header.jsx'
import Footer from '../../components/footer/Footer.jsx'
import { useLiked } from '../../stores/useLiked'
import LikedCardSkeleton from './components/LikedCardSkeleton'
import Space from "../../components/Space";

import '../../styles/style.css'
import '../../styles/layout.css'
import '../../styles/books.css'

const authorText = (author) => (Array.isArray(author) ? author.join(', ') : author || '')
const categoryList = (category) =>
    Array.isArray(category) ? category : category ? [category] : []

export default function LikedPage() {
    const { books, loading, error, unlike } = useLiked()

    return (
        <>
            <Header />

            <div className="container-fluid mt-4">
                <div className="container">

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold mb-0">Liked Books</h2>
                        <span className="badge bg-dark fs-6">{books.length} Books</span>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    {loading && <LikedCardSkeleton />}

                    {!loading && !error && books.length === 0 && (
                        <div className="text-center mt-5">
                            <p className="text-muted fs-5">You haven't liked any books yet.</p>
                            <Link to="/books" className="btn btn-outline-dark mt-2">Browse Books</Link>
                        </div>
                    )}

                    {!loading && books.length > 0 && (
                        <div className="row g-4">
                            {books.map((book) => (
                                <div className="col-md-4" key={book.id}>
                                    <div className="position-relative">
                                        {/* Unlike */}
                                        <button
                                            type="button"
                                            onClick={() => unlike(book.id)}
                                            title="Remove from liked"
                                            style={{
                                                position: 'absolute', top: 10, right: 10, zIndex: 10,
                                                background: 'white', border: 'none', borderRadius: 6,
                                                fontSize: '1.2rem', lineHeight: 1, cursor: 'pointer', padding: 4,
                                            }}
                                        >
                                            ⭐
                                        </button>

                                        <Link
                                            to={`/books/${encodeURIComponent(book.title)}`}
                                            className="text-decoration-none text-dark"
                                        >
                                            <div className="card h-100 book-card border-0 shadow-sm">
                                                <div className="d-flex h-100">
                                                    <img
                                                        src={book.image}
                                                        alt={book.title}
                                                        className="img-thumbnail"
                                                        style={{ width: 100, objectFit: 'cover' }}
                                                    />
                                                    <div className="card-body d-flex flex-column py-3">
                                                        <h6 className="card-title mb-2 fw-bold">{book.title}</h6>
                                                        <p className="mb-1 text-muted" style={{ fontSize: '0.85rem' }}>
                                                            <strong>Author:</strong> {authorText(book.author)}
                                                        </p>
                                                        <p className="mb-2 text-muted" style={{ fontSize: '0.85rem' }}>
                                                            {categoryList(book.category).map((cat) => (
                                                                <span className="cat" key={cat}>{cat}</span>
                                                            ))}
                                                        </p>
                                                        <span className={`status-pill mt-auto ${book.status === 'available' ? 'status-available' : 'status-borrowed'}`}>
                                                            {book.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>
            <Space />
            <Footer />
        </>
    )
}