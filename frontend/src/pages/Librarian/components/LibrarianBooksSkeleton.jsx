import '../../../styles/Skeleton.css'


export default function LibrarianBooksSkeleton() {
    return (
        <div className="d-flex flex-column gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
                <div className="lbk-item" key={i}>
                    <div className="row align-items-center">
                        <div className="col-md-2 text-center">
                            <div className="skeleton" style={{ width: 90, height: 130, borderRadius: 12, margin: '0 auto' }} />
                        </div>
                        <div className="col-md-7">
                            <div className="skeleton" style={{ height: 24, width: '55%', marginBottom: 12 }} />
                            <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 10 }} />
                            <div className="skeleton" style={{ height: 24, width: 90, borderRadius: 999 }} />
                        </div>
                        <div className="col-md-3">
                            <div className="d-flex flex-column gap-2">
                                <div className="skeleton" style={{ height: 38, width: '100%', borderRadius: 12 }} />
                                <div className="skeleton" style={{ height: 38, width: '100%', borderRadius: 12 }} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}