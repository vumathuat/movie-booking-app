import React from 'react';
import Slider from 'react-slick';
import mobile from '../../../assets/img/mobile.png';
import slide1 from '../../../assets/img/IMG_3714.PNG';
import slide2 from '../../../assets/img/IMG_3715.PNG';
import slide3 from '../../../assets/img/IMG_3716.PNG';
import slide4 from '../../../assets/img/IMG_3717.PNG';
import slide5 from '../../../assets/img/IMG_3718.PNG';
import slide6 from '../../../assets/img/IMG_3719.PNG';
import slide7 from '../../../assets/img/IMG_3720.PNG';
import slide8 from '../../../assets/img/IMG_3721.PNG';
import slide9 from '../../../assets/img/IMG_3722.PNG';
import slide10 from '../../../assets/img/IMG_3723.PNG';


export default function App() {
    const settings = {
        dots: false,
        arrows: false,
        infinite: true,
        speed: 300,
        autoplay: true,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div className='wrap-app app'>
            <div className='container' style={{ maxWidth: '1000px' }}>
                <div className='row align-items-center'>
                    <div className='app__left col-md-6 text-center text-md-left'>
                        <p className='text-1'>
                            Outstanding application for movie geeks.
                        </p>
                        <p className='text-2'>
                            Immerse yourself in a world of blockbuster films, captivating stories, and thrilling adventures right at your fingertips. With our user-friendly app, you can easily browse the latest movie releases, check showtimes, and book tickets in just a few taps.
                        </p>
                        <button className=''>
                            DOWNLOAD FREE ON APPSTORE & GOOGLE PLAY
                        </button>
                    </div>
                    <div className='app__right col-md-6'>
                        <img className='mobile-img' src={mobile} alt='mobile' />
                        <div className='slider-screen'>
                            <Slider className='h-100 w-100' {...settings}>
                                <div>
                                    <img
                                        className='img-fluid'
                                        src={slide1}
                                        alt='screen-img'
                                    />
                                </div>
                                <div>
                                    <img
                                        className='img-fluid'
                                        src={slide2}
                                        alt='screen-img'
                                    />
                                </div>
                                <div>
                                    <img
                                        className='img-fluid'
                                        src={slide3}
                                        alt='screen-img'
                                    />
                                </div>
                                <div>
                                    <img
                                        className='img-fluid'
                                        src={slide4}
                                        alt='screen-img'
                                    />
                                </div>
                                <div>
                                    <img
                                        className='img-fluid'
                                        src={slide5}
                                        alt='screen-img'
                                    />
                                </div>
                                <div>
                                    <img
                                        className='img-fluid'
                                        src={slide6}
                                        alt='screen-img'
                                    />
                                </div>
                                <div>
                                    <img
                                        className='img-fluid'
                                        src={slide7}
                                        alt='screen-img'
                                    />
                                </div>
                                <div>
                                    <img
                                        className='img-fluid'
                                        src={slide8}
                                        alt='screen-img'
                                    />
                                </div>
                                <div>
                                    <img
                                        className='img-fluid'
                                        src={slide9}
                                        alt='screen-img'
                                    />
                                </div>
                                <div>
                                    <img
                                        className='img-fluid'
                                        src={slide10}
                                        alt='screen-img'
                                    />
                                </div>
                            </Slider>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
