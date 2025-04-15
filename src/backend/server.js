import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();
const app = express();
const port = 5000;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

// Route to create a Stripe Checkout session
app.post('/create-checkout-session', async (req, res) => {
	try {
		const { amount, email } = req.body;
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [
				{
					price_data: {
						currency: 'usd',
						product_data: { name: 'Consultation' },
						unit_amount: amount * 100,
					},
					quantity: 1,
				},
			],
			mode: 'payment',
			success_url: 'http://localhost:5173/PaymentSuccesspage',
			cancel_url: 'http://localhost:5173/payment',
			customer_email: email,
		});
		res.json({ sessionUrl: session.url });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Route to create a Payment Intent for embedded payment
app.post('/create-payment-intent', async (req, res) => {
	try {
		const { amount, email } = req.body;
		const paymentIntent = await stripe.paymentIntents.create({
			amount: amount * 100,
			currency: 'usd',
			payment_method_types: ['card'],
			receipt_email: email,
		});
		res.json({ clientSecret: paymentIntent.client_secret });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
