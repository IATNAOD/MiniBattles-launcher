import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import storage from 'electron-json-storage'

import { ipcRenderer } from 'electron'
import { AUTHTORIZE, CURRENT } from '../../../store/actions/user';

import './styles.css'

export default () => {
  const [User, UserChange] = useState({
    login: '',
    password: ''
  })

  useEffect(() => {

    ipcRenderer.on(AUTHTORIZE, (e, data) => {

      if (data.data && data.data.success)
        storage.set('user', { ...storage.getSync('user'), token: data.data.token }, function (error) {

          if (error)
            throw error;
          else
            ipcRenderer.send(CURRENT, data.data.token)

        });

    })

    return () => {
      ipcRenderer.removeAllListeners(AUTHTORIZE)
    }

  }, [])

  const authtorizeAccount = (e) => {

    e.preventDefault();

    ipcRenderer.send(AUTHTORIZE, User)

  }

  return (
    <div className={'login-wrapper'}>
      <form className="login-form" onSubmit={authtorizeAccount}>
        <h4 className={'title'}>Authtorization</h4>
        <input type="text" value={User.login} onChange={e => UserChange({ ...User, login: e.target.value })} placeholder={'Enter your login'} className={'login-input'} required />
        <input type="password" value={User.password} onChange={e => UserChange({ ...User, password: e.target.value })} placeholder={'Enter your password'} className={'login-input'} required />
        <button className={'login-button'} type={'submit'}>
          Login
        </button>
        <span className={'regestration-link'}>
          Don't you have an account yet? <Link to={'/registration'}>Create it</Link>
        </span>
      </form>
    </div>
  );

};