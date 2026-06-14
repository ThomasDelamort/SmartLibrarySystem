import Header from '../../components/header/Header.jsx'
import Footer from '../../components/footer/Footer.jsx'
import { useHistory } from '../../stores/useHistory'
import HistorySkeleton from './components/HistorySkeleton'
import Space from "../../components/Space";
import '../../styles/style.css'
import '../../styles/layout.css'


const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '')
const authorText = (a) => (Array.isArray(a) ? a.join(', ') : a || '')
const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

const bookBadge = (status) => {
    if (status === 'returned') return 'bg-success'
    if (status === 'cancelled') return 'bg-secondary'
    return 'bg-danger'
}
const roomBadge = (status) => {
    if (status === 'completed') return 'bg-success'
    if (status === 'cancelled') return 'bg-secondary'
    return 'bg-danger'
}

export default function HistoryPage() {
    const { bookHistory, roomHistory, loading, error } = useHistory()
    const total = bookHistory.length + roomHistory.length

    return (
        <>
            <Header />

            <div className="container-fluid mt-4">
                <div className="container">

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold mb-0">My History</h2>
                        <span className="badge bg-dark fs-6">{total} Total</span>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    {loading && <HistorySkeleton />}

                    {!loading && !error && (
                        <>
                            <h5 className="fw-bold mb-3">Book Transactions</h5>

                            {bookHistory.length === 0 && (
                                <p className="text-muted mb-4">No book transaction history.</p>
                            )}

                            <div className="d-flex flex-column gap-3 mb-5">
                                {bookHistory.map((txn) => (
                                    <div className="card border-0 shadow-sm p-3" key={txn.id}>
                                        <div className="row align-items-center">
                                            <div className="col-md-1 text-center">
                                                <img
                                                    src={txn.book.image} alt={txn.book.title}
                                                    className="img-fluid rounded"
                                                    style={{ maxHeight: 80, objectFit: 'cover' }}
                                                />
                                            </div>
                                            <div className="col-md-7">
                                                <h5 className="fw-bold mb-1">{txn.book.title}</h5>
                                                <p className="text-muted mb-1">{authorText(txn.book.author)}</p>
                                                <small className="text-muted">
                                                    {txn.transactionType === 'return' ? 'Returned' : 'Borrowed'}:{' '}
                                                    <strong>{formatDate(txn.createdAt)}</strong>
                                                </small>
                                                {txn.fineAmount > 0 && (
                                                    <><br /><small className="text-danger">Fine: ${txn.fineAmount}</small></>
                                                )}
                                            </div>
                                            <div className="col-md-4 text-end">
                                                <span className={`badge ${bookBadge(txn.status)} fs-6`}>
                                                    {cap(txn.status)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <h5 className="fw-bold mb-3">Room Reservations</h5>

                            {roomHistory.length === 0 && (
                                <p className="text-muted mb-4">No room reservation history.</p>
                            )}

                            <div className="d-flex flex-column gap-3">
                                {roomHistory.map((res) => (
                                    <div className="card border-0 shadow-sm p-3" key={res.id}>
                                        <div className="row align-items-center">
                                            <div className="col-md-1 text-center">
                                                <ion-icon name="business-outline" style={{ fontSize: '2.5rem', color: '#6c757d' }}></ion-icon>
                                            </div>
                                            <div className="col-md-7">
                                                <h5 className="fw-bold mb-1">Room {res.room.number}</h5>
                                                <p className="text-muted mb-1">{formatDate(res.reservationDate)}</p>
                                                <small className="text-muted">
                                                    Time: <strong>{res.startTime} - {res.endTime}</strong>
                                                </small>
                                                {res.purpose && (
                                                    <><br /><small className="text-muted">Purpose: {res.purpose}</small></>
                                                )}
                                            </div>
                                            <div className="col-md-4 text-end">
                                                <span className={`badge ${roomBadge(res.status)} fs-6`}>
                                                    {cap(res.status)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                </div>
            </div>
            <Space />
            <Footer />
        </>
    )
}