import { combineReducers } from 'redux';
import movieReducer from './movieReducer';
import cinemaReducer from './cinemaReducer';
import userReducer from './userReducer';
import movieSelectReducer from './movieSelectReducer';

const rootReducers = combineReducers({
    movieReducer,
    cinemaReducer,
    userReducer,
    movieSelectReducer,
});

export default rootReducers;
