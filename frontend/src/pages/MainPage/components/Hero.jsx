import React from 'react'
import HeroLogo from './HeroLogo.jsx'
import HeroHeading from "./HeroHeading.jsx";

const Hero = () => {
    return (
        <section>
            <div className="container col-xxl-6 px-4 py-5">
                <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
                    <HeroLogo />
                    <HeroHeading />
                </div>
            </div>
        </section>
    )
}
export default Hero
