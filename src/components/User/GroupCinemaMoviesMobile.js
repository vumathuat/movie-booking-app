import React, { useState } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        // width: "0"
        // backgroundColor: theme.palette.background.paper
    },
    tab: {
        minWidth: '95px',
        '@media (max-width: 600px)': {
            minWidth: '50px',
        },
    },
    // expansionPanel: {
    //   width: "100%"
    // }
}));

//ExpansionPanel of GroupCinema
const ExpansionPanel = withStyles({
    root: {
        position: 'relative',
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
        },
    },
    expanded: {},
})(Accordion);

//ExpansionPanel of Cinema
const ExpansionPanel2 = withStyles({
    root: {
        position: 'relative',
        width: '100%',
        '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
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
        },
    },
    expanded: {},
})(Accordion);

//Common ExpansionPanelSummary
const ExpansionPanelSummary = withStyles({
    root: {
        padding: 20,
        '@media (max-width: 600px)': {
            padding: 15,
        },
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

//GroupCinema's ExpansionPanelDetails
const ExpansionPanelDetails = withStyles((theme) => ({
    root: {
        padding: 0,
        display: 'block',
    },
}))(AccordionDetails);

//Cinema's ExpansionPanelDetails
const ExpansionPanelDetails2 = withStyles((theme) => ({
    root: {
        padding: '0 20px 20px 20px',
    },
}))(AccordionDetails);

//Main
function GroupCinemaMoviesMobile(props) {
    const classes = useStyles();
    //Material UI Tabs Dates
    const [value, setValue] = useState(0);
    //Set Chosen Day
    const [chosenDay, setChosenDay] = useState('2019-01-01');

    //Material UI Expand - Controlled Accordion
    const [expanded, setExpanded] = useState('');
    const handleChangeExpansion = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    //Get Time-end
    const getTimeEnd = (timeStart) => {
        let d = new Date();
        d.setHours(timeStart.slice(0, 2), timeStart.slice(3), 0);
        d.setHours(d.getHours() + 2);
        let timeEnd = d.toLocaleTimeString('en-GB').slice(0, 5);
        return timeEnd;
    };

    //Material UI Tab Change
    const handleChange = (event, newValue) => {
        let baseDay = new Date('January 1, 2019');
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

    //Render Tabs with 14 day
    const renderTab = () => {
        let dayName = [];
        //Show dayNameFull/dayNameLess
        function myFunction(x) {
            if (x.matches) {
                dayName = [
                    'Chủ nhật',
                    'Thứ 2',
                    'Thứ 3',
                    'Thứ 4',
                    'Thứ 5',
                    'Thứ 6',
                    'Thứ 7',
                ];
            } else {
                dayName = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
            }
        }
        let x = window.matchMedia('(min-width: 600px)');
        myFunction(x); // Call listener function at run time
        x.addListener(myFunction); // Attach listener function on state changes

        let arrayTab = [...Array(14)].map((item, index) => {
            let day = new Date('January 1, 2019');
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

    let lichChieuFull = props.detailMovie.lichChieu;
    let lichChieuOnDay = lichChieuFull.filter(
        (lichChieu) => lichChieu.ngayChieuGioChieu.slice(0, 10) === chosenDay
    );

    //Render GroupCinemas
    const renderGroupCinema = () => {
        return props.listGroupCinema
            .filter((groupCinema) =>
                lichChieuOnDay.find(
                    (lichChieu) =>
                        lichChieu.thongTinRap.maHeThongRap ===
                        groupCinema.maHeThongRap
                )
            )
            .map((item, index) => {
                return (
                    <ExpansionPanel
                        key={index}
                        expanded={expanded === item.maHeThongRap}
                        onChange={handleChangeExpansion(item.maHeThongRap)}
                    >
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`group-cinema-content-${index}`}
                            id={`group-cinema-${index}`}
                        >
                            <div className='group-cinema'>
                                <img
                                    src={item.logo}
                                    style={{ height: '50px' }}
                                    alt='img'
                                />
                                <span className='group-cinema-name'>
                                    {item.tenHeThongRap}
                                </span>
                            </div>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            {renderCinema(item.maHeThongRap)}
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                );
            });
    };

    //Render Cinemas have Showtime on ChosenDay
    const renderCinema = (maHeThongRap) => {
        let cinemasOfGroupCinema = [];
        if (props.groupCinemaInfo[maHeThongRap]) {
            props.groupCinemaInfo[maHeThongRap].forEach((item) => {
                if (
                    props.detailMovie.lichChieu
                        .filter(
                            (lichChieu) =>
                                lichChieu.ngayChieuGioChieu.slice(0, 10) ===
                                chosenDay
                        )
                        .find(
                            (lichChieu) =>
                                lichChieu.thongTinRap.maCumRap === item.maCumRap
                        )
                ) {
                    cinemasOfGroupCinema.push(item);
                }
            });
        }
        return cinemasOfGroupCinema.map((cinema, index) => {
            let tenRap = cinema.tenCumRap.startsWith('BHD Star')
                ? [cinema.tenCumRap.slice(0, 8), cinema.tenCumRap.slice(20)]
                : cinema.tenCumRap.split(' - ');
            return (
                <ExpansionPanel2 key={index}>
                    <ExpansionPanelSummary
                        aria-controls='cinema-content'
                        id='cinema-header'
                    >
                        <div className='cinema'>
                            <div className='cinema__info'>
                                <span className='cinema__name'>
                                    <span className='group-cinema__name'>
                                        {tenRap[0]}
                                    </span>
                                    - {tenRap[1]}
                                </span>
                                <span className='cinema__address'>
                                    {cinema.diaChi}
                                </span>
                                <span className='cinema__detail'>
                                    [chi tiết]
                                </span>
                            </div>
                        </div>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails2>
                        <Typography>
                            {lichChieuOnDay
                                .filter(
                                    (lichChieu) =>
                                        lichChieu.thongTinRap.maCumRap ===
                                        cinema.maCumRap
                                )
                                .map((item, index) => {
                                    return (
                                        <NavLink
                                            className='showtime'
                                            to={{
                                                pathname: localStorage.getItem(
                                                    'User'
                                                )
                                                    ? `/checkout/${item.maLichChieu}`
                                                    : `/login`,
                                                preRequire: `/checkout/${item.maLichChieu}`,
                                                prePage:
                                                    props.history.location
                                                        .pathname,
                                            }}
                                            key={index}
                                        >
                                            <span className='start-time'>
                                                {item.ngayChieuGioChieu.slice(
                                                    11,
                                                    16
                                                )}
                                            </span>
                                            <span>
                                                {` ~ ${getTimeEnd(
                                                    item.ngayChieuGioChieu.slice(
                                                        11,
                                                        16
                                                    )
                                                )}`}
                                            </span>
                                        </NavLink>
                                    );
                                })}
                        </Typography>
                    </ExpansionPanelDetails2>
                </ExpansionPanel2>
            );
        });
    };

    //Main return
    return (
        <div className={`group-cinema-movies--mobile ${classes.root}`}>
            <AppBar
                position='static'
                color='inherit'
                elevation={0}
                className='border border-bottom-secondary'
            >
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
            {renderGroupCinema().length > 0 ? (
                renderGroupCinema()
            ) : (
                <div className='no-showtime'>Không có suất chiếu.</div>
            )}
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        listGroupCinema: state.cinemaReducer.listGroupCinema,
        groupCinemaShowtimes:
            state.cinemaReducer.groupCinemaShowtimes.chosenGroupCinema,
        groupCinemaInfo: state.cinemaReducer.groupCinemaInfo,
    };
};

export default connect(mapStateToProps, null)(GroupCinemaMoviesMobile);
