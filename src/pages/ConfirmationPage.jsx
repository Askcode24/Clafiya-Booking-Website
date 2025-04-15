import { useLocation } from 'react-router-dom';
import './ConfirmationPage.css';

function ConfirmationPage() {
	const location = useLocation();
	const formData = location.state?.formData;

	if (!formData) {
		return <p>No appointment details found.</p>;
	}

	return (
		<div className='confirmation-container'>
			<h2>Appointment Confirmed</h2>
			<p>
				<strong>Date:</strong> {formData.date}
			</p>
			<p>
				<strong>Time:</strong> {formData.time}
			</p>
			<p>
				<strong>Address:</strong> {formData.address}
			</p>
			<p>
				<strong>Name:</strong> {formData.first_name} {formData.last_name}
			</p>
			<p>
				<strong>Email:</strong> {formData.email}
			</p>
			<p>
				<strong>Phone:</strong> {formData.phone_number}
			</p>
			<p>
				<strong>Delivery Type:</strong> {formData.pickup_type}
			</p>
			<p>
				<strong>Payment Method:</strong> {formData.payment_method}
			</p>
			<button className='btn' onClick={() => navigate('/')}>
				Go Back to Booking
			</button>
		</div>
	);
}

export default ConfirmationPage;
