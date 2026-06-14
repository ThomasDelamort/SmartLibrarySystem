import '../../../styles/skeleton.css'

// Placeholder grid matching the liked-book cards (cover + text, 3 across).
export default function LikedCardSkeleton() {
    return (
        <div className="row g-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <div className="col-md-4" key={i}>
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="d-flex h-100">
                            <div className="skeleton" style={{ width: 100, height: 150, borderRadius: 8, flexShrink: 0 }} />
                            <div className="card-body d-flex flex-column py-3 gap-2">
                                <div className="skeleton" style={{ height: 18, width: '80%' }} />
                                <div className="skeleton" style={{ height: 12, width: '60%' }} />
                                <div className="skeleton" style={{ height: 12, width: '45%' }} />
                                <div className="skeleton" style={{ height: 24, width: 80, borderRadius: 999, marginTop: 'auto' }} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}