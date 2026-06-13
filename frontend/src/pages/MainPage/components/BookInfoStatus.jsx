
const BookInfoStatus = () => {
    return (
        <div className="col-lg-6"><h1
            className="display-5 fw-bold text-body-emphasis lh-1 mb-3">Welcome</h1>
            <p className="lead text-xl-start">Transform the way your library operates with a modern,
                intelligent system designed to manage books, track users, and streamline
                every transaction effortlessly.</p>
            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                <a type="button" id="borrowButton" className="btn btn-primary btn-lg px-3 me-md-2"
                   href="/Books">Borrow Now</a>
                <a type="button" id="manageButton" className="btn btn-outline-info btn-lg px-3 me-md-2"
                   href="/login">Manage</a>
            </div>
        </div>
    )
}
export default BookInfoStatus
