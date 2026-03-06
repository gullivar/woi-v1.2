import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

console.log('React Entry Point Executing');

// Check for valid access token from URL query parameter
const params = new URLSearchParams(window.location.search);
const accessKey = params.get('k');
const validKey = import.meta.env.VITE_ACCESS_KEY;

const root = createRoot(document.getElementById('root')!);

if (!accessKey || accessKey !== validKey) {
  // Render access denied page
  root.render(
    <StrictMode>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          backgroundColor: '#f5f5f5',
          fontFamily: 'sans-serif',
        }}
      >
        <h1 style={{ color: '#333', marginBottom: '10px' }}>Access Denied</h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          You do not have permission to access this application.
        </p>
        <p style={{ color: '#999', fontSize: '12px', marginTop: '20px' }}>
          If you believe this is an error, please contact the administrator.
        </p>
      </div>
    </StrictMode>
  );
} else {
  // Render the app if token is valid
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
