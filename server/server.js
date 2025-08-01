// server/server.js
require('dotenv').config();
const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const checkr = require('checkr')(process.env.CHECKR_API_KEY);
const cors = require('cors');

// Middlewares
app.use(express.json());
// Allow requests from your Vite development server
app.use(cors({ origin: 'http://localhost:5173' }));

// --- Stripe Integration ---
const calculateOrderAmount = (items) => {
  return 1400; // $14.00
};

app.post('/create-payment-intent', async (req, res) => {
  const { items } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

// --- Checkr Integration ---
app.post('/create-checkr-invitation', async (req, res) => {
  const { candidateData } = req.body;
  try {
    const candidate = await checkr.candidates.create({
      first_name: candidateData.firstName,
      last_name: candidateData.lastName,
      email: candidateData.email,
    });
    const invitation = await checkr.invitations.create({
      candidate_id: candidate.id,
      package: 'driver_pro',
    });
    res.send({ invitationUrl: invitation.invitation_url });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

const PORT = 4242;
app.listen(PORT, () => console.log(`Node server listening on port ${PORT}!`));