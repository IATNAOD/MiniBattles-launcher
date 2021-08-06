import React, { useEffect, useState } from 'react';
import { Route, Switch, Redirect } from 'react-router';
import { HashRouter } from 'react-router-dom';

import storage from 'electron-json-storage'

import { ipcRenderer } from 'electron'
import { CURRENT } from '../../../store/actions/user';

import Header from '../Header';
import HomePage from '../../pages/Home';
import LoginPage from '../../pages/Login';
import RegistrationPage from '../../pages/Registration';
import NotFoundPage from '../../pages/NotFound';

const RestrictAccessRoute = ({ exact, path, render, forAuth = true, auth, to }) => forAuth && auth ? <Route exact={exact} path={path} render={render} /> : !forAuth && !auth ? <Route exact={exact} path={path} render={render} /> : `#${path}` == location.hash ? <Redirect to={to} /> : null;

export default ({

}) => {
  const [User, UserChange] = useState(null)

  useEffect(() => {

    if (!User) {
      let localUser = storage.getSync('user');

      if (localUser.token)
        ipcRenderer.send(CURRENT, localUser.token)
    }

    ipcRenderer.on(CURRENT, (e, data) => {

      if (data.data && data.data.success)
        storage.set('user', { ...storage.getSync('user'), ...data.data.user }, function (error) {

          if (error)
            throw error;
          else
            UserChange(storage.getSync('user'))

        });
      else
        storage.remove('user')
    })

    return () => {

      ipcRenderer.removeListener(CURRENT, (e, data) => {
        if (data.data && data.data.success)
          storage.set('user', { ...storage.getSync('user'), ...data.data.user }, function (error) {

            if (error)
              throw error;
            else
              UserChange(storage.getSync('user'))

          });
        else
          storage.remove('user')
      })

    }

  }, [])

  return (
    <div className="app-layout">

      <Header />

      <HashRouter>
        <Switch>
          <RestrictAccessRoute exact={true} path="/" render={() => <HomePage User={User} />} forAuth={true} auth={User} to={'/login'} />
          <RestrictAccessRoute exact={true} path="/login" render={() => <LoginPage />} forAuth={false} auth={User} to={'/'} />
          <RestrictAccessRoute exact={true} path="/registration" render={() => <RegistrationPage />} forAuth={false} auth={User} to={'/'} />

          <Route render={() => <NotFoundPage />} />
        </Switch>
      </HashRouter>

    </div >

  )

}