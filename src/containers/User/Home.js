import React, { useRef, useEffect } from 'react';
import Carousel from './home/Carousel';
import ListMovie from './home/ListMovie';
import Cinema from './home/Cinema';
import App from './home/App';
import Footer from './home/Footer';
import Loader from '../../components/User/Loader';

const scrollToRef = (ref) =>
    window.scrollTo({ top: ref.current.offsetTop - 60, behavior: 'smooth' });

export default function Home(props) {
    const listMovie = useRef(null);
    const groupCinema = useRef(null);
    const app = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        setTimeout(() => {
            if (document.getElementById('loader')) {
                document.getElementById('loader').style.opacity = '0';
                document.getElementById('loader').style.zIndex = '-999';
            }
            switch (props.scroll) {
                case 'listMovie':
                    scrollToRef(listMovie);
                    break;
                case 'groupCinema':
                    scrollToRef(groupCinema);
                    break;
                case 'app':
                    scrollToRef(app);
                    break;
                default:
                    break;
            }
        }, 500);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <Carousel history={props.history}></Carousel>
            <div ref={listMovie} className='container'>
                <ListMovie></ListMovie>
            </div>
            <div ref={groupCinema}>
                <Cinema history={props.history}></Cinema>
            </div>
            <div ref={app}>
                <App></App>
            </div>
            <Footer />
            <Loader />
        </>
    );
}
