import React from 'react'
import '../../../styles/layout.css'

const Footer = () => {
    return (
        <>
            <div className="space"></div>
            <footer>

                <div className="waves">
                    <div className="wave" id="wave1"></div>
                    <div className="wave" id="wave2"></div>
                    <div className="wave" id="wave3"></div>
                    <div className="wave" id="wave4"></div>
                </div>
                <div className="space"></div>
                <ul className="social_icon col-md">
                    <li><a href="https://web.facebook.com/ThomasDeLaMort/">
                        <ion-icon name="logo-facebook"></ion-icon>
                    </a></li>
                    <li><a href="#">
                        <ion-icon name="logo-discord"></ion-icon>
                    </a></li>
                    <li><a href="#">
                        <ion-icon name="logo-linkedin"></ion-icon>
                    </a></li>
                    <li><a href="https://www.instagram.com/__neallll__/?hl=en">
                        <ion-icon name="logo-instagram"></ion-icon>
                    </a></li>
                    <li><a href="https://github.com/ThomasDelamort">
                        <ion-icon name="logo-github"></ion-icon>
                    </a></li>
                </ul>

                <ul className="menu">
                    <li><a href="/frontend/public">Home</a></li>
                    <li><a href="/About">About</a></li>
                    <li><a href="/Contact">Services</a></li>
                    <li><a href="/Team">Team</a></li>
                    <li><a href="/Contact">Contact</a></li>
                </ul>
                <p className="copyright"> © {new Date().getFullYear()} SmartLS </p>
            </footer>
        </>
    )
}
export default Footer
