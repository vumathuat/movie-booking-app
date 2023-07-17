import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import * as userAction from '../../../services/redux/actions/userAction';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import { Formik, ErrorMessage } from 'formik';
import webLogo from '../../../assets/img/web-logo.png';

import * as yup from 'yup';

const signupUserSchema = yup.object().shape({
    taiKhoan: yup.string().required('* Field is required!'),
    matKhau: yup.string().required('* Field is required!'),
    hoTen: yup.string().required('* Field is required!'),
    soDt: yup
        .string()
        .required('*Field is required!')
        .matches(
            /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
            '* Phone number is invalid!'
        ),
    email: yup
        .string()
        .required('*Field is required!')
        .email('* Email is invalid!'),
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

function SignUp(props) {
    const classes = useStyles();

    const handleOnSubmit = (user) => {
        props.signUp({
            user,
            history: props.history,
            preRequire: props.location.preRequire,
            prePage: props.location.prePage,
        });
    };

    return (
        <div className='sign-up'>
            <div className='signin-wrapper'>
                <NavLink to={props.location.prePage || '/'}>
                    <div className='signin-close'></div>
                </NavLink>
                <div className='signin-top'>
                    <img src={webLogo} alt='web-logo' />
                </div>
                <Formik
                    initialValues={{
                        taiKhoan: '',
                        matKhau: '',
                        hoTen: '',
                        soDt: '',
                        email: '',
                    }}
                    onSubmit={handleOnSubmit}
                    validationSchema={signupUserSchema}
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
                                label='Name'
                                name='hoTen'
                                onChange={formikProps.handleChange}
                                onBlur={formikProps.handleBlur}
                            />
                            <ErrorMessage name='hoTen'>
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
                                label='Phone number'
                                name='soDt'
                                onChange={formikProps.handleChange}
                                onBlur={formikProps.handleBlur}
                            />
                            <ErrorMessage name='soDt'>
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
                                label='Email'
                                name='email'
                                onChange={formikProps.handleChange}
                                onBlur={formikProps.handleBlur}
                            />
                            <ErrorMessage name='email'>
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
                                label='Username'
                                name='taiKhoan'
                                onChange={formikProps.handleChange}
                                onBlur={formikProps.handleBlur}
                            />
                            <ErrorMessage name='taiKhoan'>
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
                                name='matKhau'
                                onChange={formikProps.handleChange}
                                onBlur={formikProps.handleBlur}
                            />
                            <ErrorMessage name='matKhau'>
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
                                className='btn btn-primary my-3'
                                style={{ width: '100%' }}
                            >
                                Sign Up
                            </button>
                        </form>
                    )}
                </Formik>
                <div>
                    <span>Already got an account? </span>
                    <NavLink
                        to={{
                            pathname: '/login',
                            preRequire: props.location.preRequire,
                            prePage: props.location.prePage,
                        }}
                    >
                        Login now.
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

const mapDispatchToProps = (dispatch) => {
    return {
        signUp: (user) => {
            dispatch(userAction.signUpAPI(user));
        },
    };
};

export default connect(null, mapDispatchToProps)(SignUp);
