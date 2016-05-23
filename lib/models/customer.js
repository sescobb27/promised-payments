'use strict';
let Promise = require("bluebird");

function Customer(fullName, email, plan) {
  this.fullName = fullName;
  this.email = email;
  this.plan = plan;
  this.stripeAccount = null;
  this.stripeSubscription = null;
}

// Emulate DB save
Customer.prototype.save = function () {
  return new Promise((resolve) => {
    resolve(this);
  });
};

Customer.prototype.remove = function () {
  return new Promise((resolve, reject) => {
    reject(new Error('Resource cannot be deleted'));
  });
};

module.exports = Customer;
