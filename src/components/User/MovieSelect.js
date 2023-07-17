import React, { useState } from 'react';
import { connect } from 'react-redux';
import * as action from '../../services/redux/actions/movieSelectAction';
import { NavLink } from 'react-router-dom';
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

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
        MuiListItem: {
            button: {
                '&:hover': {
                    backgroundColor: '#FFECB3',
                },
            },
            root: {
                '&$selected': {
                    backgroundColor: '#FF6F00',
                    color: '#fff',
                    '&:hover': {
                        backgroundColor: '#FF6F00',
                        color: '#fff',
                    },
                },
            },
        },
        MuiMenuItem: {
            root: {
                fontSize: 15,
            },
        },
    },
});

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
    },
    paper: {
        display: 'flex',
        alignItems: 'center',
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        '@media (max-width: 576px)': {
            flexDirection: 'column',
        },
    },
    movie: {
        margin: theme.spacing(1),
        minWidth: 250,
        maxWidth: 250,
        '@media (max-width: 576px)': {
            minWidth: 'unset',
            maxWidth: 'unset',
            width: '100%',
        },
    },
    cinema: {
        margin: theme.spacing(1),
        minWidth: 150,
        maxWidth: 150,
        '@media (max-width: 576px)': {
            minWidth: 'unset',
            maxWidth: 'unset',
            width: '100%',
        },
    },
    date: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 120,
        '@media (max-width: 576px)': {
            minWidth: 'unset',
            maxWidth: 'unset',
            width: '100%',
        },
    },
    showtime: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 120,
        '@media (max-width: 576px)': {
            minWidth: 'unset',
            maxWidth: 'unset',
            width: '100%',
        },
    },
}));

const MenuProps = {
    MovieProps: {
        PaperProps: {
            style: {
                maxHeight: 400,
                width: 500,
            },
        },
    },
    CinemaProps: {
        PaperProps: {
            style: {
                maxHeight: 300,
                width: 400,
            },
        },
    },
    DateProps: {
        PaperProps: {
            style: {
                maxHeight: 300,
                width: 200,
            },
        },
    },
    ShowtimeProps: {
        PaperProps: {
            style: {
                maxHeight: 300,
                width: 150,
            },
        },
    },
};

