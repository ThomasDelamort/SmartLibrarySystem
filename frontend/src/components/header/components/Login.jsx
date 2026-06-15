import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../stores/AuthContext'
import { useNotifications } from '../../../stores/NotificationContext'

const Login = () => {
    const { user, logout } = useAuth()
    const { unreadCount } = useNotifications()
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
                    <span style={{ position: 'relative', display: 'inline-block' }}>
                        <img
                            className="profile-image"
                            src={user.profilePicture || '/images/user.png'}
                            alt="user"
                        />
                        {/* Unread badge — pinned to the avatar's top-right, mobile only (bell is hidden there). */}
                        {unreadCount > 0 && (
                            <span
                                className="d-md-none"
                                style={{
                                    position: 'absolute', top: -4, right: -4,
                                    background: '#dc3545', color: '#fff',
                                    borderRadius: 999, fontSize: '0.7rem', fontWeight: 600,
                                    minWidth: 18, height: 18, lineHeight: '18px',
                                    textAlign: 'center', padding: '0 5px',
                                }}
                            >
                                {unreadCount}
                            </span>
                        )}
                    </span>
                </button>

                <ul
                    className={`dropdown-menu dropdown-menu-end ${open ? 'show' : ''}`}
                    style={{ position: 'absolute', right: 0, top: '100%' }}
                >
                    {/* Notifications — a dedicated page link, mobile only (desktop uses the bell). */}
                    <li className="d-md-none">
                        <Link className="dropdown-item d-flex justify-content-between align-items-center" to="/students/notifications" onClick={() => setOpen(false)}>
                            <span>Notifications</span>
                            {unreadCount > 0 && (
                                <span className="badge rounded-pill bg-danger">{unreadCount}</span>
                            )}
                        </Link>
                    </li>
                    <li className="d-md-none"><hr className="dropdown-divider" /></li>

                    {/* Menu links */}
                    <li><Link className="dropdown-item" to="/students/profile" onClick={() => setOpen(false)}>My Profile</Link></li>
                    <li><Link className="dropdown-item" to="/students/borrowed" onClick={() => setOpen(false)}>Borrowed Books</Link></li>
                    <li><Link className="dropdown-item" to="/students/liked" onClick={() => setOpen(false)}>Liked Books</Link></li>
                    <li><Link className="dropdown-item" to="/students/reservations" onClick={() => setOpen(false)}>My Reservations</Link></li>
                    <li><Link className="dropdown-item" to="/students/status" onClick={() => setOpen(false)}>Status</Link></li>
                    <li><Link className="dropdown-item" to="/students/history" onClick={() => setOpen(false)}>History</Link></li>
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