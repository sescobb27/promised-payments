'use strict';

let fixtures = require('../helper/fixtures');
let Customer = require('../../lib/models/customer');
let Product = require('../../lib/models/product');
let Detail = require('../../lib/models/detail');
let Order = require('../../lib/models/order');
let _ = require('lodash');
let Promise = require("bluebird");

let customers = [];
let orders = [];
describe('Purchase Flow', function () {
  beforeEach(() => {
    // CREATE Customer
    let promisedCutomersSave = fixtures.customers.map((customer) => {
      let newCustomer = new Customer(customer.fullName, customer.email, customer.plan);
      return newCustomer.save();
    });

    return Promise.all(promisedCutomersSave)
      .then((dbCustomers) => {
        customers = dbCustomers;
        // CREATE Products
        let promisedProductsSaves = fixtures.products.map((productFixture) => {
          let product = new Product(productFixture.title, productFixture.amount);
          return product.save();
        });
        return Promise.all(promisedProductsSaves);
      })
      .then((products) => {
        // CREATE Details
        let promisedDetailsSave = products.map((product) => {
          let detail = new Detail(product, 1);
          return detail.save();
        });
        return Promise.all(promisedDetailsSave);
      })
      .then((details) => {
        // CREATE Orders with 1 random detail
        let promisedOrdersSave = customers.map((customer) => {
          let order = new Order(customer);
          return order.addDetail(_.sample(details));
        });
        return Promise.all(promisedOrdersSave);
      })
      .then((dbOrders) => {
        orders = dbOrders;
      });
  });

  it('should have non-empty details', function () {
    orders.forEach((order) => {
      expect(order.details.length).to.equal(1);
    });
  });

  it('order should belong to customer', function () {
    orders.forEach((order) => {
      expect(_.map(customers, 'fullName')).to.include(order.customer.fullName);
    });
  });
});
