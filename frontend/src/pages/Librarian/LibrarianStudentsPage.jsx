import { useState } from 'react'
import LibrarianHeader from '../../components/librarian/LibrarianHeader.jsx'
import { useLibrarianStudents } from '../../stores/useLibrarianStudents'
import LibrarianStudentsSkeleton from './components/LibrarianStudentsSkeleton'
import StudentDetailModal from './components/StudentDetailModal'

import '../../styles/layout.css'
import '../../styles/librarian.css'
import '../../styles/librarian.studentsList.css'

const DEFAULT_AVATAR = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'

export default function LibrarianStudentsPage() {
    const { students, pagination, loading, error, page, setPage, query, search } = useLibrarianStudents()
    const [term, setTerm] = useState(query)
    const [viewing, setViewing] = useState(null)

    const onSearch = (e) => {
        e.preventDefault()
        search(term.trim())
    }

    return (
        <>
            <LibrarianHeader />

            <div className="container-fluid mt-4">
                <div className="container lst-container">

                    <div className="lst-header">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <h2 className="fw-bold mb-0">Students List</h2>
                            <span className="text-muted">{pagination.totalStudents} total</span>
                        </div>

                        <form className="mt-3" onSubmit={onSearch}>
                            <div className="input-group">
                                <input
                                    type="text" className="form-control"
                                    placeholder="Search by name, email, or ID…"
                                    value={term}
                                    onChange={(e) => setTerm(e.target.value)}
                                />
                                <button className="btn btn-outline-dark" type="submit">Search</button>
                            </div>
                        </form>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="lst-list">
                        {loading && <LibrarianStudentsSkeleton />}

                        {!loading && !error && students.length === 0 && (
                            <p className="text-muted mb-0">No students found.</p>
                        )}

                        {!loading && (
                            <div className="d-flex flex-column gap-3">
                                {students.map((student) => (
                                    <div className="lst-item" key={student.id}>
                                        <div className="row align-items-center">
                                            <div className="col-md-2 text-center">
                                                <img
                                                    src={student.profilePicture || DEFAULT_AVATAR}
                                                    alt="student"
                                                    className="lst-image"
                                                />
                                            </div>
                                            <div className="col-md-7">
                                                <div className="lst-name">
                                                    <h5>{student.firstName} {student.lastName}</h5>
                                                </div>
                                                <p className="lst-email">{student.email}</p>
                                                <span className="lst-id">ID: {student.studentId}</span>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="lst-actions d-flex flex-column gap-2">
                                                    <button className="btn btn-outline-dark" onClick={() => setViewing(student)}>View</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && pagination.totalPages > 1 && (
                            <div className="d-flex justify-content-center mt-5">
                                <nav>
                                    <ul className="pagination">
                                        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
                                        </li>
                                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((n) => (
                                            <li className={`page-item ${page === n ? 'active' : ''}`} key={n}>
                                                <button className="page-link" onClick={() => setPage(n)}>{n}</button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${page === pagination.totalPages ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => setPage(page + 1)} disabled={page === pagination.totalPages}>Next</button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {viewing && <StudentDetailModal student={viewing} onClose={() => setViewing(null)} />}
        </>
    )
}