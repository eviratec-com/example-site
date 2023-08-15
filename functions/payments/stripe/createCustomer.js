module.exports = function (stripe) {
  return async function createCustomer (data, address) {
    const {
      email, // The customers email address
      user,  // The ESP user ID, e.g. 100000000
      name  // The customer's display name
      //site   // The subdomain + domain, e.g. bookclub.eviratecsocial.life
    } = data;

    const {
      city,
      country,
      line1,
      line2,
      zip,
      state
    } = address

    const metadata = {
      esp_user_id: user,
    }

    const customer = await stripe.customers.create({
      description: `ESP User: ${user}`,
      email,
      name,
      metadata,
      address: {
        city,
        country,
        line1,
        line2,
        postal_code: zip,
        state,
      },
    });

    return customer;
  }
}
