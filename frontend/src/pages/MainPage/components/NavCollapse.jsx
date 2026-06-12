import React from 'react'

const NavCollapse = () => {
    return (
        <div className="d-flex align-items-center gap-4">
            <nav className="navbar navbar-expand-md navbar-light p-0">
                <button className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <div className='d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start'>
                        <a href="/" className="navbar-brand text-decoration-none ">📚 SmartLS</a>
                    </div>
                    <ul className="navbar-nav gap-1">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/">Books</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/">About</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/">Download</a>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}
export default NavCollapse
