import { Link } from 'react-router-dom';
import '../styles/header.css';

const Header = () => {
	return (
		<header className='header'>
			<h1>Clafiya Consultation</h1>
			<nav>
				<Link to='/'>Home</Link>
				<Link to='/register'>Register</Link>
				<Link to='/login'>Login</Link>
			</nav>
		</header>
	);
};

export default Header;
