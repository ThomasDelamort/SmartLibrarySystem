import NavCollapse from './components/NavCollapse'
import SearchBar from './components/SearchBar'
import Login from './components/Login'
import '../../styles/header.css'

// Reusable site header (logged-out state). Styling matches the EJS header partial.
const Header = () => {
    return (
        <section className='container-fluid px-3'>
            <header className='main-header d-flex flex-wrap align-items-center justify-content-between gap-3'>
                <NavCollapse />
                <SearchBar />
                <Login />
            </header>
        </section>
    )
}
export default Header