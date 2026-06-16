import '../../../styles/Skeleton.css'

// Placeholder for the profile page while it loads.
export default function LibrarianProfileSkeleton() {
    return (
        <div className="row g-4">
            <div className="col-md-4">
                <div className="card border-0 shadow-sm p-4 text-center">
                    <div className="skeleton" style={{ width: 120, height: 120, borderRadius: '50%', margin: '0 auto 16px' }} />
                    <div className="skeleton" style={{ height: 20, width: '60%', margin: '0 auto 10px' }} />
                    <div className="skeleton" style={{ height: 14, width: '80%', margin: '0 auto' }} />
                </div>
            </div>
            <div className="col-md-8">
                <div className="card border-0 shadow-sm p-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="mb-3">
                            <div className="skeleton" style={{ height: 12, width: 100, marginBottom: 8 }} />
                            <div className="skeleton" style={{ height: 38, width: '100%', borderRadius: 8 }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}