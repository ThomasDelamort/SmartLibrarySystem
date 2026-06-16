import { useState } from 'react'
import LibrarianHeader from '../../components/librarian/LibrarianHeader.jsx'
import { useLibrarianBooks } from '../../stores/useLibrarianBooks'
import BookFormModal from './components/BookFormModal'
import LibrarianBooksSkeleton from './components/LibrarianBooksSkeleton'

import '../../styles/layout.css'
import '../../styles/librarian.css'
import '../../styles/librarian.book.css'

const authorText = (a) => (Array.isArray(a) ? a.join(', ') : a || '')
const categoryList = (c) => (Array.isArray(c) ? c : c ? [c] : [])

export default function LibrarianBooksPage() {
    const { books, pagination, loading, error, page, setPage, query, search, saveBook, deleteBook } = useLibrarianBooks()
    const [term, setTerm] = useState(query)
    const [modal, setModal] = useState(null)        // null | { book } (book null = add)
    const [notice, setNotice] = useState(null)

    const onSearch = (e) => {
        e.preventDefault()
        search(term.trim())
    }

    const onDelete = async (book) => {
        if (!window.confirm(`Delete "${book.title}"? This can't be undone.`)) return
        try {
            await deleteBook(book.id)
            setNotice('Book deleted.')
        } catch (err) {
            setNotice(err.message)
        }
    }

    const onModalClose = (saved) => {
        setModal(null)
        if (saved) setNotice('Book saved.')
    }

    return (
        <>
            <LibrarianHeader />

            <div className="container-fluid mt-4">
                <div className="container lbk-container">

                    <div className="lbk-header">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <h2 className="fw-bold mb-0">Books</h2>
                            <button className="btn btn-dark btn-lg rounded-4 px-4" onClick={() => setModal({ book: null })}>
                                + Add New Book
                            </button>
                        </div>

                        <form className="mt-3" onSubmit={onSearch}>
                            <div className="input-group">
                                <input
                                    type="text" className="form-control"
                                    placeholder="Search by title or author…"
                                    value={term}
                                    onChange={(e) => setTerm(e.target.value)}
                                />
                                <button className="btn btn-outline-dark" type="submit">Search</button>
                            </div>
                        </form>
                    </div>

                    {notice && <div className="alert alert-info">{notice}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="lbk-list">
                        {loading && <LibrarianBooksSkeleton />}

                        {!loading && !error && books.length === 0 && (
                            <p className="text-muted mb-0">No books found.</p>
                        )}

                        <div className="d-flex flex-column gap-3">
                            {books.map((book) => (
                                <div className="lbk-item" key={book.id}>
                                    <div className="row align-items-center">
                                        <div className="col-md-2 text-center">
                                            <img src={book.image} alt={book.title} className="lbk-img" />
                                        </div>

                                        <div className="col-md-7">
                                            <div className="lbk-title-status">
                                                <h5 className="lbk-title mb-0">{book.title}</h5>
                                                <span className={book.status === 'available' ? 'lbk-status-available' : 'lbk-status-borrowed'}>
                                                    {book.status}
                                                </span>
                                            </div>
                                            <p className="lbk-meta mt-2 mb-1"><strong>Author:</strong> {authorText(book.author)}</p>
                                            <p className="mb-0">
                                                <strong className="lbk-meta">Category:</strong>{' '}
                                                {categoryList(book.category).map((cat) => (
                                                    <span className="lbk-category me-1" key={cat}>{cat}</span>
                                                ))}
                                            </p>
                                        </div>

                                        <div className="col-md-3">
                                            <div className="lbk-actions d-flex flex-column gap-2">
                                                <button className="btn btn-outline-primary" onClick={() => setModal({ book })}>Edit</button>
                                                <button className="btn btn-outline-danger" onClick={() => onDelete(book)}>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="d-flex justify-content-center mt-5">
                                <nav>
                                    <ul className="pagination">
                                        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
                                        </li>
                                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((n) => (
                                            <li className={`page-item ${page === n ? 'active' : ''}`} key={n}>
                                                <button className="page-link" onClick={() => setPage(n)}>{n}</button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${page === pagination.totalPages ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => setPage(page + 1)} disabled={page === pagination.totalPages}>Next</button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {modal && (
                <BookFormModal book={modal.book} saveBook={saveBook} onClose={onModalClose} />
            )}
        </>
    )
}