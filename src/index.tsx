import { StrictMode } from 'react';
import { render } from 'react-dom';
import Router from './router';
import './index.less';

render(
  <StrictMode>
    <Router />
  </StrictMode>,
  document.getElementById('root')
);
