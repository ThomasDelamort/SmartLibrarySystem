import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../lib/api";
import "./BooksPage.css";

// Detail page for one book (by title), consuming GET /api/books/:title.
export default function BookDetailPage() {
    const { title } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError(null);

        api
            .get(`/api/books/${encodeURIComponent(title)}`)
            .then((res) => {
                if (active) {
                    setData(res);
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (active) {
                    setError(err.message);
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [title]);

    if (loading) {
        return (
            <div className="container mt-4">
                <p className="text-muted">Loading…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">{error}</div>
                <Link to="/books">← Back to books</Link>
            </div>
        );
    }

    const book = data.book;

    return (
        <div className="container mt-4">
            <Link to="/books" className="btn btn-link px-0 mb-3">
                ← Back to books
            </Link>

            <div className="row g-4">
                <div className="col-md-4">
                    <img src={book.image} alt={book.title} className="img-fluid rounded shadow-sm" />
                </div>

                <div className="col-md-8">
                    <h2 className="fw-bold">{book.title}</h2>
                    <p className="mb-1">
                        <strong>Author:</strong> {book.author.join(", ")}
                    </p>
                    <p className="mb-1">
                        <strong>Category:</strong> {book.category.join(", ")}
                    </p>
                    {book.publisher && (
                        <p className="mb-1">
                            <strong>Publisher:</strong> {book.publisher}
                        </p>
                    )}
                    {book.publishedYear && (
                        <p className="mb-1">
                            <strong>Year:</strong> {book.publishedYear}
                        </p>
                    )}
                    {book.isbn && (
                        <p className="mb-1">
                            <strong>ISBN:</strong> {book.isbn}
                        </p>
                    )}

                    <span
                        className={`status-pill ${
                            book.status === "available" ? "status-available" : "status-borrowed"
                        }`}
                    >
                        {book.status}
                    </span>

                    <p className="mt-3">{book.description}</p>

                    {book.pdfUrl && (
                        <a className="btn btn-outline-primary mt-2" href={`/api/books/${book._id}/pdf`}>
                            Download PDF
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}