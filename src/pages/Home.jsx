import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import '../styles/button.css';

const Home = () => {
	const navigate = useNavigate();

	useEffect(() => {
		navigate('/BookConsultation.jsx');
	}, [navigate]);

	// Functionality moved: Remove handleBooking from Home

	return (
		<div className='container'>
			<h2>Welcome to Clafiya Consultation</h2>
			<p>
				Book a consultation with a doctor and manage your appointments easily.
			</p>
			<div>{/* Removed Login and Register buttons */}</div>
		</div>
	);
};

export default Home;
