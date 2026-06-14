import '../../../styles/skeleton.css'

// Placeholder grid matching the room cards (3 across).
export default function RoomCardSkeleton() {
    return (
        <div className="row g-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <div className="col-md-4" key={i}>
                    <div className="card h-100 shadow-sm">
                        <div className="card-body d-flex flex-column gap-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="skeleton" style={{ height: 22, width: 110 }} />
                                <div className="skeleton" style={{ height: 22, width: 70, borderRadius: 999 }} />
                            </div>
                            <div className="skeleton" style={{ height: 14, width: '60%' }} />
                            <div className="skeleton" style={{ height: 38, width: '100%', borderRadius: 8, marginTop: 'auto' }} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}