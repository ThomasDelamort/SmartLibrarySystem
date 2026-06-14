import '../../styles/layout.css'
import Menu from "./Menu.jsx";
import Socials from "./Socials.jsx";
import Copyright from "./Copyright.jsx";


const Footer = () => {
    const year = new Date().getFullYear()

    return (
        <section className="card-footer">
            <footer>

                <Socials />

                <Menu />

                <Copyright
                    year={year}
                />

            </footer>
        </section>
    )
}
export default Footer