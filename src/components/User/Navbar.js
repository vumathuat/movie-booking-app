import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-scroll';

import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import Dropdown from './Dropdown';

import logo from '../../assets/img/web-logo.png';

const useStyles = makeStyles((theme) => ({
    //Avatar size
    small: {
        width: theme.spacing(4),
        height: theme.spacing(4),
    },
}));

export default function Navbar(props) {
    let currentPage = props.history.location.pathname;
    const classes = useStyles();

    //Sidebar
    const [sidebar, setSidebar] = useState({
        right: false,
    });

    //Log out
    const logout = () => {
        localStorage.removeItem('User');
        props.history.replace(props.history.location.pathname);
    };

    //Location
    const [location, setLocation] = useState('Hà Nội');
    const [isOpen, setIsOpen] = useState(false);

    //Check login
    const isLogin = () => {
        if (localStorage.getItem('User')) {
            let user = JSON.parse(localStorage.getItem('User'));
            //Logged
            return (
                <>
                    <a
                        className='user dropdown-toggle d-flex align-items-center'
                        href='# '
                        id='navbarDropdown'
                        role='button'
                        data-toggle='dropdown'
                        aria-haspopup='true'
                        aria-expanded='false'
                    >
                        <Avatar className={classes.small}>
                        </Avatar>
                        <span className='ml-2'>
                            User{user.username}
                        </span>
                    </a>
                    <div
                        className='dropdown-menu'
                        aria-labelledby='navbarDropdown'
                    >
                        <a
                            href='# '
                            className='dropdown-item'
                            style={{ cursor: 'pointer' }}
                            onClick={logout}
                        >
                            Logout
                        </a>
                    </div>
                </>
            );
        }
        //Not logged in
        return (
            <NavLink
                className='user d-flex align-items-center'
                activeClassName='active'
                exact
                to={{
                    pathname: `/login`,
                    preRequire: currentPage,
                    prePage: currentPage,
                }}
            >
                <AccountCircleIcon />
                <span className='pl-1'>Login</span>
            </NavLink>
        );
    };

    //Hide/Unhide Sidebar
    const toggleDrawer = (side, open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        setSidebar({ ...sidebar, [side]: open });
    };

    const checkLinkToScroll = () => {
        if (currentPage === '/' || currentPage.startsWith('/home')) {
            return true;
        }
        return false;
    };

    //Sidebar
    const sideList = (side) => (
        <div className='sidebar' role='presentation'>
            <div className='wrapFirst d-flex justify-content-between align-items-center'>
                {isLogin()}
                <ArrowForwardIosIcon
                    className='back'
                    style={{ fontSize: 12 }}
                    onClick={toggleDrawer(side, false)}
                    onKeyDown={toggleDrawer(side, false)}
                />
            </div>
            <Divider />
            <List
                onClick={toggleDrawer(side, false)}
                onKeyDown={toggleDrawer(side, false)}
            >
                <ListItem button className='p-0'>
                    {checkLinkToScroll() ? (
                        <Link
                            className='nav__link'
                            activeClass='active'
                            to='list-movie--mobile'
                            spy={true}
                            smooth={true}
                            offset={-140}
                            duration={500}
                            href=''
                            onClick={toggleDrawer(side, false)}
                        >
                            Book Ticket
                        </Link>
                    ) : (
                        <NavLink
                            className='nav__link'
                            activeClassName='active'
                            exact
                            to='/home-list-movie'
                        >
                            Book Ticket
                        </NavLink>
                    )}
                </ListItem>
                <ListItem button className='p-0'>
                    {checkLinkToScroll() ? (
                        <Link
                            className='nav__link'
                            activeClass='active'
                            to='app'
                            spy={true}
                            smooth={true}
                            offset={-120}
                            duration={500}
                            href=''
                            onClick={toggleDrawer(side, false)}
                        >
                            Mobile Application
                        </Link>
                    ) : (
                        <NavLink
                            className='nav__link'
                            activeClassName='active'
                            exact
                            to='/home-app'
                        >
                            Mobile Application
                        </NavLink>
                    )}
                </ListItem>
            </List>
        </div>
    );

    //Main return
    return (
        <>
            <div className='blank'></div>
            {/* Sidebar */}
            <SwipeableDrawer
                anchor='right'
                open={sidebar.right}
                onClose={toggleDrawer('right', false)}
                onOpen={toggleDrawer('right', true)}
            >
                {sideList('right')}
            </SwipeableDrawer>

            {/* Navbar */}
            <div className='navbar--mobile d-block d-sm-none'>
                <div className='navbar__right'>
                    <div
                        className='icon-bars'
                        onClick={toggleDrawer('right', true)}
                    >
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                    </div>
                </div>
                <div className='navbar__left'>
                    <NavLink
                        activeClassName='active'
                        exact
                        className='navbar__brand'
                        to='/'
                    >
                        <img className='logo' src={logo} alt='logo'></img>
                    </NavLink>
                </div>
            </div>
            <div className='my-navbar'>
                <div className='navbar__left'>
                    <NavLink
                        activeClassName='active'
                        exact
                        className='navbar__brand'
                        to='/'
                    >
                        <img className='logo' src={logo} alt='logo'></img>
                    </NavLink>
                </div>
                <div className='navbar__center'>
                    <nav>
                        <ul className='nav__links'>
                            <li className='nav__item'>
                                {checkLinkToScroll() ? (
                                    <Link
                                        className='nav__link'
                                        activeClass='active'
                                        to='list-movie__wrap'
                                        spy={true}
                                        smooth={true}
                                        offset={-140}
                                        duration={500}
                                        href=''
                                    >
                                        Book ticket
                                    </Link>
                                ) : (
                                    <NavLink
                                        activeClassName='active'
                                        exact
                                        className='nav__link'
                                        to='/home-list-movie'
                                    >
                                        Book ticket
                                    </NavLink>
                                )}
                            </li>
                            <li className='nav__item'>
                                {checkLinkToScroll() ? (
                                    <Link
                                        className='nav__link'
                                        activeClass='active'
                                        to='app'
                                        spy={true}
                                        smooth={true}
                                        offset={-120}
                                        duration={500}
                                        href=''
                                    >
                                        Mobile application
                                    </Link>
                                ) : (
                                    <NavLink
                                        activeClassName='active'
                                        exact
                                        className='nav__link'
                                        to='/home-app'
                                    >
                                        Mobile application
                                    </NavLink>
                                )}
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className='navbar__right'>
                    {isLogin()}
                    <div
                        className='navbar__right__location'
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <i className='navbar__right__location-icon fas fa-map-marker-alt' />
                        <p className='navbar__right__location-text'>
                            {location}
                        </p>
                        <i className='navbar__right__location-dropdown-icon fa fa-chevron-down' />
                        {isOpen === true ? (
                            <Dropdown
                                setIsOpen={setIsOpen}
                                setLocation={setLocation}
                            />
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
}
