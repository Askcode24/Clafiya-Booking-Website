import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const bookConsultation = async (bookingData) => {
	return await axios.post(
		`${import.meta.env.REACT_APP_API_UR}/book-consultation`,
		bookingData
	);
};
