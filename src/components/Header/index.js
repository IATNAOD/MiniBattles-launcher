import React from 'react';

import { remote } from 'electron'

import './styles.css';

const CurrentMainWindow = remote.getCurrentWindow();

export default ({

}) => {

  const clsoeWindow = () => {
    CurrentMainWindow.hide();
  }

  const maximizeWindow = () => {
    if (!CurrentMainWindow.isMaximized()) {
      CurrentMainWindow.maximize();
    } else {
      CurrentMainWindow.unmaximize();
    }
  }

  const minimizeWindow = () => {
    CurrentMainWindow.minimize();
  }

  return (
    <div className={'header'}>
      <div className={'title'}>
        <span className={'name'}>
          Mini Battles
        </span>
        <span className={'version'}>
          {remote.app.getVersion()}
        </span>
      </div>
      <div
        className={'btn-hdr button-close'}
        onClick={clsoeWindow}
      >
        <svg aria-hidden="false" width="12" height="12" viewBox="0 0 12 12">
          <polygon fill="#fff" fillRule="evenodd" points="11 1.576 6.583 6 11 10.424 10.424 11 6 6.583 1.576 11 1 10.424 5.417 6 1 1.576 1.576 1 6 5.417 10.424 1" />
        </svg>
      </div>
      <div
        className={'btn-hdr button-max'}
        onClick={maximizeWindow}
      >
        <svg aria-hidden="false" width="12" height="12" viewBox="0 0 12 12">
          <rect width="9" height="9" x="1.5" y="1.5" fill="none" stroke="#fff" />
        </svg>
      </div>
      <div
        className={'btn-hdr button-min'}
        onClick={minimizeWindow}
      >
        <svg aria-hidden="false" width="12" height="12" viewBox="0 0 12 12">
          <rect fill="#fff" width="10" height="1" x="1" y="6" />
        </svg>
      </div>
    </div >

  )

}