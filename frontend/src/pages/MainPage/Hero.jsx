import React from 'react'

const Hero = () => {
    return (
        <section>
            <div className="container col-xxl-6 px-4 py-5">
                <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
                    <div className="col-10 col-sm-8 col-lg-6 imagination">
                        <img
                            src="/images/herologo.png"
                            className="d-block mx-lg-auto img-fluid"
                            alt="Bootstrap Themes"
                            width="700"
                            height="500"
                            loading="lazy"
                        />
                    </div>
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
                </div>
            </div>
        </section>
    )
}
export default Hero
