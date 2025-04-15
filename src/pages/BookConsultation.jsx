import { useState } from 'react';
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
		// appointment_type: '',
		payment_method: 'hsa',
		packages_type: '',
		pickup_type: '',
		test_type: '',
		packages_id: '',
		test_id: '',
		packages_price: 0,
		test_price: 0,
	});

	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		if (e.target.name === 'packages_type') {
			// Update package price based on selected package type
			switch (e.target.value) {
				case 'Check up':
					setFormData({ ...formData, packages_price: 50000 });
					break;
				case 'Diagnostics':
					setFormData({ ...formData, packages_price: 20000 });
					break;
				case 'Blood Test':
					setFormData({ ...formData, packages_price: 10000 });
					break;
				case 'Therapy':
					setFormData({ ...formData, packages_price: 100000 });
					break;
				case 'Autospy':
					setFormData({ ...formData, packages_price: 150000 });
					break;
				// Add more cases for other package types
				default:
					break;
			}
		} else if (e.target.name === 'test_type') {
			// Update test price based on selected test type
			switch (e.target.value) {
				case 'Blood Type':
					setFormData({ ...formData, test_price: 10000 });
					break;
				case 'Pregnancy Test':
					setFormData({ ...formData, test_price: 10000 });
					break;
				case 'DNA Test':
					setFormData({ ...formData, test_price: 95000 });
					break;
				case 'HIV/AIDS Test':
					setFormData({ ...formData, test_price: 30000 });
					break;

				// Add more cases for other test types
				default:
					break;
			}
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		// const packagesPrice = getPackagePrice(formData.packages_type);
		// const testPrice = getTestPrice(formData.test_type);
		// const totalAmount = packagesPrice + testPrice;

		const totalAmount = formData.packages_price + formData.test_price;
		/* navigate('/payment', { state: { formData, totalAmount } }); */

		navigate('/payment', { state: { formData, totalAmount } });

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
		<form className='booking-form' onSubmit={handleSubmit}>
			<label htmlFor='appointment_data'>
				<strong>Appointment Data</strong>
			</label>
			<input type='date' name='date' onChange={handleChange} required />
			<input type='time' name='time' onChange={handleChange} required />
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
			<label htmlFor='test'>Packages Type</label>
			<select
				className='select'
				name='packages_type'
				onChange={handleChange}
				required>
				<option value='Check up'>Check up</option>
				<option value='Diagnostics'>Diagnostics</option>
				<option value='Blood Test'>Blood Test</option>
				<option value='Therapy'>Therapy</option>
				<option value='Autospy'>Autospy</option>
			</select>
			<label htmlFor='test_type'>Test Type</label>
			<select className='select' name='test_type' onChange={handleChange}>
				<option value='Blood Type'>Blood Type</option>
				<option value='Pregnancy Test'>Pregnancy Test</option>
				<option value='DNA Test'>DNA Test</option>
				<option value='HIV/AIDS Test'>HIV/AIDS Test</option>
			</select>
			<label htmlFor='pickup_type'>Delivery Type</label>
			<select className='select' name='pickup_type' onChange={handleChange}>
				<option value='Pickup'>Pickup</option>
				<option value='Delivery'>Delivery</option>
				<option value='Walking'>Walking</option>
			</select>
			<button type='submit'>Proceed to Booking</button>
		</form>
	);
}

export default BookingForm;
