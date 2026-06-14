import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../stores/AuthContext'

const Login = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    // Close the dropdown when clicking outside (no Bootstrap JS needed).
    useEffect(() => {
        const onClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', onClick)
        return () => document.removeEventListener('mousedown', onClick)
    }, [])

    const handleLogout = async () => {
        await logout()
        navigate('/')
    }

    if (!user) {
        return (
            <div>
                <Link to="/login" className="btn btn-outline-dark login-btn">Log-in</Link>
            </div>
        )
    }

    return (
        <div className="d-flex align-items-center gap-3">
            <div className="dropdown profile" ref={ref} style={{ position: 'relative' }}>
                <button
                    className="btn dropdown-toggle profile-btn"
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    aria-expanded={open}
                >
                    <small className="user-name">{user.name}</small>
                    <img
                        className="profile-image"
                        src={user.profilePicture || '/images/user.png'}
                        alt="user"
                    />
                </button>

                <ul
                    className={`dropdown-menu dropdown-menu-end ${open ? 'show' : ''}`}
                    style={{ position: 'absolute', right: 0, top: '100%' }}
                >
                    {/* Links wired as each student page is built. */}
                    <li><Link className="dropdown-item" to="/students/profile" onClick={() => setOpen(false)}>My Profile</Link></li>
                    <li><Link className="dropdown-item" to="/students/borrowed" onClick={() => setOpen(false)}>Borrowed Books</Link></li>
                    <li><Link className="dropdown-item" to="/students/liked" onClick={() => setOpen(false)}>Liked Books</Link></li>
                    <li><Link className="dropdown-item" to="/students/reservations" onClick={() => setOpen(false)}>My Reservations</Link></li>
                    <li><a className="dropdown-item" href="#">Status</a></li>
                    <li><a className="dropdown-item" href="#">History</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                        <button className="dropdown-item text-danger" onClick={handleLogout}>
                            Log Out
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    )
}
export default Login