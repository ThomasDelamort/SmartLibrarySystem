import React from 'react'
import BookImage from './BookImage'
import BookInfoStatus from "./BookInfoStatus";

const Hero = () => {
    return (
        <section>
            <div className="container col-xxl-6 px-4 py-5">
                <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
                    <BookImage />
                    <BookInfoStatus />
                </div>
            </div>
        </section>
    )
}
export default Hero
