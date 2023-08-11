import { SIGN_UP, LOGIN } from './../constants/contants';
import Axios from 'axios';
import Swal from 'sweetalert2';

export const login = (dataLogin) => {
    return (dispatch) => {
        Axios({
            method: 'POST',
            url: 'http://localhost:5000/login',
            data: dataLogin.user,
        })
            .then((result) => {
                localStorage.setItem('User', JSON.stringify(result.data));
                    if (dataLogin.preRequire) {
                        dataLogin.history.replace({
                            pathname: dataLogin.preRequire,
                            prePage: dataLogin.prePage,
                        });
                    } else {
                        dataLogin.history.push('/');
                    }
                    dispatch({
                        type: LOGIN,
                    });
            })
            .catch((err) => {
                alert("Wrong username or password");
            });
    };
};

export const signUpAPI = (payload) => {
    return (dispatch) => {
        Axios({
            method: 'POST',
            url: 'http://localhost:5000/register',
            data: payload.user,
        })
            .then((result) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Register successfully!',
                    text: 'Log in now',
                    width: '400px',
                    padding: '0 0 20px 0',
                }).then(() => {
                    payload.history.replace({
                        pathname: '/login',
                        preRequire: payload.preRequire,
                        prePage: payload.prePage,
                    });
                });
                dispatch({
                    type: SIGN_UP,
                });
            })
            .catch((err) => {
                alert("Your username have been taken");
            });
    };
};