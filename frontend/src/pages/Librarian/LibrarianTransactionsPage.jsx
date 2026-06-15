import LibrarianHeader from '../../components/librarian/LibrarianHeader.jsx'
import { useLibrarianTransactions } from '../../stores/useLibrarianTransactions'

import '../../styles/layout.css'
import '../../styles/librarian.css'
import '../../styles/librarian.transactions.css'

const STUDENT_IMG = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'

const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

const studentName = (s) => (s ? `${s.firstName} ${s.lastName}` : 'Unknown Student')

export default function LibrarianTransactionsPage() {
    const {
        stats, bookTransactions, roomTransactions, loading, error, busyId,
        approveBook, rejectBook, confirmReturn, approveRoom, rejectRoom,
    } = useLibrarianTransactions()

    return (
        <>
            <LibrarianHeader />

            <div className="container-fluid mt-4">
                <div className="transactions-container">

                    <div className="transactions-header">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <h2 className="fw-bold mb-1">Transactions</h2>
                        </div>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    {/* Stats */}
                    <div className="row g-4 mb-4">
                        <div className="col-md-4">
                            <div className="stats-card">
                                <h6 className="stats-title">Borrowed Books</h6>
                                <h2 className="stats-value">{loading ? '—' : stats.borrowed}</h2>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="stats-card">
                                <h6 className="stats-title">Returned Today</h6>
                                <h2 className="stats-value">{loading ? '—' : stats.returnedToday}</h2>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="stats-card overdue-card">
                                <h6 className="stats-title">Overdue Books</h6>
                                <h2 className="stats-value">{loading ? '—' : stats.overdue}</h2>
                            </div>
                        </div>
                    </div>

                    {/* Book Transactions */}
                    <h5 className="fw-bold mb-3">Book Transactions</h5>
                    <div className="transactions-list mb-5">
                        <div className="d-flex flex-column gap-3">

                            {!loading && bookTransactions.length === 0 && (
                                <p className="text-muted">No pending book transactions.</p>
                            )}

                            {bookTransactions.map((txn) => {
                                const isReturn = txn.transactionType === 'return'
                                const busy = busyId === txn.id
                                return (
                                    <div className="transaction-item" key={txn.id}>
                                        <div className="row align-items-center">
                                            <div className="col-md-1 text-center">
                                                <img src={STUDENT_IMG} alt="student" className="transaction-image" />
                                            </div>
                                            <div className="col-md-5">
                                                <h5 className="transaction-name">{studentName(txn.student)}</h5>
                                                <p className="transaction-book">
                                                    {isReturn ? 'Requesting to return' : 'Requesting to borrow'}:{' '}
                                                    <strong>{txn.book.title}</strong>
                                                </p>
                                                <span className="transaction-date">Due: {formatDate(txn.dueDate)}</span>
                                            </div>
                                            <div className="col-md-3">
                                                <span className={isReturn ? 'status-returned' : 'status-borrowed'}>
                                                    {isReturn ? 'Return Request' : 'Borrow Request'}
                                                </span>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="transaction-actions d-flex flex-column gap-2">
                                                    {isReturn ? (
                                                        <button className="btn btn-outline-success w-100" disabled={busy}
                                                                onClick={() => confirmReturn(txn.id)}>
                                                            {busy ? '…' : 'Confirm Return'}
                                                        </button>
                                                    ) : (
                                                        <button className="btn btn-outline-success w-100" disabled={busy}
                                                                onClick={() => approveBook(txn.id)}>
                                                            {busy ? '…' : 'Approve'}
                                                        </button>
                                                    )}
                                                    <button className="btn btn-outline-danger w-100" disabled={busy}
                                                            onClick={() => rejectBook(txn.id)}>
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                        </div>
                    </div>

                    {/* Room Reservations */}
                    <h5 className="fw-bold mb-3">Room Reservations</h5>
                    <div className="transactions-list">
                        <div className="d-flex flex-column gap-3">

                            {!loading && roomTransactions.length === 0 && (
                                <p className="text-muted">No pending room reservations.</p>
                            )}

                            {roomTransactions.map((txn) => {
                                const busy = busyId === txn.id
                                return (
                                    <div className="transaction-item" key={txn.id}>
                                        <div className="row align-items-center">
                                            <div className="col-md-1 text-center">
                                                <img src={STUDENT_IMG} alt="student" className="transaction-image" />
                                            </div>
                                            <div className="col-md-5">
                                                <h5 className="transaction-name">{studentName(txn.reservee)}</h5>
                                                <p className="transaction-book">
                                                    Requesting to reserve: <strong>Room {txn.room.number}</strong>
                                                </p>
                                                <span className="transaction-date">
                                                    {formatDate(txn.reservationDate)} &nbsp;|&nbsp; {txn.startTime} - {txn.endTime}
                                                </span>
                                                {txn.purpose && (
                                                    <><br /><small className="text-muted">Purpose: {txn.purpose}</small></>
                                                )}
                                            </div>
                                            <div className="col-md-3">
                                                <span className="status-borrowed">Room Request</span>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="transaction-actions d-flex flex-column gap-2">
                                                    <button className="btn btn-outline-success w-100" disabled={busy}
                                                            onClick={() => approveRoom(txn.id)}>
                                                        {busy ? '…' : 'Approve'}
                                                    </button>
                                                    <button className="btn btn-outline-danger w-100" disabled={busy}
                                                            onClick={() => rejectRoom(txn.id)}>
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}