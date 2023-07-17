import React from 'react';
import Slider from 'react-slick';
import HomeTool from '../../../components/User/MovieSelect';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import slide1 from '../../../assets/img/movie-1.jpg';
import slide2 from '../../../assets/img/movie-2.jpg';
import slide3 from '../../../assets/img/movie-3.jpg';
import slide4 from '../../../assets/img/movie-0.jpg';

function SampleNextArrow(props) {
    const { className, onClick } = props;
    return (
        <div className={className} onClick={onClick}>
            <ArrowForwardIosIcon style={{ fontSize: 45 }} />
        </div>
    );
}

function SamplePrevArrow(props) {
    const { className, onClick } = props;
    return (
        <div className={className} onClick={onClick}>
            <ArrowBackIosIcon style={{ fontSize: 45 }} />
        </div>
    );
}

export default function Carousel(props) {
    const settings = {
        arrows: true,
        dots: true,
        infinite: true,
        autoplay: true,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
    };
    return (
        <div className='pp-carousel'>
            <Slider {...settings}>
                <div>
                    <img src={slide1} alt='movie' />
                    <div className='backgroundLinear'></div>
                </div>
                <div>
                    <img src={slide2} alt='movie' />
                    <div className='backgroundLinear'></div>
                </div>
                <div>
                    <img src={slide3} alt='movie' />
                    <div className='backgroundLinear'></div>
                </div>
                <div>
                    <img src={slide4} alt='movie' />
                    <div className='backgroundLinear'></div>
                </div>
            </Slider>
            <HomeTool history={props.history} />
        </div>
    );
}
