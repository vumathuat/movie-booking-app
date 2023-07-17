import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CinemaMovies from './CinemaMovies';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: 440,
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    tab: {
        minWidth: 282,
        maxWidth: 282,
        padding: 0,
        color: '#fb4226',
    },
}));

function GroupCinema(props) {
    const classes = useStyles();
    //Material UI Tabs
    const [value, setValue] = React.useState(0);
    const [chosenCinema, setChosenCinema] = React.useState('');

    useEffect(() => {
        setValue(0);
        if (props.groupCinemaInfo[props.chosenGroupCinema]) {
            setChosenCinema(
                props.groupCinemaInfo[props.chosenGroupCinema][0].maCumRap
            );
        }
    }, [props]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (props.groupCinemaInfo[props.chosenGroupCinema]) {
            setChosenCinema(
                props.groupCinemaInfo[props.chosenGroupCinema][newValue]
                    .maCumRap
            );
        }
    };

    const renderCinemasOfGroupCinema = () => {
        if (props.groupCinemaInfo[props.chosenGroupCinema]) {
            return props.groupCinemaInfo[props.chosenGroupCinema].map(
                (cinema, index) => {
                    let tenRap = cinema.tenCumRap.startsWith('BHD Star')
                        ? [
                              cinema.tenCumRap.slice(0, 8),
                              cinema.tenCumRap.slice(20),
                          ]
                        : cinema.tenCumRap.split(' - ');
                    return (
                        <Tab
                            className={classes.tab}
                            label={
                                <div className='cinema'>
                                    <div className='cinema__info'>
                                        <span className='cinema__name'>
                                            <span className='cinema__name__group'>
                                                {tenRap[0]}
                                            </span>{' '}
                                            - {tenRap[1]}
                                        </span>
                                        <span className='cinema__address'>
                                            {cinema.diaChi}
                                        </span>
                                        <span className='cinema__detail'>
                                            [detail]
                                        </span>
                                    </div>
                                </div>
                            }
                            key={index}
                        />
                    );
                }
            );
        }
    };

    return (
        <div className={classes.root}>
            <Tabs
                indicatorColor='secondary'
                orientation='vertical'
                variant='scrollable'
                value={
                    props.groupCinemaInfo[props.chosenGroupCinema]
                        ? value <
                          props.groupCinemaInfo[props.chosenGroupCinema].length
                            ? value
                            : 0
                        : 0
                }
                onChange={handleChange}
                aria-label='Vertical tabs example'
                className={classes.tabs}
            >
                {renderCinemasOfGroupCinema()}
            </Tabs>
            <CinemaMovies history={props.history} chosenCinema={chosenCinema} />
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        groupCinemaShowtimes:
            state.cinemaReducer.groupCinemaShowtimes.chosenGroupCinema,
        chosenGroupCinema: state.cinemaReducer.chosenGroupCinema,
        groupCinemaInfo: state.cinemaReducer.groupCinemaInfo,
    };
};
export default connect(mapStateToProps, null)(GroupCinema);
