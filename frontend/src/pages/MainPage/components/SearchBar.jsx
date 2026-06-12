import React from 'react'

const SearchBar = () => {
    return (
        <form
            className="d-flex align-items-center gap-2"
            style={{ width: "400px"}}
            role="search"
            action="/Search"
            method="GET"
        >
            <button
                className="btn btn-outline-dark"
                type="submit"
            >
                🔍
            </button>
            <input
                className="form-control"
                type="search"
                name="q"
                id="searchbarSearch"
                placeholder="Search Books"
                aria-label="Search"
            />
        </form>
    )
}
export default SearchBar
