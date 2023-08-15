module.exports = function (stripe) {
  return async function createCard (customer, address, data) {
    const {
      number, // Card number
      exp_month, // Two-digit number representing card's expiration month
      exp_year, // Two- or four-digit number representing card's expiration year
      cvc, // Card security code

      name,  // The customer's display name
    } = data;

    const {
      line1,
      line2,
      city,
      state,
      zip,
      country,
    } = address;

    const source = await stripe.customers.createSource(
      customer,
      {
        source: {
          object: 'card',
          number, // Card number
          exp_month, // Two-digit number representing card's expiration month
          exp_year, // Two- or four-digit number representing card's expiration year
          cvc, // Card security code

          name, // Cardholder's full name

          address_line1: line1,
          address_line2: line2,
          address_city: city,
          address_state: state,
          address_zip: zip,
          address_country: country,
        }
      }
    );

    return source;
  }
}
