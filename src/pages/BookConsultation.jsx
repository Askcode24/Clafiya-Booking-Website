import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookingForm.css';

function BookingForm() {
	const [formData, setFormData] = useState({
		date: '',
		time: '',
		address: '',
		first_name: '',
		last_name: '',
		email: '',
		phone_number: '',
		payment_method: 'hsa',
		packages_type: '',
		pickup_type: '',
		test_type: '',
		packages_id: '',
		test_id: '',
		packages_price: 0,
		test_price: 0,
	});

	const [packages, setPackages] = useState([]);
	const [tests, setTests] = useState([]);
	const navigate = useNavigate();

	// Fetch packages and tests from the API
	useEffect(() => {
		const fetchPackages = async () => {
			try {
				const response = await fetch(
					'https://integration-staging.clafiya.com/api/v1/consultations/diagnostics/packages'
				);
				const data = await response.json();
				console.log('Packages:', data); // Debugging
				setPackages(data); // Assuming the API returns an array of packages
			} catch (error) {
				console.error('Error fetching packages:', error);
			}
		};

		const fetchTests = async () => {
			try {
				const response = await fetch(
					'https://integration-staging.clafiya.com/api/v1/consultations/diagnostics/tests'
				);
				const data = await response.json();
				console.log('Tests:', data); // Debugging
				setTests(data); // Assuming the API returns an array of tests
			} catch (error) {
				console.error('Error fetching tests:', error);
			}
		};

		fetchPackages();
		fetchTests();
	}, []);

	const handleChange = (e) => {
		try {
			setFormData({ ...formData, [e.target.name]: e.target.value });
		} catch (error) {
			console.error('Error updating form data:', error);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const totalAmount = formData.packages_price + formData.test_price;

		const payload = {
			date: formData.date,
			time: formData.time,
			address: formData.address,
			customer_id: 0,
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
				'https://integration-staging.clafiya.com/api/v1/consultations/diagnostics',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
					},
					body: JSON.stringify(payload),
				}
			);
			const data = await response.json();
			console.log(data);
			alert('Appointment booked successfully!');
		} catch (error) {
			console.error(error);
			alert('Failed to book appointment');
		}
	};

	return (
		<>
			<h2>Clafiya Booking Webpage</h2>
			<h3>Welcome to Clafiya Consultation.</h3>
			<h4>
				Book a consultation with a doctor and manage your appointments easily.
			</h4>
			<form className='booking-form' onSubmit={handleSubmit}>
				<label htmlFor='appointment_data'>
					<strong>Appointment Data</strong>
				</label>
				<label htmlFor='date'>Appointment Date</label>
				<input
					className='date_time'
					type='date'
					name='date'
					onChange={handleChange}
					required
				/>
				<label htmlFor='time'>Appointment Time</label>
				<input
					className='date_time'
					type='time'
					name='time'
					onChange={handleChange}
					required
				/>
				<input
					type='text'
					name='address'
					placeholder='Address'
					onChange={handleChange}
					required
				/>
				<select
					className='select'
					name='payment_method'
					onChange={handleChange}
					required>
					<option value='hsa'>HSA</option>
					<option value='credit_card'>Credit Card</option>
					<option value='paypal'>PayPal</option>
				</select>
				<input
					type='text'
					name='first_name'
					placeholder='First Name'
					onChange={handleChange}
					required
				/>
				<input
					type='text'
					name='last_name'
					placeholder='Last Name'
					onChange={handleChange}
					required
				/>
				<input
					type='email'
					name='email'
					placeholder='Email'
					onChange={handleChange}
					required
				/>
				<input
					type='tel'
					name='phone_number'
					placeholder='Phone Number'
					onChange={handleChange}
					required
				/>
				<label htmlFor='packages_type'>Packages Type</label>
				<select
					className='select'
					name='packages_type'
					onChange={handleChange}
					required>
					<option value=''>Select a package</option>
					{packages.length > 0 ? (
						packages.map((pkg) => (
							<option key={pkg.id} value={pkg.type}>
								{pkg.type}
							</option>
						))
					) : (
						<option disabled>Loading packages...</option>
					)}
				</select>
				<label htmlFor='test_type'>Test Type</label>
				<select className='select' name='test_type' onChange={handleChange}>
					<option value=''>Select a test</option>
					{tests.length > 0 ? (
						tests.map((test) => (
							<option key={test.id} value={test.type || test.name}>
								{test.type || test.name}
							</option>
						))
					) : (
						<option disabled>Loading tests...</option>
					)}
					{/* {tests.map((test) => (
						<option key={test.id} value={test.type || test.name}>
							{test.type || test.name}
						</option>
					))} */}
				</select>
				<label htmlFor='pickup_type'>Delivery Type</label>
				<select className='select' name='pickup_type' onChange={handleChange}>
					<option value='Pickup'>Pickup</option>
					<option value='Delivery'>Delivery</option>
					<option value='Walking'>Walking</option>
				</select>
				<button type='submit'>Proceed to Booking</button>
			</form>
		</>
	);
}

export default BookingForm;
