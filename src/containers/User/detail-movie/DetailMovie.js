import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import Footer from './../home/Footer';
import Loader from '../../../components/User/Loader';
import GroupCinemaMovies from '../../../components/User/GroupCinemaMovies';
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import 'react-circular-progressbar/dist/styles.css';
import { Modal } from 'react-bootstrap';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: 440,
        overflow: 'hidden',
    },
}));

const theme = createTheme({
    palette: {
        primary: {
            main: '#ff7539',
        },
        secondary: {
            main: '#fb4226',
        },
    },
    overrides: {
        PrivateTabScrollButton: {
            vertical: {
                // color: "#fb4226",
                position: 'relative',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    width: 'calc(100% - 40px)',
                    transform: 'translateX(-50%)',
                    borderBottom: '1px solid rgba(238, 238, 238, 0.88)',
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -1,
                    left: '50%',
                    width: 'calc(100% - 40px)',
                    transform: 'translateX(-50%)',
                    borderTop: '1px solid rgba(238, 238, 238, 0.88)',
                },
            },
        },
    },
});

function DetailMovie(props) {
    const classes = useStyles();
    const [modalShow, setModalShow] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [detailMovie, setDetailMovie] = useState([]);
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            const id = props.match.params.id;
            try {
                const response = await Axios.get(`http://localhost:5000/films?id=${id}`);
                setDetailMovie(response.data[0]);
                setIsLoading(true);
                const result = await Axios.get(`http://localhost:5000/schedule?id=${id}`);
                setSchedule(result.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchMovieDetails();
    }, [props.match.params.id]);

    function VideoModal(props) {
        return (
            <Modal
                size='lg'
                {...props}
                aria-labelledby='video-modal'
                centered
                className='video-modal text-center'
            >
                <Modal.Body>
                    <iframe
                        title={detailMovie.title}
                        src={detailMovie.trailer}
                        allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                    ></iframe>
                </Modal.Body>
            </Modal>
        );
    }

    const starRate = () => {
        if (detailMovie.rating) {
            let rate = detailMovie.rating;
            let stars = [];
            for (let index = 0; index < 10; index += 2) {
                if (rate >= 2) {
                    stars.push(
                        <i
                            key={index}
                            className='fa fa-star'
                            aria-hidden='true'
                        />
                    );
                } else if (rate >= 1) {
                    stars.push(
                        <i
                            key={index}
                            className='fa fa-star-half-o'
                            aria-hidden='true'
                        />
                    );
                }
                rate -= 2;
            }
            return stars;
        }
    };
    if (isLoading) {
        return (
            <ThemeProvider theme={theme}>
                <VideoModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                />
                <div className='detail-movie__wrap'>
                    <div className='detail-movie__background'>
                        <img src={detailMovie.poster} alt='background-movie' />
                        <div className='detail-movie__gradient'>
                            <div className='movie__play'>
                                <i
                                    onClick={() => setModalShow(true)}
                                    className='fa fa-play'
                                    aria-hidden='true'
                                />
                            </div>
                        </div>
                        <div className='detail-movie__rate--small'>
                            <span className='avgPoint'>
                                {detailMovie.rating}
                            </span>
                            <div className='starRate'>{starRate()}</div>
                        </div>
                    </div>
                    <div className='detail-movie'>
                        <div className='row m-0'>
                            <div className='detail-movie__poster col-3 p-lg-0'>
                                <img
                                    className='img-fluid'
                                    src={detailMovie.poster}
                                    alt=''
                                />
                                <div className='movie__play'>
                                    <i
                                        onClick={() => setModalShow(true)}
                                        className='fa fa-play'
                                        aria-hidden='true'
                                    />
                                </div>
                            </div>
                            <div className='detail-movie__info col-6'>
                                <div>
                                    <p>
                                        {detailMovie.release_date}
                                    </p>
                                    <p className='tenPhim'>
                                        <span className='age-type'>C13</span>
                                        {detailMovie.title}
                                    </p>
                                    <p>{detailMovie.duration} minutes - {detailMovie.rating} IMDb - 2D/Digital</p>
                                    <button className='book-ticket'>
                                        Book Ticket
                                    </button>
                                </div>
                            </div>
                            <div className='detail-movie__rate col-3 '>
                                <div>
                                    <div
                                        className='movieRateCircle'
                                        style={{
                                            maxWidth: '128px',
                                            margin: 'auto',
                                        }}
                                    >
                                        <CircularProgressbar
                                            background={true}
                                            value={detailMovie.rating}
                                            text={detailMovie.rating}
                                            maxValue={10}
                                            strokeWidth={6}
                                            styles={buildStyles({
                                                strokeLinecap: 'butt',
                                                textColor: 'white',
                                                pathColor: '#7ed321',
                                                trailColor: '#3a3a3a',
                                                textSize: '40px',
                                                backgroundColor:
                                                    'rgba(0,0,0,.4)',
                                            })}
                                        />
                                    </div>
                                    <div className='starRate'>{starRate()}</div>
                                    <div className='numberOfReviews'>
                                        <span>356 people has rated this films</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='detail-movie__bottom'>
                    <div className='detail-movie__info--mobile'>
                        <div>
                            <p>{detailMovie.release_date}</p>
                            <p className='tenPhim'>
                                <span>C13 - </span>
                                {detailMovie.title}
                            </p>
                            <p>{detailMovie.duration} minutes - {detailMovie.rating} IMDb - 2D/Digital</p>
                        </div>
                    </div>
                    <div className='detail-movie__bottom--translate'>
                        <ul
                            className='nav nav-tabs justify-content-center align-items-center pb-md-4'
                            id='myTab'
                            role='tablist'
                        >
                            <li className='nav-item'>
                                <a
                                    className='nav-link active'
                                    id='showtimes-tab'
                                    data-toggle='tab'
                                    href='#showtime'
                                    role='tab'
                                    aria-controls='showtime'
                                    aria-selected='true'
                                >
                                    Schedule
                                </a>
                            </li>
                            <li className='nav-item'>
                                <a
                                    className='nav-link'
                                    id='info-tab'
                                    data-toggle='tab'
                                    href='#info'
                                    role='tab'
                                    aria-controls='info'
                                    aria-selected='false'
                                >
                                   Information
                                </a>
                            </li>
                        </ul>
                        <div className='tab-content' id='myTabContent'>
                            <div
                                className='tab-pane fade show active p-3 p-lg-0'
                                id='showtime'
                                role='tabpanel'
                                aria-labelledby='showtimes-tab'
                            >
                                <Paper
                                    className={`MuiTab d-none d-md-flex ${classes.root}`}
                                >
                                    <GroupCinemaMovies
                                        history={props.history}
                                        detailMovie={detailMovie}
                                        schedule={schedule}
                                    />
                                </Paper>
                            </div>
                            <div
                                className='tab-pane fade'
                                id='info'
                                role='tabpanel'
                                aria-labelledby='info-tab'
                            >
                                <div className='row m-0'>
                                    <div className='col-sm-6 p-0'>
                                        <div className='row m-0'>
                                            <div className='col-5'>
                                                <p className='title'>
                                                    Release date
                                                </p>
                                            </div>
                                            <div className='col-7'>
                                                <p className='content'>
                                                    {detailMovie.release_date}
                                                </p>
                                            </div>
                                        </div>
                                        <div className='row m-0'>
                                            <div className='col-5'>
                                                <p className='title'>
                                                    Director
                                                </p>
                                            </div>
                                            <div className='col-7'>
                                                <p className='content'>
                                                    {detailMovie.director}
                                                </p>
                                            </div>
                                        </div>
                                        <div className='row m-0'>
                                            <div className='col-5'>
                                                <p className='title'>
                                                    Cast
                                                </p>
                                            </div>
                                            <div className='col-7'>
                                                <p className='content'>
                                                    {detailMovie.cast}
                                                </p>
                                            </div>
                                        </div>
                                        <div className='row m-0'>
                                            <div className='col-5'>
                                                <p className='title'>
                                                    Genre
                                                </p>
                                            </div>
                                            <div className='col-7'>
                                                <p className='content'>
                                                    {detailMovie.genre}
                                                </p>
                                            </div>
                                        </div>
                                        <div className='row m-0'>
                                            <div className='col-5'>
                                                <p className='title'>
                                                    Format
                                                </p>
                                            </div>
                                            <div className='col-7'>
                                                <p className='content'>
                                                    2D/Digital
                                                </p>
                                            </div>
                                        </div>
                                        <div className='row m-0'>
                                            <div className='col-5'>
                                                <p className='title'>
                                                    Subtitle
                                                </p>
                                            </div>
                                            <div className='col-7'>
                                                <p className='content'>{detailMovie.language}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-sm-6'>
                                        <p className='title'>Description</p>
                                        <p className='content info-full'>
                                            {detailMovie.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </ThemeProvider>
        );
    }
    return <Loader />;
}
  
export default DetailMovie;