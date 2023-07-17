import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as action from '../../../services/redux/actions/cinemaActions';
import CategoryGroupCinema from '../../../components/User/CategoryGroupCinema';
import CategoryGroupCinemaMobile from '../../../components/User/CategoryGroupCinemaMobile';
import GroupCinema from '../../../components/User/GroupCinema';

import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const theme = createTheme({
    palette: {
        primary: {
            main: '#ff7539',
        },
        secondary: {
            main: '#fb4226',
        },
    },
    overrides: {
        PrivateTabScrollButton: {
            vertical: {
                position: 'relative',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    width: 'calc(100% - 40px)',
                    transform: 'translateX(-50%)',
                    borderBottom: '1px solid rgba(238, 238, 238, 0.88)',
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -1,
                    left: '50%',
                    width: 'calc(100% - 40px)',
                    transform: 'translateX(-50%)',
                    borderTop: '1px solid rgba(238, 238, 238, 0.88)',
                },
            },
        },
    },
});

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: 440,
        maxWidth: 940,
        margin: 'auto',
        position: 'relative',
        '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            borderBottom: '1px solid rgba(0,0,0,0.14)',
        },
    },
}));

function Cinema(props) {
    const classes = useStyles();
    props.listGroupCinema.forEach((groupCinema) =>
        props.getGroupCinemaInfo(groupCinema.maHeThongRap)
    );
    useEffect(() => {
        props.getListGroupCinema();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <ThemeProvider theme={theme}>
            <div className='cinema__wrap'>
                <Paper
                    // variant="outlined"
                    elevation={3}
                    className={`group-cinema d-none d-md-flex ${classes.root}`}
                >
                    <CategoryGroupCinema
                        labelWithName={false}
                    ></CategoryGroupCinema>
                    <GroupCinema history={props.history}></GroupCinema>
                </Paper>
                <CategoryGroupCinemaMobile history={props.history} />
            </div>
        </ThemeProvider>
    );
}

const mapDispathToProps = (dispatch) => {
    return {
        getListGroupCinema: () => {
            dispatch(action.getListGroupCinemaAPI());
        },
        getGroupCinemaInfo: (meHeThongRap) => {
            dispatch(action.getGroupCinemaInfoAPI(meHeThongRap));
        },
    };
};
const mapStateToProps = (state) => {
    return {
        listGroupCinema: state.cinemaReducer.listGroupCinema,
    };
};

export default connect(mapStateToProps, mapDispathToProps)(Cinema);
