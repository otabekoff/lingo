C:\Users\marko>stripe listen --forward-to localhost:3000/api/webhooks/stripe
> Ready! You are using Stripe API Version [2026-04-22.dahlia]. Your webhook signing secret is whsec_f623a98c9d8b5721dd812b3784d08a6f307da73dbf2b54498b275cb92dc25f6f (^C to quit)

C:\Users\marko>stripe trigger payment_intent.succeeded
Setting up fixture for: payment_intent
Running fixture for: payment_intent
Trigger succeeded! Check dashboard for event details.