import { Link } from 'react-router-dom'

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
                    <ul className="navbar-nav gap-1">
                        <Link to="/" className="navbar-brand text-decoration-none">SmartLS</Link>
                        <li className="nav-item"><a className="nav-link" href="#">About</a></li>
                        <li className="nav-item"><a className="nav-link" href="#">Services</a></li>
                        <li className="nav-item"><a className="nav-link" href="#">Download</a></li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}
export default NavCollapse