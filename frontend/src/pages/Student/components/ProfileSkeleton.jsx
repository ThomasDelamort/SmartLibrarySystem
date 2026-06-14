import '../../../styles/skeleton.css'

// Placeholder matching the profile layout: info card (avatar + name + stats),
// edit-profile card, and change-password card.
export default function ProfileSkeleton() {
    return (
        <>
            {/* Info card */}
            <div className="card border-0 shadow-sm p-4 mb-4">
                <div className="d-flex align-items-center gap-4 mb-4">
                    <div className="skeleton" style={{ width: 80, height: 80, borderRadius: '50%' }} />
                    <div style={{ flex: 1 }}>
                        <div className="skeleton" style={{ height: 22, width: '40%', marginBottom: 10 }} />
                        <div className="skeleton" style={{ height: 14, width: '25%', marginBottom: 10 }} />
                        <div className="skeleton" style={{ height: 22, width: 110, borderRadius: 999 }} />
                    </div>
                </div>
                <div className="row g-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div className="col-md-4" key={i}>
                            <div className="skeleton" style={{ height: 76, borderRadius: 12 }} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit profile card */}
            <div className="card border-0 shadow-sm p-4 mb-4">
                <div className="skeleton" style={{ height: 22, width: '30%', marginBottom: 16 }} />
                <div className="row g-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div className="col-md-6" key={i}>
                            <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 8 }} />
                            <div className="skeleton" style={{ height: 38, width: '100%', borderRadius: 8 }} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Change password card */}
            <div className="card border-0 shadow-sm p-4">
                <div className="skeleton" style={{ height: 22, width: '30%', marginBottom: 16 }} />
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} style={{ marginBottom: 12 }}>
                        <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 8 }} />
                        <div className="skeleton" style={{ height: 38, width: '100%', borderRadius: 8 }} />
                    </div>
                ))}
            </div>
        </>
    )
}