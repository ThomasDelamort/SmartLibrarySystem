import Header from '../../components/header/Header.jsx'
import Footer from '../../components/footer/Footer.jsx'
import { useStatus } from '../../stores/useStatus'
import StatusSkeleton from './components/StatusSkeleton'
import Space from "../../components/Space";
import '../../styles/style.css'
import '../../styles/layout.css'


const authorText = (a) => (Array.isArray(a) ? a.join(', ') : a || '')
const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

export default function StatusPage() {
    const { fines, overdueBooks, loading, error } = useStatus()

    return (
        <>
            <Header />

            <div className="container-fluid mt-4">
                <div className="container">

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold mb-0">My Status</h2>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    {loading && <StatusSkeleton />}

                    {!loading && !error && (
                        <>
                            {/* Fines card */}
                            <div className="card border-0 shadow-sm p-4 mb-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="fw-bold mb-1">Unpaid Fines</h5>
                                        <p className="text-muted mb-0">Fines accumulate at $4 per day for overdue books.</p>
                                    </div>
                                    <h2 className={`fw-bold mb-0 ${fines > 0 ? 'text-danger' : 'text-success'}`}>
                                        ${fines}
                                    </h2>
                                </div>
                            </div>

                            <h5 className="fw-bold mb-3">Overdue Books</h5>

                            {overdueBooks.length === 0 ? (
                                <div className="text-center mt-3 mb-5">
                                    <p className="text-muted fs-5">No overdue books. You're all good!</p>
                                </div>
                            ) : (
                                <div className="d-flex flex-column gap-3">
                                    {overdueBooks.map((txn) => (
                                        <div className="card border-0 shadow-sm p-3" key={txn.id}>
                                            <div className="row align-items-center">
                                                <div className="col-md-1 text-center">
                                                    <img
                                                        src={txn.book.image} alt={txn.book.title}
                                                        className="img-fluid rounded"
                                                        style={{ maxHeight: 120, objectFit: 'cover' }}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <h5 className="fw-bold mb-1">{txn.book.title}</h5>
                                                    <p className="text-muted mb-1">{authorText(txn.book.author)}</p>
                                                    <small className="text-muted">
                                                        Due: <strong>{formatDate(txn.dueDate)}</strong>
                                                    </small>
                                                </div>
                                                <div className="col-md-2">
                                                    <span className="badge bg-danger fs-6">Overdue</span>
                                                </div>
                                                <div className="col-md-3">
                                                    <p className="text-danger fw-bold mb-0">Fine: ${txn.fineAmount}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                </div>
            </div>
            <Space />
            <Footer />
        </>
    )
}