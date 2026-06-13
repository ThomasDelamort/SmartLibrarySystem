import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BookCardSkeleton from './BookCardSkeleton'
import { useBooks } from '../../../stores/useBooks'

// Content styles (cards, filter, pagination, skeleton). src is three levels up.
import '../../../styles/style.css'
import '../../../styles/books.css'
import '../../../styles/skeleton.css'

const CATEGORIES = [
    'Fantasy',
    'Science Fiction',
    'Romance',
    'Horror',
    'Business',
    'Self Help',
    'Biography',
]

export default function BooksContent() {
    const { books, totalPages, loading, error, page, selectedCategories, goToPage, applyCategories } =
        useBooks()

    const [checkedCats, setCheckedCats] = useState(selectedCategories)
    useEffect(() => {
        setCheckedCats(selectedCategories)
    }, [selectedCategories.join(',')])

    const toggleCheck = (cat) => {
        setCheckedCats((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        )
    }

    const onApply = (e) => {
        e.preventDefault()
        applyCategories(checkedCats)
    }

    return (
        <div className="container-fluid mt-4">
            <div className="row g-4">

                {/* FILTER */}
                <div className="col-md-2">
                    <div className="filter-card">
                        <div className="filter-header text-center">
                            <h4 className="fw-medium mb-0">Filter</h4>
                        </div>
                        <div className="filter-body">
                            <h5 className="mb-3">Categories</h5>
                            <form onSubmit={onApply}>
                                {CATEGORIES.map((cat) => (
                                    <div className="form-check" key={cat}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={cat}
                                            checked={checkedCats.includes(cat)}
                                            onChange={() => toggleCheck(cat)}
                                        />
                                        <label className="form-check-label" htmlFor={cat}>{cat}</label>
                                    </div>
                                ))}
                                <button type="submit" className="btn btn-outline-success mt-3 w-100">
                                    Apply Filter
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* BOOKS */}
                <div className="col-md-10">
                    <div className="dashboard-container">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="fw-bold mb-1">Books</h3>
                        </div>

                        {loading && (
                            <div className="row g-4">
                                {Array.from({ length: 9 }).map((_, i) => (
                                    <BookCardSkeleton key={i} />
                                ))}
                            </div>
                        )}
                        {error && <div className="alert alert-danger">{error}</div>}

                        {!loading && !error && (
                            <div className="row g-4">
                                {books.map((book) => (
                                    <div className="col-md-4" key={book._id}>
                                        <Link
                                            to={`/books/${encodeURIComponent(book.title)}`}
                                            className="text-decoration-none text-dark"
                                        >
                                            <div className="card h-100 book-card" id="book-card">
                                                <div className="d-flex h-100">
                                                    <img src={book.image} alt={book.title} className="img-thumbnail" />
                                                    <div className="card-body d-flex flex-column py-3">
                                                        <h6 className="card-title mb-2">{book.title}</h6>
                                                        <p className="mb-1 book-info">
                                                            <strong>Author:</strong> {book.author.join(', ')}
                                                        </p>
                                                        <div id="chicken">
                                                            <p className="mb-3 book-info">
                                                                <strong>Category:</strong>{' '}
                                                                {book.category.map((cat) => (
                                                                    <span className="cat" key={cat}>{cat}</span>
                                                                ))}
                                                            </p>
                                                        </div>
                                                        <span
                                                            className={`status-pill ${
                                                                book.status === 'available'
                                                                    ? 'status-available'
                                                                    : 'status-borrowed'
                                                            }`}
                                                        >
                                                            {book.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="d-flex justify-content-center mt-5">
                            <nav>
                                <ul className="pagination">
                                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => goToPage(page - 1)} disabled={page === 1}>
                                            Previous
                                        </button>
                                    </li>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                                        <li className={`page-item ${page === n ? 'active' : ''}`} key={n}>
                                            <button className="page-link" onClick={() => goToPage(n)}>{n}</button>
                                        </li>
                                    ))}

                                    <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => goToPage(page + 1)} disabled={page === totalPages}>
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}