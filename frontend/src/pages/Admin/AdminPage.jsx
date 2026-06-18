import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../stores/AuthContext'
import AdminDashboardSection from './AdminDashboardPage'
import AdminStudentsSection from './AdminStudentsPage'
import AdminLibrariansSection from './AdminLibrariansPage'
import '../../styles/admin.css'

const NAV = [
    { id: 'dashboard', label: 'Dashboard', icon: 'ti-layout-dashboard' },
    { id: 'students', label: 'Students', icon: 'ti-users' },
    { id: 'librarians', label: 'Librarians', icon: 'ti-user-check' },
    { id: 'books', label: 'Books', icon: 'ti-book' },
    { id: 'rooms', label: 'Rooms', icon: 'ti-building' },
    { id: 'transactions', label: 'Transactions', icon: 'ti-arrow-left-right' },
]

// Placeholder shown for sections not built yet (Books/Rooms/Transactions → Phase C/D).
const Placeholder = ({ label }) => (
    <div className="sec">
        <div className="sec-label">{label}</div>
        <div className="panel">
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Coming soon.</p>
        </div>
    </div>
)

// One tall scrollable admin page. The sidebar smooth-scrolls to each stacked
// section; an IntersectionObserver highlights the active nav + topbar title.
export default function AdminPage() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [active, setActive] = useState('dashboard')

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActive(entry.target.id)
                })
            },
            { threshold: 0.3 }
        )
        NAV.forEach((n) => {
            const el = document.getElementById(n.id)
            if (el) observer.observe(el)
        })
        return () => observer.disconnect()
    }, [])

    const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    const handleLogout = async () => { await logout(); navigate('/login') }
    const title = NAV.find((n) => n.id === active)?.label || 'Dashboard'

    return (
        <div className="admin-scope">
            <div className="shell">
                <div className="sidebar">
                    <div className="logo">
                        <div className="logo-icon"><i className="ti ti-shield" style={{ color: '#0f172a', fontSize: 15 }}></i></div>
                        SmartLS
                    </div>

                    <nav>
                        {NAV.map((n) => (
                            <a
                                key={n.id}
                                className={`nav-item ${active === n.id ? 'active' : ''}`}
                                onClick={() => scrollTo(n.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <i className={`ti ${n.icon}`}></i>{n.label}
                            </a>
                        ))}
                    </nav>

                    <div className="sidebar-bottom">
                        <div className="user-info">
                            <div className="uavatar"><i className="ti ti-user"></i></div>
                            <div>
                                <div className="user-name">{user?.name} {user?.lastName}</div>
                                <div className="user-role">Administrator</div>
                            </div>
                        </div>
                        <button className="logout-btn" onClick={handleLogout}><i className="ti ti-logout"></i> Logout</button>
                    </div>
                </div>

                <div className="main">
                    <div className="topbar">
                        <div className="page-title">{title}</div>
                        <div className="topbar-right">
                            <div className="bell-btn"><i className="ti ti-bell" style={{ fontSize: 16 }}></i></div>
                            <button className="gen-btn" onClick={() => window.open('/api/admin/report/monthly', '_blank')}>
                                <i className="ti ti-file-export"></i> Generate Report
                            </button>
                        </div>
                    </div>

                    <div className="content">
                        <section id="dashboard"><AdminDashboardSection /></section>
                        <section id="students"><AdminStudentsSection /></section>
                        <section id="librarians"><AdminLibrariansSection /></section>
                        <section id="books"><Placeholder label="Books" /></section>
                        <section id="rooms"><Placeholder label="Rooms" /></section>
                        <section id="transactions"><Placeholder label="Transactions" /></section>
                    </div>
                </div>
            </div>
        </div>
    )
}