'use strict';

let fixtures = require('../helper/fixtures');
let Customer = require('../../lib/models/customer');
let Order = require('../../lib/models/order');
let Detail = require('../../lib/models/detail');
let Product = require('../../lib/models/product');
let Promise = require("bluebird");
let _ = require('lodash');

let stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
let Payment = require('../../lib/services/billing/payment');
let paymentService = new Payment(stripe);

let customers = [];

const creditCard = {
  number: '4242424242424242',
  exp_month: 12,
  exp_year: new Date().getFullYear() + 1,
  cvc: '125'
};

describe('Payment Flow', function () {
  beforeEach(() => {
    let promisedCutomersSave = fixtures.customers.map((customer) => {
      // GENERATE "unique" email
      let email = `${Date.now()}-${customer.email}`;
      let newCustomer = new Customer(customer.fullName, email, customer.plan);
      return newCustomer.save();
    });
    return Promise.all(promisedCutomersSave)
      .then((customers) => {
        let promisedCustomerWithAccount = customers.map((customer) => {
          return paymentService.createAccountToCustomer(creditCard, customer);
        });
        return Promise.all(promisedCustomerWithAccount);
      })
      .then((customers) => {
        promisedCutomersSave = customers.map((customer) => customer.save());
        return Promise.all(promisedCutomersSave);
      })
      .then((dbCustomers) => {
        customers = dbCustomers;
      });
  });

  it('should have stripe account', function () {
    customers.forEach((customer) => {
      expect(customer.stripeAccount).to.exist;
    });
  });

  it('we can charge stripe account', function () {
    let order = new Order();
    // Emulate order's total price calculation so we ensure given a customer and
    // a order we charge the correct price
    let stubOrder = sinon.stub(order, 'totalPrice')
      .returns(new Promise((resolve) => {
        resolve(2000);
      }));
    let promisedCharges = customers.map((customer) => {
      return paymentService.charge(customer, order);
    });
    return Promise.all(promisedCharges)
      .then((charges) => {
        charges.forEach((charge) => {
          expect(charge.amount).to.equal(2000);
          expect(charge.currency).to.equal('usd');
          expect(charge.paid).to.equal(true);
          expect(charge.status).to.equal('succeeded');
        });
        stubOrder.restore();
      });
  });

  it('we can create stripe subscription', function () {
    let customersWithPlan = _.filter(customers, (customer) => customer.plan);
    let promisedSubscriptions = customersWithPlan.map((customer) => {
      return paymentService.createSubscription(customer);
    });
    return Promise.all(promisedSubscriptions)
      .then((customers) => {
        let promisedCustomerWithSubscription = customers.map((customer) => customer.save());
        return Promise.all(promisedCustomerWithSubscription);
      })
      .then((dbCustomers) => {
        dbCustomers.forEach((customer) => {
          expect(customer.stripeSubscription).to.exist;
        });
      });
  });

  describe('Customer with order', function () {
    let product;
    let detail;
    let customer;
    let order;
    beforeEach(() => {
      // MOCK Models
      let productFixture = _.sample(fixtures.products);
      product = new Product(productFixture.title, productFixture.amount);
      detail = new Detail(product, 1);
      customer = _.sample(customers);
      order = new Order(customer, [detail]);
      customer.orders = [order];
      return customer.save()
        .then((dbCustomer) => {
          return paymentService.charge(dbCustomer, order);
        });
    });

    it('we should refund customer\'s order', function () {
      return paymentService.refund(customer, order)
        .then((stripeAccount) => {
          expect(stripeAccount.account_balance).to.equal(-product.amount);
          expect(stripeAccount.email).to.equal(customer.email);
        });
    });
  });
});
