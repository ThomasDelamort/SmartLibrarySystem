import Header from '../../components/header/Header.jsx'
import Footer from '../../components/footer/Footer.jsx'
import BooksContent from './components/BooksContent'
import '../../styles/transition.css'

export default function BooksPage() {
    return (
        <>
            <Header />
            <BooksContent />
            <Footer />
        </>
    )
}