import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
	const [consultations, setConsultations] = useState([]);
	const navigate = useNavigate();
	const token = localStorage.getItem('token');

	useEffect(() => {
		if (!token) {
			navigate('/login');
			return;
		}

		fetch(`${import.meta.env.REACT_APP_API_UR}/user/consultations`, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then((data) => setConsultations(data))
			.catch((err) => console.error('Error fetching consultations:', err));
	}, [token, navigate]);

	return (
		<div>
			<h2>Your Dashboard</h2>
			{consultations.length === 0 ? (
				<p>No consultations booked yet.</p>
			) : (
				<ul>
					{consultations.map((c) => (
						<li key={c.id}>
							{c.date} at {c.time} with Doctor {c.doctorId} - Status: {c.status}
						</li>
					))}
				</ul>
			)}
			<button onClick={() => navigate('/book')}>Book a Consultation</button>
		</div>
	);
};

export default Dashboard;
