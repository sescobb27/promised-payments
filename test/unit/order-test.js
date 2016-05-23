'use strict';

let fixtures = require('../helper/fixtures');
let Customer = require('../../lib/models/customer');
let Product = require('../../lib/models/product');
let Detail = require('../../lib/models/detail');
let Order = require('../../lib/models/order');
let Promise = require("bluebird");

let customers = [];
let details = [];
describe('Order', function () {
  beforeEach(() => {
    customers = fixtures.customers.map((customer) => {
      return new Customer(customer.fullName, customer.email, customer.plan);
    });
    details = fixtures.products.map((productFixture) => {
      let product = new Product(productFixture.title, productFixture.amount);
      return new Detail(product, 1);
    });
  });

  it('should save details', function () {
    let order = new Order();
    let savePromises = details.map((detail) => {
      return order.addDetail(detail);
    });
    return Promise.all(savePromises)
      .then(() => {
        expect(order.details.length).to.equal(details.length);
      });
  });

  it('should calculate total price', function () {
    let order = new Order(null, details);
    return order.save()
      .then((newOrder) => {
        expect(newOrder.totalPrice()).to.equal(9000);
      });
  });

  it('should not be deleted', function () {
    let order = new Order();
    return order.remove()
      .then(() => {
        expect(false).to.equal(true, 'Promise should be rejected');
      })
      .catch((error) => {
        expect(error.message).to.equal('Resource cannot be deleted');
      });
  });
});
