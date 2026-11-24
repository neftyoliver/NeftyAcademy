import { BookApp } from 'paragoniahex';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { library } from './library';
import './style.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BookApp library={library} />
  </StrictMode>,
);
