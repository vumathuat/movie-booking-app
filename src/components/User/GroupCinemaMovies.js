import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '0',
    },
    tab: {
        minWidth: '95px',
    },
    expansionPanel: {
      width: "100%"
    }
}));

const ExpansionPanel = withStyles({
    root: {
        position: 'relative',
        marginTop: '1px',
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '50%',
            width: 'calc(100% - 40px)',
            transform: 'translateX(-50%)',
            borderBottom: '1px solid rgba(238, 238, 238)',
        },
        // border: "1px solid rgba(0, 0, 0, .125)",
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
            marginTop: '1px',
        },
    },
    expanded: {},
})(Accordion);

const ExpansionPanelSummary = withStyles({
    root: {
        padding: 20,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
    content: {
        margin: '0',
        '&$expanded': {
            margin: '0',
        },
    },
    expanded: {},
})(AccordionSummary);

const ExpansionPanelDetails = withStyles((theme) => ({
    root: {
        padding: '10px 20px',
    },
}))(AccordionDetails);

function GroupCinemaMovies(props) {
    const classes = useStyles();
    //Material UI Tabs
    const [value, setValue] = React.useState(0);
    //Set ChosenDay
    const [chosenDay, setChosenDay] = React.useState('2023-01-01');
    //Return Time-end with Time-start
    const getTimeEnd = (timeStart) => {
        let d = new Date();
        d.setHours(timeStart.slice(0, 2), timeStart.slice(3), 0);
        //Hour + 2
        d.setHours(d.getHours() + 2);
        let timeEnd = d.toLocaleTimeString('en-GB').slice(0, 5);
        return timeEnd;
    };

    useEffect(() => {
        setValue(0);
    }, [props]);

    //Material UI Tab change
    const handleChange = (event, newValue) => {
        let baseDay = new Date();
        let currentDay = new Date(baseDay);
        currentDay.setDate(baseDay.getDate() + newValue);
        let month =
            currentDay.getMonth() + 1 < 10
                ? '0' + (currentDay.getMonth() + 1)
                : currentDay.getMonth() + 1; //months from 1-12
        let day =
            currentDay.getDate() < 10
                ? '0' + currentDay.getDate()
                : currentDay.getDate();
        let year = currentDay.getFullYear();
        currentDay = year + '-' + month + '-' + day;
        setValue(newValue);
        setChosenDay(currentDay);
    };

    const renderTab = () => {
        let dayName = [
            'Chủ nhật',
            ' Thứ 2',
            ' Thứ 3',
            ' Thứ 4',
            ' Thứ 5',
            ' Thứ 6',
            ' Thứ 7',
        ];
        //Create Tabs with 14 days
        let arrayTab = [...Array(14)].map((item, index) => {
            let day = new Date();
            let nextDay = new Date(day);
            nextDay.setDate(day.getDate() + index);
            return (
                <Tab
                    key={index}
                    label={
                        <>
                            <p className='m-0'>{dayName[nextDay.getDay()]}</p>
                            <p className='m-0'>{nextDay.getDate()}</p>
                        </>
                    }
                    className={classes.tab}
                />
            );
        });
        return arrayTab;
    };

    const renderSchedule = () => {
        return (
            <ExpansionPanel>
                <ExpansionPanelSummary>
                    <div className='cinema'>
                        <div className='cinema__info'>
                            <span className='cinema__name'>
                                <span className='group-cinema__name'>
                                    {props.detailMovie.title} 
                                </span>
                                &nbsp;- {props.detailMovie.release_date}
                            </span>
                        </div>
                    </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Typography>
                        {props.schedule
                            .filter(
                                (item) =>
                                    item.time_start_d === chosenDay
                            )
                            .map((item, index4) => {
                                window.localStorage.setItem('SCREENING', item.screening_id);
                                return (
                                    <NavLink
                                        className='showtime'
                                        to={{
                                            pathname:
                                                localStorage.getItem(
                                                    'User'
                                                )
                                                    ? `/checkout/${item.movie_id}`
                                                    : `/login`,
                                            preRequire: `/checkout/${item.movie_id}`,
                                            prePage:
                                                props.history.location
                                                    .pathname,
                                        }}
                                        key={index4}
                                    >
                                        <span className='timestart'>
                                            {item.time_start_t}
                                        </span>
                                        <span>
                                            {` ~ ${getTimeEnd(
                                                item.time_start_t
                                            )}`}
                                        </span>
                                    </NavLink>
                                );
                            }
                            )}
                    </Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    };

    //Main
    return (
        <div className={`group-cinema-movies ${classes.root}`}>
            <AppBar position='static' color='inherit' elevation={1}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor='secondary'
                    textColor='secondary'
                    variant='scrollable'
                    scrollButtons='auto'
                    aria-label='scrollable auto tabs example'
                >
                    {renderTab()}
                </Tabs>
            </AppBar>
            {renderSchedule()}
        </div>
    );
}

export default GroupCinemaMovies;