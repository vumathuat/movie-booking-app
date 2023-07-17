import { LOGIN, SIGN_UP } from './../constants/contants';

let initialState = {};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return { ...state };
        case SIGN_UP:
            return { ...state };
        default:
            return { ...state };
    }
};

export default userReducer;
