import { GET_LIST_MOVIE, GET_DETAIL_MOVIE } from './../constants/contants';

let initialState = {
    listMovie: [],
    movie: [],
};

const movieReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_LIST_MOVIE:
            state.listMovie = action.listMovie;
            return { ...state };
        case GET_DETAIL_MOVIE:
            state.movie = action.movie;
            return { ...state };
        default:
            return { ...state };
    }
};

export default movieReducer;
