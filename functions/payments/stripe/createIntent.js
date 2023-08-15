module.exports = function (stripe) {
  return async function createPaymentIntent (amount) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'aud',
      setup_future_usage: 'off_session',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent;
  }
}
