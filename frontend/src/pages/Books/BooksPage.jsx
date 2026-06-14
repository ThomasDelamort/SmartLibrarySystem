import Header from '../../components/header/Header.jsx'
import Footer from '../../components/footer/Footer.jsx'
import BooksContent from './components/BooksContent'
import Space from '../../components/Space.jsx'
import '../../styles/transition.css'

export default function BooksPage() {
    return (
        <>
            <Header />
            <BooksContent />
                <Space />
            <Footer />
        </>
    )
}