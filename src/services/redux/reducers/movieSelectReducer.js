import { GET_SHOWTIME_INFO } from '../constants/contants';

let initialState = {
    cinemas: [],
    showtimeInfo: {},
};

const movieSelectReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SHOWTIME_INFO:
            state.showtimeInfo = action.data;
            let nameCinemas = [];
            action.data.heThongRapChieu.forEach((item) => {
                item.cumRapChieu.forEach((item) => {
                    nameCinemas.push(item.tenCumRap);
                });
            });
            state.cinemas = nameCinemas;
            return { ...state };

        default:
            return { ...state };
    }
};

export default movieSelectReducer;
