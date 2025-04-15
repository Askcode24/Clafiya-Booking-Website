// src/components/PaymentPage.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
	Elements,
	CardElement,
	useStripe,
	useElements,
} from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';
// import './styles/global.css';
import '../styles/button.css';

const stripePromise = loadStripe(
	'pk_test_51QsoDy2MqMx3UsQuzgnbWB1b8GcnLFLIYlmAyRktYQ1lK2W3hjFtedgymvEyCsXPYd634SbZnm8Bj24PimbHgQwN009siZi4sp'
);

function PaymentPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const formData = location.state?.formData;
	const [useEmbeddedForm, setUseEmbeddedForm] = useState(false);
	const [paymentAccount, setPaymentAccount] = useState(null);
	const totalAmount = formData.packages_price + formData.test_price;

	useEffect(() => {
		async function fetchPaymentAccount() {
			try {
				const response = await fetch(
					`https://integration-staging.clafiya.com/api/v1/consultations/${formData.consultation}/payment-account`,
					{
						method: 'GET',
						headers: { Accept: 'application/json' },
					}
				);
				const data = await response.json();
				setPaymentAccount(data);
			} catch (error) {
				console.error('Error fetching payment account:', error);
			}
		}
		if (formData?.consultation) {
			fetchPaymentAccount();
		}
	}, [formData]);

	const handleCheckoutRedirect = async () => {
		try {
			const response = await fetch(
				'http://localhost:5000/create-checkout-session',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email: formData.email }),
				}
			);
			const { sessionUrl } = await response.json();
			window.location.href = sessionUrl;
		} catch (error) {
			console.error(error);
			alert('Error redirecting to checkout');
		}
	};

	return (
		<div>
			<h2>Complete Your Payment</h2>

			{formData && (
				<div>
					<p>
						<strong>Amount:</strong> #{totalAmount}
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
					<button className='btn' onClick={() => navigate('/')}>
						Go Back to Booking
					</button>
				</div>
			)}
			{paymentAccount && <p>Payment Account: {paymentAccount.account_id}</p>}
			<button
				className='btn'
				onClick={() => setUseEmbeddedForm(!useEmbeddedForm)}>
				{useEmbeddedForm ? 'Use Stripe Checkout' : 'Use Embedded Form'}
			</button>
			{useEmbeddedForm ? (
				<Elements stripe={stripePromise}>
					<EmbeddedPaymentForm formData={formData} navigate={navigate} />
				</Elements>
			) : (
				<button className='btn' onClick={handleCheckoutRedirect}>
					Pay with Stripe Checkout
				</button>
			)}
		</div>
	);
}

function EmbeddedPaymentForm({ formData, navigate }) {
	const stripe = useStripe();
	const elements = useElements();
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		if (!stripe || !elements) return;

		const response = await fetch(
			'http://localhost:5000/create-payment-intent',
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ amount: totalAmount, email: formData.email }),
			}
		);
		const { clientSecret } = await response.json();

		const result = await stripe.confirmCardPayment(clientSecret, {
			payment_method: { card: elements.getElement(CardElement) },
		});

		if (result.error) {
			alert(result.error.message);
		} else {
			navigate('/payment-success', { state: { formData } });
		}
		setLoading(false);
	};

	return (
		<form onSubmit={handleSubmit}>
			<CardElement className='card' />
			<button className='btn' type='submit' disabled={!stripe || loading}>
				{loading ? 'Processing...' : 'Pay Now'}
			</button>
		</form>
	);
}

export default PaymentPage;
