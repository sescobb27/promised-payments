=======
# promised-payments

# Setup
we need node version > v4.2.0

```bash
npm init
npm install stripe --save
npm install bluebird --save
```

1. Go to [stripe](https://stripe.com/) and create a free account
2. Your Account - Setting - API Keys (TEST)
3. In your shell write this `export STRIPE_SECRET_KEY="YOUR_TEST_SECRET_KEY"`
4. Close settings pop-up and go to plans
5. Create two plans
  * 20 usd monthly subscription
  * 200 usd yearly subscription
