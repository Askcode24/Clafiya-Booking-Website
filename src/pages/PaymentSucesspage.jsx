import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/button.css';

function PaymentSuccessPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const formData = location.state?.formData;

	return (
		<div>
			<h2>Payment Successful</h2>
			<p>
				Thank you for your payment, {formData.first_name} {formData.last_name}!
			</p>
			<button className='btn' onClick={() => navigate('/')}>
				Go Back to Booking
			</button>
		</div>
	);
}

export default PaymentSuccessPage;
