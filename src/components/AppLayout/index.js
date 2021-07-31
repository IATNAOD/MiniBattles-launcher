import React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import { HashRouter } from 'react-router-dom';

import Header from '../Header';
import HomePage from '../../pages/Home';
import LoginPage from '../../pages/Login';
import RegistrationPage from '../../pages/Registration';
import NotFoundPage from '../../pages/NotFound';

const RestrictAccessRoute = ({ exact, path, render, forAuth = true, auth, to }) => forAuth && auth ? <Route exact={exact} path={path} render={render} /> : !forAuth && !auth ? <Route exact={exact} path={path} render={render} /> : `#${path}` == location.hash ? <Redirect to={to} /> : null;

export default ({

}) => {

  return (
    <div className="app-layout">

      <Header />

      <HashRouter>
        <Switch>
          <RestrictAccessRoute exact={true} path="/" render={() => <HomePage />} forAuth={true} auth={false} to={'/login'} />
          <RestrictAccessRoute exact={true} path="/login" render={() => <LoginPage />} forAuth={false} auth={false} to={'/'} />
          <RestrictAccessRoute exact={true} path="/registration" render={() => <RegistrationPage />} forAuth={false} auth={false} to={'/'} />

          <Route render={() => <NotFoundPage />} />
        </Switch>
      </HashRouter>

    </div >

  )

}