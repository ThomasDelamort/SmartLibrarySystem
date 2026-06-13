import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './pages/MainPage/MainPage'
import BooksPage from './pages/Books/BooksPage'
import BookDetailPage from './pages/Books/BookDetailPage'
import './App.css'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/books" element={<BooksPage />} />
                <Route path="/books/:title" element={<BookDetailPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App