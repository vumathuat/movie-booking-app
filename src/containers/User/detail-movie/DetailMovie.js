import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
import * as cinemaActions from '../../../services/redux/actions/cinemaActions';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import GroupCinemaMoviesMobile from '../../../components/User/GroupCinemaMoviesMobile';
import CategoryGroupCinema from './../../../components/User/CategoryGroupCinema';
import GroupCinemaMovies from '../../../components/User/GroupCinemaMovies';
import Footer from './../home/Footer';
import Loader from '../../../components/User/Loader';

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
    const [detailMovie, setDetailMovie] = useState({});
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
                        title={detailMovie.biDanh}
                        src={detailMovie.trailer}
                        frameBorder='0'
                        allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                    ></iframe>
                </Modal.Body>
            </Modal>
        );
    }
    const starRate = () => {
        if (detailMovie.danhGia) {
            let rate = detailMovie.danhGia;
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
                } else
                    stars.push(
                        <i
                            key={index}
                            className='fa fa-star-o'
                            aria-hidden='true'
                        ></i>
                    );
                rate -= 2;
            }
            return stars;
        }
    };

    props.listGroupCinema.forEach((groupCinema) =>
        props.getGroupCinemaInfo(groupCinema.maHeThongRap)
    );

    useEffect(() => {
        let { getListGroupCinema } = props;
        const id = props.match.params.id;
        getListGroupCinema();
        Axios({
            method: 'GET',
            url: `http://movie0706.cybersoft.edu.vn/api/QuanLyPhim/LayThongTinPhim?MaPhim=${id}`,
        })
            .then((result) => {
                setDetailMovie(result.data);
                setIsLoading(true);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (isLoading) {
        return (
            <ThemeProvider theme={theme}>
                <VideoModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                />
                <div className='detail-movie__wrap'>
                    <div className='detail-movie__background'>
                        <img src={detailMovie.hinhAnh} alt='background-movie' />
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
                                {detailMovie.danhGia}
                            </span>
                            <div className='starRate'>{starRate()}</div>
                        </div>
                    </div>
                    <div className='detail-movie'>
                        <div className='row m-0'>
                            <div className='detail-movie__poster col-3 p-lg-0'>
                                <img
                                    className='img-fluid'
                                    src={detailMovie.hinhAnh}
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
                                        {detailMovie.ngayKhoiChieu.slice(0, 10)}
                                    </p>
                                    <p className='tenPhim'>
                                        <span className='age-type'>C13</span>
                                        {detailMovie.tenPhim}
                                    </p>
                                    <p>120 phút - 8.7 IMDb - 2D/Digital</p>
                                    <button className='book-ticket'>
                                        Mua vé
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
                                            value={detailMovie.danhGia}
                                            text={detailMovie.danhGia}
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
                                        <span>6 người đánh giá</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='detail-movie__bottom'>
                    <div className='detail-movie__info--mobile'>
                        <div>
                            <p>{detailMovie.ngayKhoiChieu}</p>
                            <p className='tenPhim'>
                                <span>C13 - </span>
                                {detailMovie.tenPhim}
                            </p>
                            <p>120 phút - 8.7 IMDb - 2D/Digital</p>
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
                                    Lịch Chiếu
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
                                    Thông Tin
                                </a>
                            </li>
                            <li className='nav-item'>
                                <a
                                    className='nav-link'
                                    id='rate-tab'
                                    data-toggle='tab'
                                    href='#rate'
                                    role='tab'
                                    aria-controls='rate'
                                    aria-selected='false'
                                >
                                    Đánh giá
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
                                    <CategoryGroupCinema labelWithName={true} />
                                    <GroupCinemaMovies
                                        history={props.history}
                                        detailMovie={detailMovie}
                                    />
                                </Paper>
                                <GroupCinemaMoviesMobile
                                    history={props.history}
                                    detailMovie={detailMovie}
                                />
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
                                                    Ngày phát hành
                                                </p>
                                            </div>
                                            <div className='col-7'>
                                                <p className='content'>
                                                    04.10.2019
                                                </p>
                                            </div>
                                        </div>
                                        <div className='row m-0'>
                                            <div className='col-5'>
                                                <p className='title'>
                                                    Đạo diễn
                                                </p>
                                            </div>
                                            <div className='col-7'>
                                                <p className='content'>
                                                    Todd Phillips
                                                </p>
                                            </div>
                                        </div>
                                        <div className='row m-0'>
                                            <div className='col-5'>
                                                <p className='title'>
                                                    Diễn viên
                                                </p>
                                            </div>
                                            <div className='col-7'>
                                                <p className='content'>
                                                    Zazie Beetz, Joaquin Phoenix
                                                </p>
                                            </div>
                                        </div>
                                        <div className='row m-0'>
                                            <div className='col-5'>
                                                <p className='title'>
                                                    Thể Loại
                                                </p>
                                            </div>
                                            <div className='col-7'>
                                                <p className='content'>
                                                    Hành động, Tội phạm
                                                </p>
                                            </div>
                                        </div>
                                        <div className='row m-0'>
                                            <div className='col-5'>
                                                <p className='title'>
                                                    Định dạng
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
                                                    Quốc Gia SX
                                                </p>
                                            </div>
                                            <div className='col-7'>
                                                <p className='content'>Mỹ</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-sm-6'>
                                        <p className='title'>Nội dung</p>
                                        <p className='content info-full'>
                                            {detailMovie.moTa}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div
                                className='tab-pane fade'
                                id='rate'
                                role='tabpanel'
                                aria-labelledby='rate-tab'
                            >
                                ...
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

const mapDispathToProp = (dispatch) => {
    return {
        getListGroupCinema: () => {
            dispatch(cinemaActions.getListGroupCinemaAPI());
        },
        getGroupCinemaInfo: (meHeThongRap) => {
            dispatch(cinemaActions.getGroupCinemaInfoAPI(meHeThongRap));
        },
    };
};
const mapStateToProps = (state) => {
    return {
        listGroupCinema: state.cinemaReducer.listGroupCinema,
    };
};
export default connect(mapStateToProps, mapDispathToProp)(DetailMovie);
