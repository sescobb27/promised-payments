'use strict';
let Promise = require("bluebird");

function Customer(fullName, email, plan) {
  this.fullName = fullName;
  this.email = email;
  this.plan = plan;
  this.stripeAccount = null;
  this.stripeSubscription = null;
  // in real DB this should be an async/promised relationship
  this.orders = [];
}

// Emulate DB save
Customer.prototype.save = function () {
  return new Promise((resolve) => {
    resolve(this);
  });
};

// Emulate DB async/promised find customer orders
Customer.prototype.findOrders = function () {
  return new Promise((resolve) => {
    resolve(this.orders);
  });
};

Customer.prototype.remove = function () {
  return new Promise((resolve, reject) => {
    reject(new Error('Resource cannot be deleted'));
  });
};

module.exports = Customer;
