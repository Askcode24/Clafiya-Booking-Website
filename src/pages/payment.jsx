const Payment = () => {
	const handlePayment = async () => {
		const response = await fetch(
			`${import.meta.env.REACT_APP_API_UR}/payments`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
				body: JSON.stringify({
					amount: 5000,
					currency: 'USD',
					consultationId: '9876',
				}),
			}
		);

		const data = await response.json();
		console.log('Payment Response:', data);
	};

	return (
		<div>
			<h2>Payment</h2>
			<button onClick={handlePayment}>Pay Now</button>
		</div>
	);
};

export default Payment;
