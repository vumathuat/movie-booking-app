import { combineReducers } from 'redux';
import movieReducer from './movieReducer';
import userReducer from './userReducer';

import movieSelectReducer from './movieSelectReducer';

const rootReducers = combineReducers({
    movieReducer,
    userReducer,
    movieSelectReducer,
});

export default rootReducers;
