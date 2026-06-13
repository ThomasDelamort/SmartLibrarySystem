// Placeholder card shown while books load. Mirrors the real book-card layout
// (left image block + stacked text lines + status pill) so the grid doesn't jump.
export default function BookCardSkeleton() {
    return (
        <div className="col-md-4">
            <div className="card h-100 book-card book-card-skeleton">
                <div className="d-flex h-100">
                    <div className="skeleton skeleton-img" />
                    <div className="card-body d-flex flex-column py-3">
                        <div className="skeleton skeleton-title" />
                        <div className="skeleton skeleton-line" style={{ width: '90%' }} />
                        <div className="skeleton skeleton-line" style={{ width: '70%' }} />
                        <div className="skeleton skeleton-pill" />
                    </div>
                </div>
            </div>
        </div>
    )
}