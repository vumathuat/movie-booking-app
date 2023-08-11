import * as ActionType from './../constants/contants';
import Axios from 'axios';

export const getListMovieAPI = () => {
    return (dispatch) => {
        Axios({
            method: 'GET',
            url: 'http://localhost:5000/films',
            headers: { 'Content-Type': 'application/json' },
        })
            .then((result) => {
                dispatch({
                    type: ActionType.GET_LIST_MOVIE,
                    listMovie: result.data,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };
};

export const getDetailMovie = (id) => {
    return (dispatch) => {
        Axios({
            method: 'GET',
            url: `http://localhost:5000/films?id=${id}`,
        })
            .then((result) => {
                dispatch({
                    type: ActionType.GET_DETAIL_MOVIE,
                    movie: result.data,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };
};
