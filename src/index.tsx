import React from 'react';
import { render } from 'react-dom';
import Router from './router';
import './index.less';

window.addEventListener('unhandledrejection', (e) => {
  e.preventDefault();
  console.log('捕获到异常：', e);
  return true;
});


render(<Router />, document.getElementById('root'));
