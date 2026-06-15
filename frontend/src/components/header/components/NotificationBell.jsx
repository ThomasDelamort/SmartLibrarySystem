import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../../stores/AuthContext'
import { useNotifications } from '../../../stores/NotificationContext'

const formatTime = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

// Notification bell for the student header. Renders nothing for logged-out users.
const NotificationBell = () => {
    const { user } = useAuth()
    const { notifications, unreadCount, markRead, clearAll } = useNotifications()
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    // Close on outside click (no Bootstrap JS).
    useEffect(() => {
        const onClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', onClick)
        return () => document.removeEventListener('mousedown', onClick)
    }, [])

    if (!user) return null

    return (
        // Hidden on small screens — notifications move into the profile dropdown there.
        <div className="dropdown d-none d-md-block" ref={ref} style={{ position: 'relative' }}>
            <button className="btn" type="button" onClick={() => setOpen((o) => !o)} style={{ position: 'relative' }}>
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

            {open && (
                <ul className="dropdown-menu dropdown-menu-end show" style={{ minWidth: 320, position: 'absolute', right: 0 }}>
                    <li className="px-3 py-2 d-flex justify-content-between align-items-center">
                        <h6 className="fw-bold mb-0">Notifications</h6>
                        {notifications.length > 0 && (
                            <button className="btn btn-sm btn-outline-secondary" style={{ fontSize: '0.75rem' }} onClick={clearAll}>
                                Clear All
                            </button>
                        )}
                    </li>
                    <li><hr className="dropdown-divider m-0" /></li>

                    {notifications.length === 0 && (
                        <li className="px-3 py-3 text-muted text-center"><small>No new notifications</small></li>
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
    )
}

export default NotificationBell