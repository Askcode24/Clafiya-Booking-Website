import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './app';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Router>
			<h2>Clafiya Booking Webpage</h2>
			<h3>Welcome to Clafiya Consultation.</h3>
			<h4>
				Book a consultation with a doctor and manage your appointments easily.
			</h4>
			<App />
		</Router>
	</React.StrictMode>
);
