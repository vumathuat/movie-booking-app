import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import * as action from "../../services/redux/actions/movieSelectAction";
import { NavLink } from "react-router-dom";
import { createTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff7539",
    },
    secondary: {
      main: "#fb4226",
    },
  },
  overrides: {
    MuiListItem: {
      button: {
        "&:hover": {
          backgroundColor: "#FFECB3",
        },
      },
      root: {
        "&$selected": {
          backgroundColor: "#FF6F00",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#FF6F00",
            color: "#fff",
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
    display: "flex",
    justifyContent: "center",
  },
  paper: {
    display: "flex",
    alignItems: "center",
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    "@media (max-width: 576px)": {
      flexDirection: "column",
    },
  },
  movie: {
    margin: theme.spacing(1),
    minWidth: 250,
    maxWidth: 250,
    "@media (max-width: 576px)": {
      minWidth: "unset",
      maxWidth: "unset",
      width: "100%",
    },
  },
  date: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 120,
    "@media (max-width: 576px)": {
      minWidth: "unset",
      maxWidth: "unset",
      width: "100%",
    },
  },
  showtime: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 120,
    "@media (max-width: 576px)": {
      minWidth: "unset",
      maxWidth: "unset",
      width: "100%",
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
    movieSelect: "",
    dateSelect: "",
    showtimeSelect: "",
    dates: [],
    showtimes: [],
    done: false,
    movie_id: "",
  });


  const handleChange = (event) => {
    const { name, value } = event.target;
    const { id } = event.currentTarget;

    if (name === "movieSelect") {
      props.getShowtimeInfo(id);
      window.localStorage.setItem("MOVIE_ID", id);
      console.log(props.showtimeInfo);
      console.log(id)
      const dates = [
        ...new Set(props.showtimeInfo.map((date) => date.time_start_d)),
      ];
      setQuickTicket({
        ...quickTicket,
        [name]: value,
        dates,
        dateSelect: "",
        showtimeSelect: "",
        showtimes: [],
      });
    } else if (name === "dateSelect") {
      const showtimes = [
        ...new Set(props.showtimeInfo.map((showtime) => showtime.time_start_t)),
      ];
      console.log(showtimes);
      setQuickTicket({
        ...quickTicket,
        [name]: value,
        showtimes,
        showtimeSelect: "",
      });
    } else if (name === "showtimeSelect") {
      setQuickTicket({
        ...quickTicket,
        [name]: value,
      });
    } 

    setQuickTicket((preTicket) => {
      let newId = window.localStorage.getItem("MOVIE_ID");
      let movie_id = preTicket.showtimeSelect.length > 0 ? newId : "";
      if (movie_id.length > 0) {
        return {
          ...preTicket,
          done: true,
          movie_id,
        };
      }
      return {
        ...preTicket,
        done: false,
        movie_id: "",
      };
    });
  };

  //Main return
  return (
    <ThemeProvider theme={theme}>
      <div className="home-tool">
        <Paper elevation={3} className={classes.paper}>
          <FormControl className={classes.movie}>
            <InputLabel id="movie-select-label">Movie</InputLabel>
            <Select
              disableUnderline
              labelId="movie-select-label"
              id="movie-select"
              value={quickTicket.movieSelect}
              onChange={handleChange}
              input={<Input name="movieSelect" />}
              MenuProps={MenuProps.MovieProps}
            >
              {props.listMovie.map((movie, index) => (
                <MenuItem key={index} id={movie.movie_id} value={movie.title}>
                  {movie.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.date}>
            <InputLabel id="date-select-label">Watch date</InputLabel>
            {quickTicket.dates.length > 0 ? (
              <Select
                disableUnderline
                labelId="date-select-label"
                id="date-select"
                value={quickTicket.dateSelect}
                onChange={handleChange}
                input={<Input name="dateSelect" />}
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
                labelId="date-select-label"
                id="date-select"
                value=""
              >
                <MenuItem value="Please pick your movie and cinema.">
                  Please pick your movie first.
                </MenuItem>
              </Select>
            )}
          </FormControl>
          <FormControl className={classes.showtime}>
            <InputLabel id="showtime-select-label">Watch slot</InputLabel>
            {quickTicket.showtimes.length > 0 ? (
              <Select
                disableUnderline
                labelId="showtime-select-label"
                id="showtime-select"
                value={quickTicket.showtimeSelect}
                onChange={handleChange}
                input={<Input name="showtimeSelect" />}
                MenuProps={MenuProps.ShowtimeProps}
              >
                {quickTicket.showtimes.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              <Select
                disableUnderline
                labelId="showtime-select-label"
                id="showtime-select"
                value=""
              >
                <MenuItem value="Please choose your movie, cinema and watch date">
                  Please choose your movie and watch date first.
                </MenuItem>
              </Select>
            )}
          </FormControl>
          {quickTicket.done ? (
            <NavLink
              to={{
                pathname: localStorage.getItem("User")
                  ? `/checkout/${quickTicket.movie_id}`
                  : `/login`,
                preRequire: `/checkout/${quickTicket.movie_id}`,
                prePage: props.history.location.pathname,
              }}
            >
              <Button
                className="quick-ticket-booking"
                variant="contained"
                color="secondary"
              >
                Book ticket now
              </Button>
            </NavLink>
          ) : (
            <Button
              className="quick-ticket-booking"
              variant="contained"
              color="secondary"
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
