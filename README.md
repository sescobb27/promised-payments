=======
# promised-payments

# Setup
we need node version > v4.2.0

```bash
npm init
npm install stripe --save
npm install bluebird --save
npm install chai chai-as-promised mocha mocha-jenkins-reporter --save-dev
```

1. Go to [stripe](https://stripe.com/) and create a free account
2. Your Account - Setting - API Keys (TEST)
3. In your shell write this `export STRIPE_SECRET_KEY="YOUR_TEST_SECRET_KEY"`
4. Close settings pop-up and go to plans
5. Create two plans
  * 20 usd monthly subscription
  * 200 usd yearly subscription

# Models
1. mkdir lib/models
2. create lib/models/customer.js
3. create lib/models/product.js
4. create lib/models/detail.js
5. create lib/models/order.js
6. implement Resource `save` and `remove` with promises, remove should always fail and save should always return the object itself e.g `customer.save()`
7. implement order has many details, create a `addDetail` method which adds a detail to orders and then save it
8. In Order model create a method to calculate the total price of an order and call it `totalPrice`
9. Unit test order `save` `addDetail` and `remove` with this fixtures.

```js
let products = [
  {
    title: 'Movie',
    amount: 2000
  },
  {
    title: 'Serie',
    amount: 6000
  },
  {
    title: 'TV Show',
    amount: 1000
  }
];
```
