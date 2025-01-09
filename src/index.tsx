import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router} from 'react-router-dom';

const rootElement = document.getElementById('root');

// Ensure `rootElement` is not null
if (!rootElement) {
  throw new Error("Root element not found. Ensure there is a div with id 'root' in your HTML.");
}

const root = ReactDOM.createRoot(rootElement);
root.render(

  <Router>
      <App/>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
