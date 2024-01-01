import React from 'react';
import App from './components/App.js';
import { createRoot } from 'react-dom/client';

const root = document.getElementById('root');

// Use createRoot to start rendering React content
const reactRoot = createRoot(root);

// Wrap your App component with reactRoot.render
reactRoot.render(<React.StrictMode><App /></React.StrictMode>);

