import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../../stores/AuthContext.jsx'

const NavCollapse = () => {
    const { user } = useAuth()
    const [open, setOpen] = useState(false)

    // Close the menu after navigating (mobile).
    const close = () => setOpen(false)

    return (
        <div className="d-flex align-items-center gap-4">
            <nav className="navbar navbar-expand-md navbar-light p-0">
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    aria-controls="navbarNav"
                    aria-expanded={open}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`collapse navbar-collapse ${open ? 'show' : ''}`} id="navbarNav">
                    <ul className="navbar-nav gap-1">
                        <Link to={user ? '/books' : '/'} className="navbar-brand text-decoration-none" onClick={close}>
                            📚 SmartLS
                        </Link>

                        {user ? (
                            <>
                                <li className="nav-item"><NavLink className="nav-link" to="/books" onClick={close}>Books</NavLink></li>
                                <li className="nav-item"><a className="nav-link" href="#" onClick={close}>Reserve Room</a></li>
                                <li className="nav-item"><a className="nav-link" href="#" onClick={close}>🎒 Bag</a></li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item"><a className="nav-link" href="#" onClick={close}>About</a></li>
                                <li className="nav-item"><a className="nav-link" href="#" onClick={close}>Services</a></li>
                                <li className="nav-item"><a className="nav-link" href="#" onClick={close}>Download</a></li>
                            </>
                        )}
                    </ul>
                </div>
            </nav>
        </div>
    )
}
export default NavCollapse