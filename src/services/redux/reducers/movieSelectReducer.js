import { GET_SHOWTIME_INFO } from '../constants/contants';

let initialState = {
    showtimeInfo: [],
};

const movieSelectReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SHOWTIME_INFO:
            return {
                ...state,
                showtimeInfo: action.data,
            };

        default:
            return state;
    }
};

export default movieSelectReducer;
