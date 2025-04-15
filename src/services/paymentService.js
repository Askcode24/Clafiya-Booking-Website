import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const makePayment = async (paymentData) => {
	return await axios.post(
		`${import.meta.env.REACT_APP_API_UR}/payment`,
		paymentData
	);
};
// Compare this snippet from src/services/authService.js:
