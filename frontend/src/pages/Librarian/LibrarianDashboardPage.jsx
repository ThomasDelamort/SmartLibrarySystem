import LibrarianHeader from '../../components/librarian/LibrarianHeader.jsx'
import LibrarianCalendar from '../../components/librarian/LibrarianCalendar.jsx'
import { useAuth } from '../../stores/AuthContext'

import '../../styles/layout.css'
import '../../styles/librarian.css'

export default function LibrarianDashboardPage() {
    const { user } = useAuth()

    return (
        <>
            <LibrarianHeader />

            <div className="container dashboard-container">
                <div className="welcome-card">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div>
                            <h1 className="fw-bold mb-2">Welcome, {user?.name}</h1>
                        </div>
                    </div>
                </div>

                <LibrarianCalendar />
            </div>
        </>
    )
}