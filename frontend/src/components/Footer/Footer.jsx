import '../../styles/layout.css'

// Reusable site footer (matches the EJS footer). Styling comes from layout.css.
const Footer = () => {
    const year = new Date().getFullYear()

    return (
        <section className="card-footer">
            <footer>
                <ul className="social_icon col-md">
                    <li><a href="#"><ion-icon name="logo-facebook"></ion-icon></a></li>
                    <li><a href="#"><ion-icon name="logo-discord"></ion-icon></a></li>
                    <li><a href="#"><ion-icon name="logo-linkedin"></ion-icon></a></li>
                    <li><a href="#"><ion-icon name="logo-instagram"></ion-icon></a></li>
                    <li><a href="#"><ion-icon name="logo-github"></ion-icon></a></li>
                </ul>

                <ul className="menu">
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Services</a></li>
                    <li><a href="#">Team</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>

                <p className="copyright">© {year} SmartLibSys 📚</p>
            </footer>
        </section>
    )
}
export default Footer