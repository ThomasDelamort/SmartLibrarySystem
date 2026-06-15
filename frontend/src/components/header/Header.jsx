import NavCollapse from './components/NavCollapse.jsx'
import SearchBar from './components/SearchBar.jsx'
import Login from './components/Login.jsx'
import NotificationBell from './components/NotificationBell.jsx'
import '../../styles/header.css'

// Reusable site header (logged-out state). Styling matches the EJS header partial.
const Header = () => {
    return (
        <section className='container-fluid px-3'>
            <header className='main-header d-flex flex-wrap align-items-center justify-content-between gap-3'>
                <NavCollapse />
                <SearchBar />
                <div className="d-flex align-items-center gap-3">
                    <NotificationBell />
                    <Login />
                </div>
            </header>
        </section>
    )
}
export default Header