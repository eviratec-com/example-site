module.exports = function (stripe) {
  return async function listSubscriptions (customer) {
    const {
      email, // The customers email address
      user,  // The ESP user ID, e.g. 100000000
      name,  // The customer's display name
      site   // The subdomain + domain, e.g. bookclub.eviratecsocial.life
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
      esp_site: site,
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customer,
      limit: 3,
    });

    return customer;
  }
}
