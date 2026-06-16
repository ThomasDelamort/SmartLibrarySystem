import '../../../styles/Skeleton.css'

const TxnRows = ({ count }) => (
    <div className="d-flex flex-column gap-3">
        {Array.from({ length: count }).map((_, i) => (
            <div className="transaction-item" key={i}>
                <div className="row align-items-center">
                    <div className="col-md-1 text-center">
                        <div className="skeleton" style={{ width: 50, height: 50, borderRadius: '50%', margin: '0 auto' }} />
                    </div>
                    <div className="col-md-5">
                        <div className="skeleton" style={{ height: 20, width: '50%', marginBottom: 10 }} />
                        <div className="skeleton" style={{ height: 14, width: '70%', marginBottom: 8 }} />
                        <div className="skeleton" style={{ height: 12, width: '40%' }} />
                    </div>
                    <div className="col-md-3">
                        <div className="skeleton" style={{ height: 26, width: 110, borderRadius: 999 }} />
                    </div>
                    <div className="col-md-3">
                        <div className="d-flex flex-column gap-2">
                            <div className="skeleton" style={{ height: 36, width: '100%', borderRadius: 8 }} />
                            <div className="skeleton" style={{ height: 36, width: '100%', borderRadius: 8 }} />
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
)

// Matches LibrarianTransactionsPage: stat cards + the two pending lists.
export default function LibrarianTransactionsSkeleton() {
    return (
        <>
            <div className="row g-4 mb-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div className="col-md-4" key={i}>
                        <div className="stats-card">
                            <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 14 }} />
                            <div className="skeleton" style={{ height: 34, width: 60 }} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="skeleton" style={{ height: 22, width: 180, marginBottom: 16 }} />
            <div className="mb-5"><TxnRows count={3} /></div>

            <div className="skeleton" style={{ height: 22, width: 200, marginBottom: 16 }} />
            <TxnRows count={2} />
        </>
    )
}