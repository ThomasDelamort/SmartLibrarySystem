import LibrarianHeader from '../../components/librarian/LibrarianHeader.jsx'
import { useLibrarianNotifications } from '../../stores/useLibrarianNotifications'

import '../../styles/layout.css'
import '../../styles/librarian.css'

const formatTime = (d) =>
    new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

export default function LibrarianNotificationsPage() {
    const { notifications, markRead, clearAll } = useLibrarianNotifications()

    return (
        <>
            <LibrarianHeader />

            <div className="container-fluid mt-4">
                <div className="container" style={{ maxWidth: 700 }}>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold mb-0">Notifications</h2>
                        {notifications.length > 0 && (
                            <button className="btn btn-outline-secondary btn-sm" onClick={clearAll}>Clear All</button>
                        )}
                    </div>

                    {notifications.length === 0 ? (
                        <div className="text-center mt-5">
                            <p className="text-muted fs-5">No new notifications.</p>
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-2">
                            {notifications.map((notif) => (
                                <div className="card border-0 shadow-sm p-3" key={notif.id}>
                                    <div className="d-flex justify-content-between align-items-start gap-3">
                                        <div>
                                            <p className="mb-1">{notif.message}</p>
                                            <small className="text-muted">{formatTime(notif.createdAt)}</small>
                                        </div>
                                        <button className="btn btn-sm btn-outline-secondary" title="Dismiss" onClick={() => markRead(notif.id)}>
                                            <ion-icon name="close-outline"></ion-icon>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </>
    )
}