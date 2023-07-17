import {
    GET_LIST_GROUP_CINEMA,
    GET_GROUP_CINEMA_INFO,
    SET_CHOSEN_GROUP_CINEMA,
    GET_CINEMA_MOVIES,
} from './../constants/contants';
import Axios from 'axios';

export const getListGroupCinemaAPI = () => {
    return (dispatch) => {
        Axios({
            method: 'GET',
            url: 'https://movie0706.cybersoft.edu.vn/api/QuanLyRap/LayThongTinHeThongRap',
        })
            .then((result) => {
                dispatch({
                    type: GET_LIST_GROUP_CINEMA,
                    listGroupCinema: result.data,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };
};

export const getGroupCinemaInfoAPI = (maHeThongRap) => {
    return (dispatch) => {
        Axios({
            method: 'GET',
            url: `https://movie0706.cybersoft.edu.vn/api/QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${maHeThongRap}`,
        })
            .then((result) => {
                dispatch({
                    type: GET_GROUP_CINEMA_INFO,
                    data: result.data,
                    maHeThongRap: maHeThongRap,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };
};

export const setChosenGroupCinema = (chosenGroupCinema) => {
    return (dispatch) => {
        dispatch({
            type: SET_CHOSEN_GROUP_CINEMA,
            chosenGroupCinema,
        });
    };
};

export const getCinemaMovies = (payload) => {
    return (dispatch) => {
        Axios({
            method: 'GET',
            url: `https://movie0706.cybersoft.edu.vn/api/QuanLyRap/LayThongTinLichChieuHeThongRap?maHeThongRap=${payload}&maNhom=GP10`,
        })
            .then((result) => {
                dispatch({
                    type: GET_CINEMA_MOVIES,
                    groupCinemaShowtimes: result.data,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };
};
