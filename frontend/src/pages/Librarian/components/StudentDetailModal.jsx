const DEFAULT_AVATAR = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'

// Read-only detail view for a student (opened from the list's "View" button).
export default function StudentDetailModal({ student, onClose }) {
    if (!student) return null

    const Row = ({ label, value }) => (
        <div className="d-flex justify-content-between py-2 border-bottom">
            <span className="text-muted">{label}</span>
            <span className="fw-semibold text-end">{value}</span>
        </div>
    )

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '1rem', zIndex: 1055,
            }}
        >
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded shadow" style={{ width: '100%', maxWidth: 440 }}>
                <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                    <h5 className="fw-bold mb-0">Student Details</h5>
                    <button type="button" className="btn-close" onClick={onClose} />
                </div>

                <div className="p-4">
                    <div className="text-center mb-3">
                        <img
                            src={student.profilePicture || DEFAULT_AVATAR}
                            alt="student"
                            style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '3px solid #dee2e6' }}
                        />
                        <h5 className="fw-bold mt-2 mb-0">{student.firstName} {student.lastName}</h5>
                        <span className={`badge mt-2 ${student.canBorrow ? 'bg-success' : 'bg-danger'}`}>
                            {student.canBorrow ? 'Can Borrow' : 'Borrowing Suspended'}
                        </span>
                    </div>

                    <Row label="Student ID" value={student.studentId} />
                    <Row label="Email" value={student.email} />
                    <Row label="Sex" value={student.sex || '—'} />
                    <Row label="Borrowed Books" value={student.borrowedCount} />
                    <Row label="Fines" value={`₱${student.fines}`} />
                </div>

                <div className="d-flex justify-content-end p-3 border-top">
                    <button type="button" className="btn btn-dark px-4" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    )
}