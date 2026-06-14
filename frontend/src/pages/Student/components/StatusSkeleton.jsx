import '../../../styles/skeleton.css'
import RowCardSkeleton from './RowCardSkeleton'

// Mirrors the Status layout: fines card + "Overdue Books" heading + rows.
export default function StatusSkeleton() {
    return (
        <>
            <div className="card border-0 shadow-sm p-4 mb-4">
                <div className="d-flex justify-content-between align-items-center">
                    <div style={{ flex: 1 }}>
                        <div className="skeleton" style={{ height: 20, width: 160, marginBottom: 10 }} />
                        <div className="skeleton" style={{ height: 14, width: 280 }} />
                    </div>
                    <div className="skeleton" style={{ height: 36, width: 90 }} />
                </div>
            </div>

            <div className="skeleton" style={{ height: 22, width: 160, marginBottom: 16 }} />
            <div className="d-flex flex-column gap-3">
                {Array.from({ length: 2 }).map((_, i) => <RowCardSkeleton key={i} />)}
            </div>
        </>
    )
}