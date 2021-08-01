import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';

import './styles.css'

import { ipcRenderer } from 'electron'
import { REGISTER } from '../../../store/actions/user';

export default ({ }) => {
  const [isRegistered, isRegisteredChange] = useState(false)
  const [User, UserChange] = useState({
    username: '',
    email: '',
    password: '',
    repeatPassword: ''
  })

  useEffect(() => {

    ipcRenderer.on(REGISTER, (e, data) => {

      if (data.data && data.data.success) {
        isRegisteredChange(true)
      }

    })

    return () => {
      ipcRenderer.removeAllListeners(REGISTER)
    }

  }, [])

  const registerAccount = (e) => {

    e.preventDefault();

    ipcRenderer.send(REGISTER, User)

  }

  if (isRegistered)
    return <Redirect to={'/login'} />

  return (
    <div className={'registration-wrapper'}>
      <form className="registration-form" onSubmit={registerAccount}>
        <h4 className={'title'}>Regestration</h4>
        <input type="text" value={User.username} onChange={e => UserChange({ ...User, username: e.target.value })} placeholder={'Enter your username'} className={'registration-input'} required />
        <input type="email" value={User.email} onChange={e => UserChange({ ...User, email: e.target.value })} placeholder={'Enter your email'} className={'registration-input'} required />
        <input type="password" value={User.password} onChange={e => UserChange({ ...User, password: e.target.value })} placeholder={'Enter your password'} className={'registration-input'} required />
        <input type="password" value={User.repeatPassword} onChange={e => UserChange({ ...User, repeatPassword: e.target.value })} placeholder={'Repeat your password'} className={'registration-input'} required />
        <button className={'registration-button'} type={'submit'}>
          Create
        </button>
        <span className={'login-link'}>
          Do you already have an account? <Link to={'/login'}>Then log in</Link>
        </span>
      </form>
    </div>
  );

};