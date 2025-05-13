import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App1.jsx';

const base = import.meta.env.BASE_URL; // Use Vite's provided base URL

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={base}>
    <App />
  </BrowserRouter>
);
