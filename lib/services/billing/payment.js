'use strict';

function Payment(gateway) {
  this.gateway = gateway;
}

Payment.prototype.createToken = function (creditCard) {
  return this.gateway.tokens.create({
    card: creditCard
  });
};

// CREATE Payment Gateway CC token
// CREATE Payment Gateway Account from CC token
// ASSIGN new acount to customer and return that customer
Payment.prototype.createAccountToCustomer = function (creditCard, customer) {
  return this.createToken(creditCard)
    .then((token) => {
      return this.createAccount(customer, token.id);
    })
    .then((gatewayAccount) => {
      customer.stripeAccount = gatewayAccount.id;
      return customer;
    });
};

Payment.prototype.createAccount = function (customer, stripeToken) {
  return this.gateway.customers.create({
    email: customer.email,
    card: stripeToken
  });
};

Payment.prototype.createSubscription = function (customer) {
  return this.gateway.subscriptions.create({
      customer: customer.stripeAccount,
      plan: customer.plan
    })
    .then((subscription) => {
      customer.stripeSubscription = subscription.id;
      return customer;
    });
};

Payment.prototype.refund = function (customer, order) {
  return order.totalPrice()
    .then((amount) => {
      return this.gateway.customers.update(customer.stripeAccount, {
        account_balance: -amount,
        description: `${amount} credited to customer`
      });
    });
};

Payment.prototype.charge = function (customer, order) {
  return order.totalPrice()
    .then((amount) => {
      return this.gateway.charges.create({
        amount: amount,
        currency: 'usd',
        customer: customer.stripeAccount
      });
    });
};

Payment.prototype.getCharges = function (customer) {
  return this.gateway.charges.list({
    customer: customer.stripeAccount
  });
};

module.exports = Payment;
