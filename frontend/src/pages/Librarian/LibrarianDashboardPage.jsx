import LibrarianHeader from '../../components/librarian/LibrarianHeader'
import LibrarianCalendar from '../../components/librarian/LibrarianCalendar'
import { useAuth } from '../../contexts/AuthContext.jsx'
import Space from "../../components/Space.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import '../../styles/layout.css'
import '../../styles/librarian.css'



export default function LibrarianDashboardPage() {
    const { user } = useAuth()

    return (
        <>
            <LibrarianHeader />
            <div className="container dashboard-container mt-4">
                <div className="welcome-card">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div>
                            <h1 className="fw-bold mb-2">Welcome, {user?.name}</h1>
                        </div>
                    </div>
                </div>

                <LibrarianCalendar />
            </div>
            <Space />
            <Footer />
        </>
    )
}