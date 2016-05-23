'use strict';
let Promise = require("bluebird");

function Order(customer, details) {
  this.customer = customer;
  this.details = details || [];
}

// Emulate DB save
Order.prototype.save = function () {
  return new Promise((resolve) => {
    resolve(this);
  });
};

Order.prototype.remove = function () {
  return new Promise((resolve, reject) => {
    reject(new Error('Resource cannot be deleted'));
  });
};

Order.prototype.addDetail = function (detail) {
  this.details.push(detail);
  return this.save();
};

Order.prototype.totalPrice = function () {
  let sum = 0;
  this.details.forEach((detail) => {
    sum += detail.totalAmount();
  });
  return sum;
};

module.exports = Order;
