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
    username: yup.string().required('* Field is required!'),
    password: yup.string().required('* Field is required!'),
    phone_no: yup
        .string()
        .required('*Field is required!')
        .matches(
            /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
            '* Phone number is invalid!'
        ),
    email: yup
        .string()
        .required('*Field is required!'),
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
                        username: '',
                        password: '',
                        phone_no: '',
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
                                label='Phone number'
                                name='phone_no'
                                onChange={formikProps.handleChange}
                                onBlur={formikProps.handleBlur}
                            />
                            <ErrorMessage name='phone_no'>
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
                                className='btn btn-primary my-3'
                                style={{ width: '100%' }}
                            >
                                Register
                            </button>
                        </form>
                    )}
                </Formik>
                <div>
                    <span>Already have an account? </span>
                    <NavLink
                        to={{
                            pathname: '/login',
                            preRequire: props.location.preRequire,
                            prePage: props.location.prePage,
                        }}
                    >
                        Login Now.
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