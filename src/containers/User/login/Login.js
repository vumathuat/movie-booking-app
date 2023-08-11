import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import * as userAction from './../../../services/redux/actions/userAction';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import { Formik, ErrorMessage } from 'formik';
import webLogo from '../../../assets/img/web-logo.png';

import * as yup from 'yup';

const loginUserSchema = yup.object().shape({
    username: yup.string().required('* Field is required!'),
    password: yup.string().required('* Field is required!'),
});

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: '5px 0',
            width: '100%',
        },
    },
}));

const Input = withStyles({
    root: {
        '& .MuiFilledInput-input': {
            padding: '',
        },
        '& .MuiFilledInput-root': {
            backgroundColor: 'white',
            borderRadius: '4px',
        },
        '& label.Mui-focused': {
            color: '#007BFF',
        },
        '& .MuiFilledInput-underline:after': {
            borderBottomColor: '#007BFF',
        },
    },
})(TextField);

function Login(props) {
    const classes = useStyles();

    const handleOnSubmit = (user) => {
        props.login({
            user,
            history: props.history,
            preRequire: props.location.preRequire,
            prePage: props.location.prePage,
        });
    };

    return (
        <div className='login'>
            <div className='signin-wrapper'>
                <NavLink to={props.location.prePage || '/'}>
                    <div className='signin-close'></div>
                </NavLink>
                <div className='signin-top'>
                    <img src={webLogo} alt='web-logo' />
                </div>
                <Formik
                    initialValues={{
                        username: '',
                        password: '',
                    }}
                    onSubmit={handleOnSubmit}
                    validationSchema={loginUserSchema}
                >
                    {(formikProps) => (
                        <form
                            onSubmit={formikProps.handleSubmit}
                            className={classes.root}
                        >
                            <Input
                                variant='filled'
                                size='small'
                                style={{ backGroundColor: 'white' }}
                                label='Username'
                                name='username'
                                onChange={formikProps.handleChange}
                                onBlur={formikProps.handleBlur}
                            />
                            <ErrorMessage name='username'>
                                {(msg) => (
                                    <div
                                        className='m-0'
                                        style={{ color: 'red' }}
                                    >
                                        {msg}
                                    </div>
                                )}
                            </ErrorMessage>
                            <Input
                                variant='filled'
                                size='small'
                                style={{ backGroundColor: 'white' }}
                                label='Password'
                                name='password'
                                onChange={formikProps.handleChange}
                                onBlur={formikProps.handleBlur}
                            />
                            <ErrorMessage name='password'>
                                {(msg) => (
                                    <div
                                        className='m-0'
                                        style={{ color: 'red' }}
                                    >
                                        {msg}
                                    </div>
                                )}
                            </ErrorMessage>
                            <button
                                type='submit'
                                className='btn btn-primary mt-2'
                                style={{ width: '100%' }}
                            >
                                Login
                            </button>
                        </form>
                    )}
                </Formik>
                <div className='text-center mt-3'>
                    <a href='# '>Forgot your password</a>
                    <p className='m-0' align='center'>
                        OR
                    </p>
                </div>
                <div>
                    <button
                        type='submit'
                        className='btn mt-2'
                        style={{
                            width: '100%',
                            backgroundColor: '#3B5998',
                            color: 'white',
                        }}
                    >
                        Login with Facebook
                    </button>
                    <button
                        type='submit'
                        className='btn my-2'
                        style={{
                            width: '100%',
                            backgroundColor: '#DD4B39',
                            color: 'white',
                        }}
                    >
                        Login with Google
                    </button>
                </div>
                <div>
                    <span>Haven't got your account? </span>
                    <NavLink
                        to={{
                            pathname: '/sign-up',
                            preRequire: props.location.preRequire,
                            prePage: props.location.prePage,
                        }}
                    >
                        Register now.
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

const mapDispatchToProps = (dispatch) => {
    return {
        login: (data) => {
            dispatch(userAction.login(data));
        },
    };
};

export default connect(null, mapDispatchToProps)(Login);
