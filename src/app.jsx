import { Routes, Route } from 'react-router-dom';
import BookingForm from './pages/BookConsultation';
import PaymentPage from './pages/Paymentpage';
import PaymentSuccessPage from './pages/PaymentSucesspage';
import './styles/global.css';
import './styles/button.css';

function App() {
	return (
		<div className='container'>
			<Routes>
				<Route path='/' element={<BookingForm />} />
				<Route path='/payment' element={<PaymentPage />} />
				<Route path='/payment-success' element={<PaymentSuccessPage />} />
			</Routes>
		</div>
	);
}

export default App;
