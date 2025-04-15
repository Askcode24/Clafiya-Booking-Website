import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL;

export const registerUser = async (userData) => {
	return await axios.post(
		`http://integration-staging.clafiya.com/docs/api/register`,
		userData
	);
};

export const loginUser = async (userData) => {
	return await axios.post(
		`http://integration-staging.clafiya.com/docs/api/login`,
		userData
	);
};
