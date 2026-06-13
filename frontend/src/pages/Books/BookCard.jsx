import { Link } from "react-router-dom";

// A single book card. Mirrors the markup from books.ejs and links to the detail page.
export default function BookCard({ book }) {
    return (
        <Link
            to={`/books/${encodeURIComponent(book.title)}`}
            className="text-decoration-none text-dark"
        >
            <div className="card h-100 book-card">
                <div className="d-flex h-100">
                    <img src={book.image} alt={book.title} className="img-thumbnail book-thumb" />
                    <div className="card-body d-flex flex-column py-3">
                        <h6 className="card-title mb-2">{book.title}</h6>

                        <p className="mb-1 book-info">
                            <strong>Author:</strong> {book.author.join(", ")}
                        </p>

                        <p className="mb-3 book-info">
                            <strong>Category:</strong>{" "}
                            {book.category.map((cat) => (
                                <span className="cat" key={cat}>{cat}</span>
                            ))}
                        </p>

                        <span
                            className={`status-pill ${
                                book.status === "available" ? "status-available" : "status-borrowed"
                            }`}
                        >
                            {book.status}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}