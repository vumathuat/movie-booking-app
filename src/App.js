import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { routerHome } from './routes';
import HomeTemplate from './containers/User';
import Login from './containers/User/login/Login';
import SignUp from './containers/User/sign-up/SignUp';
import Checkout from './containers/User/checkout/Checkout';

const showMenuHome = (routes) => {
    if (routes && routes.length > 0) {
        return routes.map((item, index) => {
            return (
                <HomeTemplate
                    key={index}
                    path={item.path}
                    exact={item.exact}
                    Component={item.component}
                    scroll={item.scroll}
                ></HomeTemplate>
            );
        });
    }
};

function App() {
    return (
        <Router>
            <Switch>
                {showMenuHome(routerHome)}
                <Route path='/login' component={Login} />
                <Route path='/sign-up' component={SignUp} />
                <Route path='/checkout/:id' component={Checkout} />
            </Switch>
        </Router>
    );
}

export default App;
