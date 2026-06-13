import React from 'react'
import NavCollapse from './components/NavCollapse.jsx'
import SearchBar from "./components/SearchBar.jsx";
import Login from "./components/Login.jsx";


const Header = () => {
    return (
        <section className='container-fluid px-3'>
            <header className='main-header d-flex flex-wrap align-items-center justify-content-between gap-3'>
                <NavCollapse/>
                <SearchBar/>
                <Login />
            </header>
        </section>
    )
}
export default Header
