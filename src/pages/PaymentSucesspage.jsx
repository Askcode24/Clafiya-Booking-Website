import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/button.css';
import '../styles/global.css';

function PaymentSuccessPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const formData = location.state?.formData;
	console.log('Location state:', location.state);

	const currentHour = new Date().getHours();
	let greeting = '';

	if (currentHour < 12) {
		greeting = 'Good Morning';
	} else if (currentHour < 18) {
		greeting = 'Good Afternoon';
	} else {
		greeting = 'Good Evening';
	}

	if (!formData) {
		return (
			<div className='success-container error_success'>
				<h2>No appointment details available.</h2>
				<button
					className='btn'
					onClick={() => navigate(-1, { state: { formData } })}>
					Go Back to Booking Form
				</button>
			</div>
		);
	}

	return (
		<div className='success-container'>
			<h2>Apointment Confirmed with Clafiya Consultation!</h2>
			<p className='success-message'>
				<strong>
					Your appointment has been successfully confirmed. We will contact you
					shortly with further details.
				</strong>{' '}
				<br />
				<strong>
					{greeting}, {formData.first_name} {formData.last_name}! We appreciate
					your trust in our services.
				</strong>
			</p>
			<button className='btn' onClick={() => navigate('/')}>
				Go Back to Booking
			</button>
		</div>
	);
}

export default PaymentSuccessPage;
