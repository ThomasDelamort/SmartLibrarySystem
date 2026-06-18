import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './stores/AuthContext'
import { NotificationProvider } from './stores/NotificationContext'
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
import LikedPage from './pages/Student/LikedPage'
import HistoryPage from './pages/Student/HistoryPage'
import StatusPage from './pages/Student/StatusPage'
import NotificationsPage from './pages/Student/NotificationsPage'
import LibrarianDashboardPage from './pages/Librarian/LibrarianDashboardPage'
import LibrarianTransactionsPage from './pages/Librarian/LibrarianTransactionsPage'
import LibrarianBooksPage from './pages/Librarian/LibrarianBooksPage'
import LibrarianNotificationsPage from './pages/Librarian/LibrarianNotificationsPage'
import LibrarianStudentsPage from './pages/Librarian/LibrarianStudentsPage'
import LibrarianProfilePage from './pages/Librarian/LibrarianProfilePage'
import AdminPage from './pages/Admin/AdminPage'
import './App.css'

function App() {
    return (
        <AuthProvider>
            <NotificationProvider>
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
                        <Route
                            path="/students/liked"
                            element={
                                <ProtectedRoute role="student">
                                    <LikedPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/students/history"
                            element={
                                <ProtectedRoute role="student">
                                    <HistoryPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/students/status"
                            element={
                                <ProtectedRoute role="student">
                                    <StatusPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/students/notifications"
                            element={
                                <ProtectedRoute role="student">
                                    <NotificationsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/librarian"
                            element={
                                <ProtectedRoute role="librarian">
                                    <LibrarianDashboardPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/librarian/transactions"
                            element={
                                <ProtectedRoute role="librarian">
                                    <LibrarianTransactionsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/librarian/books"
                            element={
                                <ProtectedRoute role="librarian">
                                    <LibrarianBooksPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/librarian/notifications"
                            element={
                                <ProtectedRoute role="librarian">
                                    <LibrarianNotificationsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/librarian/students"
                            element={
                                <ProtectedRoute role="librarian">
                                    <LibrarianStudentsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/librarian/profile"
                            element={
                                <ProtectedRoute role="librarian">
                                    <LibrarianProfilePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute role="admin">
                                    <AdminPage />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </BrowserRouter>
            </NotificationProvider>
        </AuthProvider>
    )
}

export default App