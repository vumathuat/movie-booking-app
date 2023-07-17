import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';
import Navbar from '../../components/User/Navbar';

const HomeLayout = (props) => {
    return (
        <Fragment>
            <Navbar history={props.children.props.history} />
            {/* <Sidebar /> */}
            {props.children}
            {/* Nhận lại thẻ Component */}
        </Fragment>
    );
};

const HomeTemplate = ({ Component, ...props }) => {
    return (
        <Route
            {...props} // Nhận lại props từ cha truyền vào
            render={(propsComponent) => {
                return (
                    <HomeLayout>
                        <Component {...propsComponent} scroll={props.scroll} />
                    </HomeLayout>
                );
            }}
        />
    );
};

export default HomeTemplate;
