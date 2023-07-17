import {
    GET_LIST_GROUP_CINEMA,
    GET_GROUP_CINEMA_INFO,
    SET_CHOSEN_GROUP_CINEMA,
    GET_CINEMA_MOVIES,
} from './../constants/contants';

let initialState = {
    listGroupCinema: [],
    groupCinemaShowtimes: [],
    chosenGroupCinema: '',
    groupCinemaInfo: {},
};

const cinemaReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_LIST_GROUP_CINEMA:
            state.chosenGroupCinema = action.listGroupCinema[0].maHeThongRap;
            state.listGroupCinema = action.listGroupCinema;
            return { ...state };

        case GET_GROUP_CINEMA_INFO:
            let groupCinemaInfo = { ...state.groupCinemaInfo };
            groupCinemaInfo[action.maHeThongRap] = action.data;
            return { ...state, groupCinemaInfo: groupCinemaInfo };

        case SET_CHOSEN_GROUP_CINEMA:
            state.chosenGroupCinema = action.chosenGroupCinema;
            return { ...state };

        case GET_CINEMA_MOVIES:
            state.groupCinemaShowtimes = action.groupCinemaShowtimes;
            return { ...state };

        default:
            return { ...state };
    }
};

export default cinemaReducer;
