import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './redux/reducer'; // Asegúrate de que este import es correcto
import App from './App.jsx';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';

const store = createStore(rootReducer);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <Router>
                <App />
            </Router>

        </Provider>
    </React.StrictMode>,
);