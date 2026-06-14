import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/header/Header.jsx'
import Footer from '../../components/footer/Footer.jsx'
import { useRooms } from '../../stores/useRooms'
import RoomCardSkeleton from './components/RoomCardSkeleton'
import ReserveRoomModal from './components/ReserveRoomModal'
import Space from "../../components/Space";

import '../../styles/style.css'
import '../../styles/layout.css'

const statusBadge = (status) => {
    if (status === 'available') return 'bg-success'
    if (status === 'reserved') return 'bg-warning text-dark'
    if (status === 'occupied') return 'bg-danger'
    return 'bg-secondary'
}

export default function RoomsPage() {
    const { rooms, loading, error, reserve, searchStudents, refetch } = useRooms()
    const [activeRoom, setActiveRoom] = useState(null)
    const [notice, setNotice] = useState(null)
    const navigate = useNavigate()

    // Called when the modal closes. `ok` is true after a successful reservation.
    const onModalClose = (ok) => {
        setActiveRoom(null)
        if (ok) {
            setNotice('Reservation submitted — pending librarian approval.')
            refetch()
        }
    }

    return (
        <>
            <Header />

            <div className="container-fluid mt-4">
                <div className="container">

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 className="fw-bold mb-0">Reserve a Room</h3>
                        <button className="btn btn-outline-dark" onClick={() => navigate('/students/reservations')}>
                            My Reservations
                        </button>
                    </div>

                    {notice && <div className="alert alert-success">{notice}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}

                    {loading && <RoomCardSkeleton />}

                    {!loading && !error && rooms.length === 0 && (
                        <p className="text-muted">No rooms available at the moment.</p>
                    )}

                    {!loading && !error && rooms.length > 0 && (
                        <div className="row g-4">
                            {rooms.map((room) => (
                                <div className="col-md-4" key={room.id}>
                                    <div className="card h-100 shadow-sm">
                                        <div className="card-body d-flex flex-column gap-2">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h5 className="fw-bold mb-0">Room {room.number}</h5>
                                                <span className={`badge ${statusBadge(room.status)}`}>
                                                    {room.status}
                                                </span>
                                            </div>

                                            <p className="text-muted mb-0">
                                                <strong>Capacity:</strong> {room.capacity} persons
                                            </p>

                                            {room.status === 'available' ? (
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary mt-auto"
                                                    onClick={() => setActiveRoom(room)}
                                                >
                                                    Reserve
                                                </button>
                                            ) : (
                                                <button className="btn btn-secondary mt-auto" disabled>
                                                    Unavailable
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

            {activeRoom && (
                <ReserveRoomModal
                    room={activeRoom}
                    reserve={reserve}
                    searchStudents={searchStudents}
                    onClose={onModalClose}
                />
            )}
        </>
    )
}