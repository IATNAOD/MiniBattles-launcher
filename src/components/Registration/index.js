import './styles.css'
import React from 'react';
import { Link } from 'react-router-dom';

export default () => {

  React.useEffect(() => {

    // electron.store.registerAccount({
    //   username: 'test',
    //   email: 'test@mail.ru',
    //   password: '123QWEasd',
    //   repeatPassword: '123QWEasd',
    // })


  }, [])

  return (
    <div className={'registration-wrapper'}>
      <form className="registration-form">
        <h4 className={'title'}>Regestration</h4>
        <input type="text" placeholder={'Enter your username'} className={'registration-input'} required />
        <input type="email" placeholder={'Enter your email'} className={'registration-input'} required />
        <input type="password" placeholder={'Enter your password'} className={'registration-input'} required />
        <input type="password" placeholder={'Repeat your password'} className={'registration-input'} required />
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