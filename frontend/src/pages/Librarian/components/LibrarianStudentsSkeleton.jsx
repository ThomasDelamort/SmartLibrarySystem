import '../../../styles/Skeleton.css'

// Matches the LibrarianStudentsPage row layout (avatar / name+email+id / actions).
export default function LibrarianStudentsSkeleton() {
    return (
        <div className="d-flex flex-column gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <div className="lst-item" key={i}>
                    <div className="row align-items-center">
                        <div className="col-md-2 text-center">
                            <div className="skeleton" style={{ width: 70, height: 70, borderRadius: '50%', margin: '0 auto' }} />
                        </div>
                        <div className="col-md-7">
                            <div className="skeleton" style={{ height: 22, width: '45%', marginBottom: 10 }} />
                            <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 10 }} />
                            <div className="skeleton" style={{ height: 24, width: 120, borderRadius: 999 }} />
                        </div>
                        <div className="col-md-3">
                            <div className="skeleton" style={{ height: 38, width: '100%', borderRadius: 12 }} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}