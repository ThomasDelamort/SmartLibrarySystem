import React from 'react'
import NavCollapse from './NavCollapse'
import SearchBar from "./SearchBar";
import '../../../../public/styles/header.css'

const Header = () => {
    return (
        <section className='container-fluid px-3'>
            <header className='main-header d-flex flex-wrap align-items-center justify-content-between gap-3'>
                <NavCollapse/>
                <SearchBar/>
                <div>
                    <a href="/Login" className="btn btn-outline-dark login-btn">Log-in</a>
                </div>
            </header>
        </section>
    )
}
export default Header
