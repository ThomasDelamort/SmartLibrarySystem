import React from 'react'
import NavCollapse from './NavCollapse'
import SearchBar from "./SearchBar";

const Header = () => {
    return (
        <section className='container-fluid px-3'>
            <header className='d-flex justify-content-between align-items-center'>
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
