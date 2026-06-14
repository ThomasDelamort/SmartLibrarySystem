import { Link } from 'react-router-dom'
import Header from '../../components/header/Header.jsx'
import Footer from '../../components/footer/Footer.jsx'
import { useReservations } from '../../stores/useReservations'
import RowCardSkeleton from './components/RowCardSkeleton'
import Space from "../../components/Space";

import '../../styles/style.css'
import '../../styles/layout.css'

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '')

const statusBadge = (status) => {
    if (status === 'approved') return 'bg-success'
    if (status === 'pending') return 'bg-warning text-dark'
    if (status === 'rejected') return 'bg-danger'
    return 'bg-secondary'
}

const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

export default function ReservationsPage() {
    const { reservations, loading, error, cancel } = useReservations()

    const onCancel = async (id) => {
        try {
            await cancel(id)
        } catch {
            // Refetch on failure to resync state.
        }
    }

    return (
        <>
            <Header />

            <div className="container-fluid mt-4">
                <div className="container">

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold mb-0">My Reservations</h2>
                        <span className="badge bg-dark fs-6">{reservations.length} Active</span>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    {loading && (
                        <div className="d-flex flex-column gap-3">
                            {Array.from({ length: 3 }).map((_, i) => <RowCardSkeleton key={i} />)}
                        </div>
                    )}

                    {!loading && !error && reservations.length === 0 && (
                        <div className="text-center mt-5">
                            <p className="text-muted fs-5">You have no active reservations.</p>
                            <Link to="/students/rooms" className="btn btn-outline-dark mt-2">Reserve a Room</Link>
                        </div>
                    )}

                    {!loading && reservations.length > 0 && (
                        <div className="d-flex flex-column gap-3">
                            {reservations.map((res) => (
                                <div className="card border-0 shadow-sm p-3" key={res.id}>
                                    <div className="row align-items-center">
                                        <div className="col-md-1 text-center">
                                            <ion-icon name="business-outline" style={{ fontSize: '2.5rem', color: '#6c757d' }}></ion-icon>
                                        </div>

                                        <div className="col-md-6">
                                            <h5 className="fw-bold mb-1">Room {res.room?.number ?? '—'}</h5>
                                            <p className="text-muted mb-1">{formatDate(res.reservationDate)}</p>
                                            <small className="text-muted">
                                                Time: <strong>{res.startTime} - {res.endTime}</strong>
                                            </small>
                                            {res.purpose && (
                                                <><br /><small className="text-muted">Purpose: {res.purpose}</small></>
                                            )}
                                        </div>

                                        <div className="col-md-2">
                                            <span className={`badge ${statusBadge(res.status)} fs-6`}>
                                                {cap(res.status)}
                                            </span>
                                        </div>

                                        <div className="col-md-3">
                                            {(res.status === 'pending' || res.status === 'approved') ? (
                                                <button className="btn btn-outline-danger w-100" onClick={() => onCancel(res.id)}>
                                                    Cancel
                                                </button>
                                            ) : (
                                                <button className="btn btn-secondary w-100" disabled>
                                                    {cap(res.status)}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>
            <Space />
            <Footer />
        </>
    )
}