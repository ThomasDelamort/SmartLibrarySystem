import '../../../styles/skeleton.css'

// Placeholder row matching the Bag/Borrowed card layout
// (cover + title/author/meta + status badge + action button).
export default function RowCardSkeleton() {
    return (
        <div className="card border-0 shadow-sm p-3">
            <div className="row align-items-center">
                <div className="col-md-1 text-center">
                    <div className="skeleton" style={{ width: 80, height: 110, borderRadius: 8, margin: '0 auto' }} />
                </div>
                <div className="col-md-6">
                    <div className="skeleton" style={{ height: 20, width: '60%', marginBottom: 10 }} />
                    <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 10 }} />
                    <div className="skeleton" style={{ height: 12, width: '50%' }} />
                </div>
                <div className="col-md-2">
                    <div className="skeleton" style={{ height: 28, width: 80, borderRadius: 999 }} />
                </div>
                <div className="col-md-3">
                    <div className="skeleton" style={{ height: 38, width: '100%', borderRadius: 8 }} />
                </div>
            </div>
        </div>
    )
}