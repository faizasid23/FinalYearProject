/***************************************************************************************
*    Title: Building a Storefront using Context API in React
*    Author: Olusegun Bobate
*    Date: 2022
*    Code version: 2.0
*    Availability: https://codewithshegzi.hashnode.dev/building-a-storefront-using-context-api-in-react
*
***************************************************************************************/


import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
