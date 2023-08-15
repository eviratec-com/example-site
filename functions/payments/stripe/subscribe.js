module.exports = function (stripe, plans) {
  const PLANS = {...plans};

  const createCard = require('./createCard')(stripe);
  const createCustomer = require('./createCustomer')(stripe);
  const createSubscription = require('./createSubscription')(stripe);

  return async function subscribe (customer, address, card, plan) {
    const cust = await createCustomer(customer, address);

    const source = await createCard(cust.id, address, card);

    const subscription = await createSubscription(
      cust.id,
      source.id,
      PLANS[plan]
    );

    return subscription;
  }
}
