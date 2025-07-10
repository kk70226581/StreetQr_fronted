// Import Bootstrap first
import 'bootstrap/dist/css/bootstrap.min.css';

// React core imports
import React from 'react';
import ReactDOM from 'react-dom/client';

// App root component
import App from './App';

// Create root and render App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
