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

# Design
Customer has many Orders
Orders belongs to Customer
Order has many details
Detail belongs to Order
Detail has one Product

Services
Billing Service has one payment gateway (this time is coupled to Stripe) but is testable enough, you can use the adapter pattern to be gateway agnostic so you can change it with whatever payment gateway you want.

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
10. Add acceptance test to full-flow emulating an API:
  * STEPS:
    * CREATE 5 Customers and save them
    * CREATE 3 Products and save them
    * CREATE Details based on Products and save them
    * CREATE 5 Orders each with 1 customer and 1 random detail
    * Orders should have non-empty details
    * Orders should belong to customer

# Payments
1. create lib/services/billing/payment.js
2. add methods to our billing service see [stripe api docs](https://stripe.com/docs/api/node)
  * `createToken(creditCard)`
  * `createAccountToCustomer(creditCard, customer)` this should call `createToken` then `createAccount` in a promised way
  * `createAccount(customer, stripeToken)`
  * `createSubscription(customer)`
  * `addBalance(customer, amount)`
  * `charge(customer, amount)`
  * `getCharges(customer)`
3. Add payment-flow acceptance tests
  * STEPS:
    * CREATE 5 Customers and save them
    * CREATE a stripe account to each customer (tip: use `createAccountToCustomer` function).
    * SAVE all created customers with account
    * All customers should have a stripe account
    * We can charge 20usd to each account
    * We can create stripe subscription on those who have a plan

# For home
* Implement and Test `addBalance` to customer's stripe acount
* how can we implement shipping? tip (address model and refactor order's total price calculation)

#### And that's how we implement a mini-ecommerce Domain Logic, we just need to setup anything to handle request (plain node, express, sails, hapi, meteor etc) and a DB (SQL/NoSQL/whatever), then plug your Domain Logic with them and just it, we are Server/DB agnostic.

# Tips:
* Do not broke Promise chain
* Always return the same result type
* If you're already in a promise do not try to avoid it, just keep the flow
* Always try to compose Promises e.g (`createAccountToCustomer`)
* Prefer little composable/testable promises
* We are not handling errors here but you MUST do it
* Always TEST your code
* Use real interactions in acceptance tests when dealing with money you don't want to extra charge or nor charge at all your customers.
