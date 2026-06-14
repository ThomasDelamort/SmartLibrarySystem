import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './stores/AuthContext'
import MainPage from './pages/MainPage/MainPage'
import BooksPage from './pages/Books/BooksPage'
import BookDetailPage from './pages/Books/BookDetailPage'
import LoginPage from './pages/Login/LoginPage'
import './App.css'

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/books" element={<BooksPage />} />
                    <Route path="/books/:title" element={<BookDetailPage />} />
                    <Route path="/login" element={<LoginPage />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App