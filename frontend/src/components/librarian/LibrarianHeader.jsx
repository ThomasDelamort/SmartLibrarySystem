import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../stores/AuthContext'
import { useLibrarianNotifications } from '../../stores/useLibrarianNotifications'

import '../../styles/style.css'
import '../../styles/header.css'

const formatTime = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

// Shared chrome for all librarian pages. React-state dropdowns (no Bootstrap JS).
export default function LibrarianHeader() {
    const { user, logout } = useAuth()
    const { notifications, unreadCount, markRead, clearAll } = useLibrarianNotifications()
    const navigate = useNavigate()

    const [navOpen, setNavOpen] = useState(false)
    const [bellOpen, setBellOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    const closeNav = () => setNavOpen(false)

    return (
        <section className="container-fluid px-3">
            <header className="main-header d-flex flex-wrap align-items-center justify-content-between">

                <div className="d-flex align-items-center gap-4">
                    <nav className="navbar navbar-expand-md navbar-light p-0">
                        <button
                            className="navbar-toggler" type="button"
                            onClick={() => setNavOpen((o) => !o)}
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className={`collapse navbar-collapse ${navOpen ? 'show' : ''}`}>
                            <ul className="navbar-nav gap-1">

                                <li className="nav-item"><NavLink className="nav-link" to="/librarian/books" onClick={closeNav}>Books</NavLink></li>
                                <li className="nav-item"><NavLink className="nav-link" to="/librarian/students" onClick={closeNav}>Students</NavLink></li>
                                <li className="nav-item"><NavLink className="nav-link" to="/librarian/transactions" onClick={closeNav}>Transactions</NavLink></li>
                            </ul>
                        </div>
                    </nav>
                </div>

                <Link to="/librarian" className="navbar-brand" onClick={closeNav}>SmartLS</Link>

                <div className="d-flex align-items-center gap-3">

                    {/* Notification bell — hidden on mobile (moves into the profile menu there) */}
                    <div className="dropdown d-none d-md-block" style={{ position: 'relative' }}>
                        <button
                            className="btn" type="button"
                            style={{ position: 'relative' }}
                            onClick={() => { setBellOpen((o) => !o); setProfileOpen(false) }}
                        >
                            <ion-icon name="notifications-outline" style={{ fontSize: '1.5rem' }}></ion-icon>
                            {unreadCount > 0 && (
                                <span
                                    style={{
                                        position: 'absolute', top: 2, right: 2,
                                        background: '#dc3545', color: '#fff',
                                        borderRadius: 999, fontSize: '0.65rem', fontWeight: 600,
                                        minWidth: 16, height: 16, lineHeight: '16px',
                                        textAlign: 'center', padding: '0 4px',
                                    }}
                                >
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {bellOpen && (
                            <ul className="dropdown-menu dropdown-menu-end show" style={{ minWidth: 320, position: 'absolute', right: 0 }}>
                                <li className="px-3 py-2 d-flex justify-content-between align-items-center">
                                    <h6 className="fw-bold mb-0">Notifications</h6>
                                    {notifications.length > 0 && (
                                        <button className="btn btn-sm btn-outline-secondary" style={{ fontSize: '0.75rem' }} onClick={clearAll}>
                                            Clear All
                                        </button>
                                    )}
                                </li>

                                {notifications.length === 0 && (
                                    <li className="px-3 py-2 text-muted"><small>No new notifications.</small></li>
                                )}

                                {notifications.map((notif) => (
                                    <div key={notif.id}>
                                        <li className="d-flex align-items-start px-3 py-2 gap-2">
                                            <div className="flex-grow-1">
                                                <small>{notif.message}</small>
                                                <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                    {formatTime(notif.createdAt)}
                                                </div>
                                            </div>
                                            <button className="btn btn-sm p-0 text-muted" title="Dismiss" onClick={() => markRead(notif.id)}>
                                                <ion-icon name="close-outline"></ion-icon>
                                            </button>
                                        </li>
                                        <li><hr className="dropdown-divider m-0" /></li>
                                    </div>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Profile dropdown */}
                    <div className="dropdown" style={{ position: 'relative' }}>
                        <button
                            className="btn dropdown-toggle profile-btn" type="button"
                            onClick={() => { setProfileOpen((o) => !o); setBellOpen(false) }}
                        >
                            <small style={{ marginRight: 5 }}>{user?.lastName}</small>
                            <span style={{ position: 'relative', display: 'inline-block' }}>
                                <img className="profile-image" src={user?.profilePicture || '/images/user.png'} alt="user" />
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

                        {profileOpen && (
                            <ul className="dropdown-menu dropdown-menu-end show" style={{ position: 'absolute', right: 0 }}>
                                {/* Notifications — mobile only (desktop uses the bell) */}
                                <li className="d-md-none">
                                    <Link className="dropdown-item d-flex justify-content-between align-items-center" to="/librarian/notifications" onClick={() => setProfileOpen(false)}>
                                        <span>Notifications</span>
                                        {unreadCount > 0 && <span className="badge rounded-pill bg-danger">{unreadCount}</span>}
                                    </Link>
                                </li>
                                <li className="d-md-none"><hr className="dropdown-divider" /></li>

                                <li><Link className="dropdown-item" to="/librarian/profile" onClick={() => setProfileOpen(false)}>My Profile</Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><button className="dropdown-item text-danger" onClick={handleLogout}>Log Out</button></li>
                            </ul>
                        )}
                    </div>

                </div>
            </header>
        </section>
    )
}