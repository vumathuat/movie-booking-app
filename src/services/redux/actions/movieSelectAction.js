import * as ActionType from '../constants/contants';
import Axios from 'axios';

export const getShowtimeInfoAPI = (id) => {
    return (dispatch) => {
        Axios({
            method: 'GET',
            url: `http://localhost:5000/schedule?id=${id}`,
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
