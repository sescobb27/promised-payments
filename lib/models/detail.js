'use strict';
let Promise = require("bluebird");

function Detail(product, qty) {
  this.product = product;
  this.qty = qty;
}

// Emulate DB save
Detail.prototype.save = function () {
  return new Promise((resolve) => {
    resolve(this);
  });
};

Detail.prototype.remove = function () {
  return new Promise((resolve, reject) => {
    reject(new Error('Resource cannot be deleted'));
  });
};

Detail.prototype.totalAmount = function () {
  return this.product.amount * this.qty;
};

module.exports = Detail;
