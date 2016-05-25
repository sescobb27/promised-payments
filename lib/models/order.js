'use strict';
let Promise = require("bluebird");

function Order(customer, details) {
  // in real DB this should be an async/promised relationship
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

// Emulate DB async/promised find order's customer
Order.prototype.findCustomer = function () {
  return new Promise((resolve) => {
    resolve(this.customer);
  });
};

// Emulate DB async/promised find order's details
Order.prototype.findDetails = function () {
  return new Promise((resolve) => {
    resolve(this.details);
  });
};

Order.prototype.addDetail = function (detail) {
  this.details.push(detail);
  return this.save();
};

Order.prototype.totalPrice = function () {
  return this.findDetails()
    .then((details) => {
      let sum = 0;
      details.forEach((detail) => {
        sum += detail.totalAmount();
      });
      return sum;
    });
};

module.exports = Order;
