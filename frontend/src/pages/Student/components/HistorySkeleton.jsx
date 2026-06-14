import '../../../styles/skeleton.css'
import RowCardSkeleton from './RowCardSkeleton'

// Mirrors the History layout: a section heading + rows, twice.
export default function HistorySkeleton() {
    return (
        <>
            <div className="skeleton" style={{ height: 22, width: 180, marginBottom: 16 }} />
            <div className="d-flex flex-column gap-3 mb-5">
                {Array.from({ length: 3 }).map((_, i) => <RowCardSkeleton key={i} />)}
            </div>

            <div className="skeleton" style={{ height: 22, width: 200, marginBottom: 16 }} />
            <div className="d-flex flex-column gap-3">
                {Array.from({ length: 2 }).map((_, i) => <RowCardSkeleton key={i} />)}
            </div>
        </>
    )
}