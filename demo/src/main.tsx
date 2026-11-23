import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './components/App';

import './styles/style.scss';

createRoot(document.querySelector('#root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
