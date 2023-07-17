import * as ActionType from '../constants/contants';
import Axios from 'axios';

export const getShowtimeInfoAPI = (id) => {
    return (dispatch) => {
        Axios({
            method: 'GET',
            url: `https://movie0706.cybersoft.edu.vn/api/QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${id}`,
        })
            .then((result) => {
                dispatch({
                    type: ActionType.GET_SHOWTIME_INFO,
                    data: result.data,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };
};
