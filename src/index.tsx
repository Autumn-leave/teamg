import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';
const url = 'http://localhost:3000/dashboard';
// const domain = process.env.REACT_APP_AUTH0_DOMAIN;
// const client = process.env.REACT_APP_AUTH0_CLIENT_ID;
ReactDOM.render(
  <React.StrictMode>
   <Auth0Provider
   domain='dev-cyihn2rsss0wi5rc.us.auth0.com'
   clientId='10F5ZQ3n3sQgCb5IB2Fi3ro3pgaNgt2I'
   authorizationParams={{redirect_uri:window.location.origin + '/dashboard'}
  }
   >
   <App />
   </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();