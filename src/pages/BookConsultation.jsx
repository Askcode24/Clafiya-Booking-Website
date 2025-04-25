import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BookingForm.css';

function BookingForm() {
	// Initialize formData with data from location.state if available
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
	const [errors, setErrors] = useState({});
	// Fetch packages and tests
	useEffect(() => {
		const fetchPackages = async () => {
			const url =
				'https://integration-staging.clafiya.com/api/v1/consultations/diagnostics/packages';
			const options = {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer CLAF_tsk_86f8e37ea7764a7e0cd4c2cb94cb94e0`,
				},
			};

			try {
				const response = await fetch(url, options);
				const data = await response.json();
				setPackages(data.data);
			} catch (error) {
				console.error('Error fetching packages:', error);
			}
		};

		const fetchTests = async () => {
			const url =
				'https://integration-staging.clafiya.com/api/v1/consultations/diagnostics/tests';
			const options = {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer CLAF_tsk_86f8e37ea7764a7e0cd4c2cb94cb94e0`,
				},
			};

			try {
				const response = await fetch(url, options);
				const data = await response.json();
				setTests(data.data);
			} catch (error) {
				console.error('Error fetching tests:', error);
			}
		};

		fetchPackages();
		fetchTests();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		try {
			setFormData((prevFormData) => {
				let updatedData = { ...prevFormData, [name]: value };

				// If the user selects a package, update the package price
				if (name === 'packages_type') {
					const selectedPackage = packages.find(
						(pkg) => pkg.description === value || pkg.name === value
					);
					if (selectedPackage) {
						updatedData.packages_price = selectedPackage.price || 0; // Assuming the API response has a `price` field
						updatedData.packages_id = selectedPackage.id;
					}
				}

				// If the user selects a test, update the test price
				if (name === 'test_type') {
					const selectedTest = tests.find(
						(test) => test.description === value || test.name === value
					);
					if (selectedTest) {
						updatedData.test_price = selectedTest.price || 0; // Assuming the API response has a `price` field
						updatedData.test_id = selectedTest.id;
					}
				}

				return updatedData;
			});
		} catch (error) {
			console.error('Error updating form data:', error);
		}

		let error = '';
		if (name === 'date') {
			const today = new Date().toISOString().split('T')[0];
			if (value < today) {
				error = 'The date field must be a date after or equal to today.';
			}
		} else if (name === 'time') {
			const currentDate = new Date();
			const selectedDate = new Date(`${formData.date}T${value}`);
			// Check if the selected date is today
			const today = new Date().toISOString().split('T')[0];
			if (formData.date === today && selectedDate < currentDate) {
				error =
					'The time must be equal to or after the current time if the date is today.';
			}
		} else if (name === 'address') {
			if (value.trim() === '') {
				error = 'Address is required.';
			}
		} else if (name === 'first_name') {
			if (value.trim() === '') {
				error = 'First name is required.';
			}
		} else if (name === 'last_name') {
			if (value.trim() === '') {
				error = 'Last name is required.';
			}
		} else if (name === 'email') {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(value)) {
				error = 'Please enter a valid email address.';
			}
		} else if (name === 'phone_number') {
			const phoneRegex = /^[0-9]{10,15}$/;
			if (!phoneRegex.test(value)) {
				error = 'Please enter a valid phone number.';
			}
		} else if (name === 'packages_type') {
			if (value === '') {
				error = 'Package type is required.';
			}
		} else if (name === 'test_type') {
			if (value === '') {
				error = 'Test type is required.';
			}
		} else if (name === 'pickup_type') {
			if (value === '') {
				error = 'Pickup type is required.';
			}
		} else if (name === 'payment_method') {
			if (value === '') {
				error = 'Payment method is required.';
			}
		}

		// Update the errors state
		setErrors((prevErrors) => ({
			...prevErrors,
			[name]: error,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const totalAmount = formData.packages_price + formData.test_price;
		navigate('/payment', { state: { formData, totalAmount } });
	};

	return (
		<>
			{formData && (
				<div>
					<h2>Clafiya Booking Webpage</h2>
					<h3>Welcome to Clafiya Consultation.</h3>
					<h4>
						Book a consultation with a doctor and manage your appointments
						easily.
					</h4>

					<form className='booking-form' onSubmit={handleSubmit}>
						<label htmlFor='date'>Appointment Date</label>
						<input
							className='date_time'
							type='date'
							name='date'
							value={formData.date}
							onChange={handleChange}
							required
						/>
						{errors.date && <p className='error'>{errors.date}</p>}

						<label htmlFor='time'>Appointment Time</label>
						<input
							className='date_time'
							type='time'
							name='time'
							value={formData.time}
							onChange={handleChange}
							required
						/>
						{errors.time && <p className='error'>{errors.time}</p>}

						<label htmlFor='address'>Address</label>
						<input
							type='text'
							name='address'
							placeholder='Address'
							value={formData.address}
							onChange={handleChange}
							required
						/>
						{errors.address && <p className='error'>{errors.address}</p>}

						<label htmlFor='payment_method'>Payment Method</label>
						<select
							className='select'
							name='payment_method'
							value={formData.payment_method}
							onChange={handleChange}
							required>
							<option value=''>Select a payment method</option>
							<option value='hsa'>HSA</option>
							<option value='external'>External</option>
						</select>
						{errors.payment_method && (
							<p className='error'>{errors.payment_method}</p>
						)}

						<label htmlFor='first_name'>First Name</label>
						<input
							type='text'
							name='first_name'
							placeholder='First Name'
							value={formData.first_name}
							onChange={handleChange}
							required
						/>
						{errors.first_name && <p className='error'>{errors.first_name}</p>}

						<label htmlFor='last_name'>Last Name</label>
						<input
							type='text'
							name='last_name'
							placeholder='Last Name'
							value={formData.last_name}
							onChange={handleChange}
							required
						/>
						{errors.last_name && <p className='error'>{errors.last_name}</p>}

						<label htmlFor='email'>Email</label>
						<input
							type='email'
							name='email'
							placeholder='Email'
							value={formData.email}
							onChange={handleChange}
							required
						/>
						{errors.email && <p className='error'>{errors.email}</p>}

						<label htmlFor='phone_number'>Phone Number</label>
						<input
							type='tel'
							name='phone_number'
							placeholder='Phone Number'
							value={formData.phone_number}
							onChange={handleChange}
							required
						/>
						{errors.phone_number && (
							<p className='error'>{errors.phone_number}</p>
						)}

						<label htmlFor='packages_type'>Packages Type</label>
						<select
							className='select'
							name='packages_type'
							value={formData.packages_type}
							onChange={handleChange}
							required>
							<option value=''>Select a package</option>
							{packages.map((pkg) => (
								<option key={pkg.id} value={pkg.name}>
									{pkg.name} - ₦{pkg.price}
								</option>
							))}
						</select>
						{errors.packages_type && (
							<p className='error'>{errors.packages_type}</p>
						)}

						<label htmlFor='test_type'>Test Type</label>
						<select
							className='select'
							name='test_type'
							value={formData.test_type}
							onChange={handleChange}
							required>
							<option value=''>Select a test</option>
							{tests.map((test) => (
								<option key={test.id} value={test.name}>
									{test.name} - ₦{test.price}
								</option>
							))}
						</select>
						{errors.test_type && <p className='error'>{errors.test_type}</p>}

						<label htmlFor='pickup_type'>Pickup Type</label>
						<select
							className='select'
							name='pickup_type'
							value={formData.pickup_type}
							onChange={handleChange}
							required>
							<option value='pickup'>Pickup</option>
							<option value='delivery'>Delivery</option>
							<option value='walkin'>Walking</option>
						</select>
						{errors.pickup_type && (
							<p className='error'>{errors.pickup_type}</p>
						)}

						<button type='submit'>Proceed to Booking</button>
					</form>
					<div>
						<h3>Summary</h3>
						<p>
							<strong>Package Price:</strong> ₦{formData.packages_price || 0}
						</p>
						<p>
							<strong>Test Price:</strong> ₦{formData.test_price || 0}
						</p>
						<p>
							<strong>Total Price:</strong> ₦
							{(formData.packages_price || 0) + (formData.test_price || 0)}
						</p>
					</div>
				</div>
			)}
		</>
	);
}

export default BookingForm;
// API URL for packages: https://integration-staging.clafiya.com/api/v1/consultations/diagnostics/packages
