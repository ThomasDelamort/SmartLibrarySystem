import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../stores/AuthContext'
import '../../styles/admin.css'

const NAV = [
    { to: '/admin', label: 'Dashboard', icon: 'ti-layout-dashboard', end: true },
    { to: '/admin/students', label: 'Students', icon: 'ti-users' },
    { to: '/admin/librarians', label: 'Librarians', icon: 'ti-user-check' },
    { to: '/admin/books', label: 'Books', icon: 'ti-book' },
    { to: '/admin/rooms', label: 'Rooms', icon: 'ti-building' },
    { to: '/admin/transactions', label: 'Transactions', icon: 'ti-arrow-left-right' },
]

// Sidebar + topbar shell for all admin pages. Wrapped in .admin-scope so the
// ported admin theme can't leak onto the rest of the app.
export default function AdminLayout() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const { pathname } = useLocation()

    const active = NAV.find((n) => (n.end ? pathname === n.to : pathname.startsWith(n.to)))
    const title = active ? active.label : 'Dashboard'

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

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
                            <NavLink
                                key={n.to} to={n.to} end={n.end}
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            >
                                <i className={`ti ${n.icon}`}></i>{n.label}
                            </NavLink>
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
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}