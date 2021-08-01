import React from 'react';
import ReactDOM from 'react-dom';

import "@babel/polyfill";

import AppLayout from './components/AppLayout';

const App = () => {

  return (<AppLayout />);
}

ReactDOM.render(<App />, document.getElementById('root'));