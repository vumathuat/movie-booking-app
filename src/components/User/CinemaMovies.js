import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';

const ExpansionPanel = withStyles({
    root: {
        position: 'relative',
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '50%',
            width: 'calc(100% - 40px)',
            transform: 'translateX(-50%)',
            borderBottom: '1px solid rgba(238, 238, 238)',
        },
        '@media (max-width: 576px)': {
            '&::after': { top: 0, bottom: 'unset' },
        },
        // border: "1px solid rgba(0, 0, 0, .125)",
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(Accordion);

const ExpansionPanelSummary = withStyles({
    root: {
        padding: 20,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
        '@media (max-width: 576px)': {
            padding: '15px 30px',
        },
    },
    content: {
        margin: '0',
        '&$expanded': {
            margin: '0',
        },
    },
    expanded: {},
})(AccordionSummary);

const ExpansionPanelDetails = withStyles((theme) => ({
    root: {
        padding: '10px 20px',
    },
}))(AccordionDetails);

//Main
const CinemaMovies = (props) => {
    let today = '2023-01-01';
    //Return Time-end with Time-start
    const getTimeEnd = (timeStart) => {
        let d = new Date();
        d.setHours(timeStart.slice(0, 2), timeStart.slice(3), 0);
        d.setHours(d.getHours() + 2);
        let timeEnd = d.toLocaleTimeString('en-GB').slice(0, 5);
        return timeEnd;
    };

    //Render Showtimes of a Cinema
    const renderShowtimes = () => {
        const moviesCinemaToday = [];
        let cinema = null;

        if (props.groupCinemaShowtimes.length > 0) {
            cinema = props.groupCinemaShowtimes[0].lstCumRap.find(
                (cumRap) => cumRap.maCumRap === props.chosenCinema
            );
        }

        if (cinema) {
            cinema.danhSachPhim.forEach((movie) => {
                if (
                    movie.lstLichChieuTheoPhim.findIndex(
                        (movie) =>
                            movie.ngayChieuGioChieu.slice(0, 10) === today
                    ) > -1
                ) {
                    moviesCinemaToday.push(movie);
                }
            });
        }

        if (moviesCinemaToday.length > 0) {
            return moviesCinemaToday.map((movie, index) => {
                return (
                    <ExpansionPanel key={index}>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls='panel1d-content'
                            id='panel1d-header'
                        >
                            <div className='movie--small'>
                                <img
                                    className='movie__img'
                                    src={
                                        props.listMovie.find(
                                            (element) =>
                                                element.maPhim === movie.maPhim
                                        )
                                            ? props.listMovie.find(
                                                  (element) =>
                                                      element.maPhim ===
                                                      movie.maPhim
                                              ).hinhAnh
                                            : ''
                                    }
                                    alt='movie-img'
                                ></img>
                                <div className='movie__info'>
                                    <span className='movie__name'>
                                        {movie.tenPhim}
                                    </span>
                                    <span>120 minutes</span>
                                </div>
                            </div>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography>
                                {movie.lstLichChieuTheoPhim
                                    .filter(
                                        (showtime) =>
                                            showtime.ngayChieuGioChieu.slice(
                                                0,
                                                10
                                            ) === today
                                    )
                                    .map((showtime, index) => {
                                        return (
                                            <NavLink
                                                className='showtime'
                                                to={{
                                                    pathname:
                                                        localStorage.getItem(
                                                            'User'
                                                        )
                                                            ? `/checkout/${showtime.maLichChieu}`
                                                            : `/login`,
                                                    preRequire: `/checkout/${showtime.maLichChieu}`,
                                                    prePage:
                                                        props.history.location
                                                            .pathname,
                                                }}
                                                key={index}
                                            >
                                                <span className='start-time'>
                                                    {showtime.ngayChieuGioChieu.slice(
                                                        11,
                                                        16
                                                    )}
                                                </span>
                                                <span>
                                                    {` ~ ${getTimeEnd(
                                                        showtime.ngayChieuGioChieu.slice(
                                                            11,
                                                            16
                                                        )
                                                    )}`}
                                                </span>
                                            </NavLink>
                                        );
                                    })}
                            </Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                );
            });
        }
        return (
            <div className='no-showtime'>
                <span>There is no watch slot left.</span>
            </div>
        );
    };

    return (
        <div
            className='cinema-movies flex-grow-1'
            style={{ width: 'min-content' }}
        >
            {renderShowtimes()}
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        groupCinemaShowtimes: state.cinemaReducer.groupCinemaShowtimes,
        listMovie: state.movieReducer.listMovie,
        chosenGroupCinema: state.cinemaReducer.chosenGroupCinema,
        groupCinemaInfo: state.cinemaReducer.groupCinemaInfo,
    };
};
export default connect(mapStateToProps, null)(CinemaMovies);
