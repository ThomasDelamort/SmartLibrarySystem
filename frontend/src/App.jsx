import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './stores/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import MainPage from './pages/MainPage/MainPage'
import BooksPage from './pages/Books/BooksPage'
import BookDetailPage from './pages/Books/BookDetailPage'
import LoginPage from './pages/Login/LoginPage'
import BagPage from './pages/Student/BagPage'
import BorrowedPage from './pages/Student/BorrowedPage'
import ProfilePage from './pages/Student/ProfilePage'
import RoomsPage from './pages/Student/RoomsPage'
import ReservationsPage from './pages/Student/ReservationsPage'
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
                    <Route
                        path="/students/bag"
                        element={
                            <ProtectedRoute role="student">
                                <BagPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/students/borrowed"
                        element={
                            <ProtectedRoute role="student">
                                <BorrowedPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/students/profile"
                        element={
                            <ProtectedRoute role="student">
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/students/rooms"
                        element={
                            <ProtectedRoute role="student">
                                <RoomsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/students/reservations"
                        element={
                            <ProtectedRoute role="student">
                                <ReservationsPage />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App