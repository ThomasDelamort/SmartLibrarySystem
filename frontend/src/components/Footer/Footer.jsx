import '../../styles/layout.css'
import Menu from "./components/Menu";
import Socials from "./components/Socials";


const Footer = () => {
    const year = new Date().getFullYear()

    return (
        <section className="card-footer">
            <footer>

                <Socials />

                <Menu />

                <p className="copyright">© {year} SmartLS 📚</p>

            </footer>
        </section>
    )
}
export default Footer