function MovieSelect(props) {
    const classes = useStyles();

    const [quickTicket, setQuickTicket] = useState({
        movieSelect: '',
        cinemaSelect: '',
        dateSelect: '',
        showtimeSelect: '',
        dates: [],
        showtimes: [],
        done: false,
        maLichChieu: '',
    });

    //Multi Select Change
    const handleChange = (event) => {
        let { name, value } = event.target;
        let { id } = event.nativeEvent.target;
        let dates = quickTicket.dates;
        let showtimes = quickTicket.showtimes;
        switch (name) {
            case 'movieSelect':
                props.getShowtimeInfo(id);
                setQuickTicket({
                    ...quickTicket,
                    [name]: value,
                    cinemaSelect: '',
                    dateSelect: '',
                    showtimeSelect: '',
                    dates: [],
                    showtimes: [],
                });
                break;
            case 'cinemaSelect':
                props.showtimeInfo.heThongRapChieu.forEach((groupCinema) => {
                    groupCinema.cumRapChieu.forEach((cinema) => {
                        if (cinema.tenCumRap === value) {
                            dates = [
                                ...new Set(
                                    cinema.lichChieuPhim.map((showtime) =>
                                        showtime.ngayChieuGioChieu.slice(0, 10)
                                    )
                                ),
                            ];
                        }
                    });
                });
                setQuickTicket({
                    ...quickTicket,
                    [name]: value,
                    dates,
                    dateSelect: '',
                    showtimeSelect: '',
                    showtimes: [],
                });

                break;
            case 'dateSelect':
                props.showtimeInfo.heThongRapChieu.forEach((groupCinema) => {
                    groupCinema.cumRapChieu.forEach((cinema) => {
                        if (cinema.tenCumRap === quickTicket.cinemaSelect) {
                            showtimes = cinema.lichChieuPhim.filter(
                                (showtime) =>
                                    showtime.ngayChieuGioChieu.slice(0, 10) ===
                                    value
                            );
                        }
                    });
                });
                setQuickTicket({
                    ...quickTicket,
                    [name]: value,
                    showtimes,
                    showtimeSelect: '',
                });

                break;
            case 'showtimeSelect':
                setQuickTicket({
                    ...quickTicket,
                    [name]: value,
                    showtimes,
                });
                break;
            default:
                break;
        }
        setQuickTicket((preTicket) => {
            let maLichChieu =
                preTicket.showtimeSelect.length > 0
                    ? preTicket.showtimes.find(
                          (showtime) =>
                              showtime.ngayChieuGioChieu.slice(11) ===
                              preTicket.showtimeSelect
                      ).maLichChieu
                    : '';
            if (maLichChieu.length > 0) {
                return {
                    ...preTicket,
                    done: true,
                    maLichChieu,
                };
            }
            return {
                ...preTicket,
                done: false,
                maLichChieu: '',
            };
        });
    };

    //Main return
    return (
        <ThemeProvider theme={theme}>
            <div className='home-tool'>
                <Paper elevation={3} className={classes.paper}>
                    <FormControl className={classes.movie}>
                        <InputLabel id='movie-select-label'>Movie</InputLabel>
                        <Select
                            disableUnderline
                            labelId='movie-select-label'
                            id='movie-select'
                            value={quickTicket.movieSelect}
                            onChange={handleChange}
                            input={<Input name='movieSelect' />}
                            MenuProps={MenuProps.MovieProps}
                        >
                            {props.listMovie.map((movie, index) => (
                                <MenuItem
                                    key={index}
                                    id={movie.maPhim}
                                    value={movie.tenPhim}
                                >
                                    {movie.tenPhim}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl className={classes.cinema}>
                        <InputLabel id='cinema-select-label'>Cinema</InputLabel>
                        {props.cinemas.length > 0 ? (
                            <Select
                                disableUnderline
                                labelId='cinema-select-label'
                                id='cinema-select'
                                value={quickTicket.cinemaSelect}
                                onChange={handleChange}
                                input={<Input name='cinemaSelect' />}
                                MenuProps={MenuProps.CinemaProps}
                            >
                                {props.cinemas.map((name) => (
                                    <MenuItem key={name} value={name}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </Select>
                        ) : (
                            <Select
                                disableUnderline
                                labelId='cinema-select-label'
                                id='cinema-select'
                                value=''
                            >
                                <MenuItem value='Please choose a movie.'>
                                    Please choose a movie.
                                </MenuItem>
                            </Select>
                        )}
                    </FormControl>
                    <FormControl className={classes.date}>
                        <InputLabel id='date-select-label'>Watch date</InputLabel>
                        {quickTicket.dates.length > 0 ? (
                            <Select
                                disableUnderline
                                labelId='date-select-label'
                                id='date-select'
                                value={quickTicket.dateSelect}
                                onChange={handleChange}
                                input={<Input name='dateSelect' />}
                                MenuProps={MenuProps.DateProps}
                            >
                                {quickTicket.dates.map((name) => (
                                    <MenuItem key={name} value={name}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </Select>
                        ) : (
                            <Select
                                disableUnderline
                                labelId='date-select-label'
                                id='date-select'
                                value=''
                            >
                                <MenuItem value='Please pick your movie and cinema.'>
                                    Please pick your movie and cinema.
                                </MenuItem>
                            
                            </Select>
                        )}
                    </FormControl>
                    <FormControl className={classes.showtime}>
                        <InputLabel id='showtime-select-label'>
                            Watch slot
                        </InputLabel>
                        {quickTicket.showtimes.length > 0 ? (
                            <Select
                                disableUnderline
                                labelId='showtime-select-label'
                                id='showtime-select'
                                value={quickTicket.showtimeSelect}
                                onChange={handleChange}
                                input={<Input name='showtimeSelect' />}
                                MenuProps={MenuProps.ShowtimeProps}
                            >
                                {quickTicket.showtimes.map((name) => (
                                    <MenuItem
                                        key={name.ngayChieuGioChieu.slice(11)}
                                        value={name.ngayChieuGioChieu.slice(11)}
                                    >
                                        {name.ngayChieuGioChieu.slice(11)}
                                    </MenuItem>
                                ))}
                            </Select>
                        ) : (
                            <Select
                                disableUnderline
                                labelId='showtime-select-label'
                                id='showtime-select'
                                value=''
                            >
                                <MenuItem value='Please choose your movie, cinema and watch date'>
                                    Please choose your movie, cinema and watch date
                                </MenuItem>
                            </Select>
                        )}
                    </FormControl>
                    {quickTicket.done ? (
                        <NavLink
                            to={{
                                pathname: localStorage.getItem('User')
                                    ? `/checkout/${quickTicket.maLichChieu}`
                                    : `/login`,
                                preRequire: `/checkout/${quickTicket.maLichChieu}`,
                                prePage: props.history.location.pathname,
                            }}
                        >
                            <Button
                                className='quick-ticket-booking'
                                variant='contained'
                                color='secondary'
                            >
                                Book ticket now
                            </Button>
                        </NavLink>
                    ) : (
                        <Button
                            className='quick-ticket-booking'
                            variant='contained'
                            color='secondary'
                            disabled
                        >
                            Book ticket now
                        </Button>
                    )}
                </Paper>
            </div>
        </ThemeProvider>
    );
}

const mapStateToProps = (state) => {
    return {
        listMovie: state.movieReducer.listMovie,
        cinemas: state.movieSelectReducer.cinemas,
        showtimeInfo: state.movieSelectReducer.showtimeInfo,
    };
};
const mapDispathToProp = (dispatch) => {
    return {
        getShowtimeInfo: (id) => {
            dispatch(action.getShowtimeInfoAPI(id));
        },
    };
};
export default connect(mapStateToProps, mapDispathToProp)(MovieSelect);
