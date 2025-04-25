import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../styles/button.css';

function PaymentPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const formData = location.state?.formData; // Retrieve formData from state
	const [responseMessage, setResponseMessage] = useState('');
	const [responseStatus, setResponseStatus] = useState('');
	const { totalAmount } = location.state || {};
	const [loading, setLoading] = useState(false);

	// Handle payment submission
	const handleConfirm = async () => {
		setLoading(true); // Start loading

		const payload = {
			date: formData.date,
			time: formData.time,
			address: formData.address,
			payment_method: formData.payment_method,
			customer: {
				first_name: formData.first_name,
				last_name: formData.last_name,
				email: formData.email,
				phone_number: formData.phone_number,
			},
			packages: [
				{
					packages_price: formData.packages_price,
					packages_type: formData.packages_type,
					pickup_type: formData.pickup_type,
				},
			],
			tests: [
				{
					test_id: formData.test_id,
					test_type: formData.test_type,
					pickup_type: formData.pickup_type,
				},
			],
		};

		try {
			const response = await fetch(
				'https://integration-staging.clafiya.com/api/v1/consultations/diagnostics', // Payment API endpoint
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
						Authorization: `Bearer CLAF_tsk_86f8e37ea7764a7e0cd4c2cb94cb94e0`, // Replace with the actual token
					},
					body: JSON.stringify(payload),
				}
			);

			const data = await response.json();

			if (!response.ok) {
				// Extract error messages from the API response
				if (data.data) {
					const apiErrors = Object.keys(data.data)
						.map((field) => `${field}: ${data.data[field][0]}`)
						.join(', ');
					throw new Error(apiErrors);
				} else {
					throw new Error(data.message || 'Payment failed.');
				}
			}

			// If successful, navigate to the payment success page
			setResponseMessage('Payment successful!');
			setResponseStatus('success');
			setTimeout(() => {
				setLoading(false);
				navigate('/payment-success', { state: { formData } });
			}, 2000);
		} catch (error) {
			console.error('Error processing payment:', error);
			setResponseMessage(error.message || 'An error occurred during payment.');
			setResponseStatus('error');
			setLoading(false);
		}
	};

	return (
		<div>
			{/* Show response message */}
			{responseMessage && (
				<div
					style={{
						color: responseStatus === 'success' ? 'green' : 'red',
						marginTop: '20px',
					}}>
					<strong>{responseMessage}</strong>
				</div>
			)}
			<h2>Confirm Your Booking Form</h2>
			{/* Show loading message */}
			{loading && (
				<div style={{ color: 'blue', marginBottom: '20px' }}>
					<strong>Processing your payment, please wait...</strong>
				</div>
			)}

			{/* Show summary details when not loading */}
			{formData && !loading && (
				<div>
					<p>
						<strong>Amount:</strong> <strong>₦{totalAmount}</strong>
					</p>
					<h3>User Details</h3>
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
						<strong>Packages Type:</strong> {formData.packages_type}
					</p>
					<p>
						<strong>Test Type:</strong> {formData.test_type}
					</p>
					<p>
						<strong>Delivery Type:</strong> {formData.pickup_type}
					</p>
					<div className='button-group'>
						<button
							className='btn'
							onClick={() => navigate(-1, { state: { formData } })}>
							Go Back to Booking Form
						</button>
						<button className='btn' onClick={handleConfirm}>
							Confirm The Payment
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default PaymentPage;
