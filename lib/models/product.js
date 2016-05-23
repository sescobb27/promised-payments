'use strict';

function Product(title, amount) {
  this.title = title;
  this.amount = amount;
}

// Emulate DB save
Product.prototype.save = function () {
  return new Promise((resolve) => {
    resolve(this);
  });
};

Product.prototype.remove = function () {
  return new Promise((resolve, reject) => {
    reject(new Error('Resource cannot be deleted'));
  });
};

module.exports = Product;
