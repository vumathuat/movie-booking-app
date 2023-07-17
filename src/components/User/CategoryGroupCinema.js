import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as action from './../../services/redux/actions/cinemaActions';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    tab: {
        minWidth: 90,
        padding: 20,
        color: '#fb4226',
    },
}));

function CategoryGroupCinema(props) {
    const classes = useStyles();
    let { listGroupCinema } = props;
    //Material UI Tabs
    const [value, setValue] = useState(0);

    //Render List Cinema & Cinema Movies of Groupcinema first time
    useEffect(() => {
        if (listGroupCinema.length) {
            //Set first element of Groupcinemas to Chosen GroupCinema
            let chosenGroupCinema = listGroupCinema[0].maHeThongRap;
            props.setChosenGroupCinema(chosenGroupCinema);
            props.getCinemaMovies(chosenGroupCinema);
        }
    }, [props]); // eslint-disable-line react-hooks/exhaustive-deps

    //Render List Cinema & Cinema Movies of Groupcinema when change Tab
    const handleChange = (event, index) => {
        setValue(index);
        let chosenGroupCinema = listGroupCinema[index].maHeThongRap;
        props.setChosenGroupCinema(chosenGroupCinema);
        props.getCinemaMovies(chosenGroupCinema);
    };

    const renderLabelTab = (groupCinema) => {
        //Render CateloryGroupCinema with GroupCinema's name
        if (props.labelWithName) {
            return (
                <div>
                    <img
                        src={groupCinema.logo}
                        style={{ height: '50px' }}
                        alt='img'
                    />
                    <span className='group-cinema-name'>
                        {groupCinema.tenHeThongRap}
                    </span>
                </div>
            );
        }
        //Render CateloryGroupCinema without GroupCinema's name
        return (
            <img src={groupCinema.logo} style={{ height: '50px' }} alt='img' />
        );
    };

    //Main return
    return (
        <Tabs
            indicatorColor='secondary'
            orientation='vertical'
            variant='scrollable'
            value={value}
            onChange={handleChange}
            aria-label='Vertical tabs example'
            className={`caterogy-group-cinema ${classes.tabs}`}
        >
            {listGroupCinema.map((groupCinema, index) => {
                return (
                    <Tab
                        className={`group-cinema-icon ${classes.tab}`}
                        label={renderLabelTab(groupCinema)}
                        key={index}
                    />
                );
            })}
        </Tabs>
    );
}

const mapStateToProps = (state) => {
    return {
        listGroupCinema: state.cinemaReducer.listGroupCinema,
    };
};

const mapDispathToProp = (dispatch) => {
    return {
        setChosenGroupCinema: (chosenGroupCinema) => {
            dispatch(action.setChosenGroupCinema(chosenGroupCinema));
        },
        getCinemaMovies: (chosenGroupCinema) => {
            dispatch(action.getCinemaMovies(chosenGroupCinema));
        },
    };
};

export default connect(mapStateToProps, mapDispathToProp)(CategoryGroupCinema);
