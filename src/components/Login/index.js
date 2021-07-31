import React from 'react';
import { Link } from 'react-router-dom';

import './styles.css'

export default () => {

  return (
    <div className={'login-wrapper'}>
      <form className="login-form">
        <h4 className={'title'}>Authtorization</h4>
        <input type="text" placeholder={'Enter your login'} className={'login-input'} required />
        <input type="password" placeholder={'Enter your password'} className={'login-input'} required />
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