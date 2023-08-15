module.exports = function (stripe) {
  return async function createSetupIntent (customerId) {
    const setupIntent = await stripe.setupIntents.create({
      usage: 'off_session',
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return setupIntent;
  }
}
