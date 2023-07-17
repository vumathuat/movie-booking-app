import * as ActionType from './../constants/contants';
import Axios from 'axios';

export const getListMovieAPI = () => {
    return (dispatch) => {
        Axios({
            method: 'GET',
            url: 'https://movie0706.cybersoft.edu.vn/api/QuanLyPhim/LayDanhSachPhim?maNhom=GP10',
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
            url: `https://movie0706.cybersoft.edu.vn/api/QuanLyPhim/LayThongTinPhim?MaPhim=${id}`,
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
