import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const SearchBar = () => {
    const [searchParams] = useSearchParams()
    const [query, setQuery] = useState(searchParams.get('q') || '')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        const q = query.trim()
        // Client-side navigation to the Books page; BooksPage reads ?q from the URL.
        navigate(q ? `/books?q=${encodeURIComponent(q)}` : '/books')
    }

    return (
        <form
            className="search-form d-flex align-items-center"
            role="search"
            onSubmit={handleSubmit}
        >
            <button className="search-btn" type="submit">🔍</button>
            <input
                className="form-control search-input"
                type="search"
                name="q"
                id="searchbarSearch"
                placeholder="Search Books"
                aria-label="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </form>
    )
}
export default SearchBar