---
title: Documentation
tags: 
 - Stripe
 - Embrace API
description: Getting started with Stripe and Embrace
permalink: /docs/
---

# Getting Started

**Embrace has transitioned to Stripe as our primary payment processor to enhance security, reliability, and flexibility in our payment processes.** This upgrade enables more secure, streamlined checkouts for our customers, while also offering advanced fraud detection and a seamless experience across various devices. For new policy enrollments, payments will now be collected through Stripe using Stripe Elements, an optimized tool designed for a smooth and consistent user experience.

Alternatively, to simplify the completion of policy purchases without setting up Stripe Elements, you may redirect customers to the Quote Engine after generating a quote, where they can finalize the purchase.

Make sure to check the [**Prerequisites**](prereqs) page 

#### [Option 1: Redirect to Quote Engine](qe-steps) 

This option requires less front-end setup, and allows you to redirect the customer to our Quote Engine site. Once the customer is redirected they can complete the policy purchase through Quote Engine. 

1. [**Generate Quote**](qe-steps#step-1-make-a-request-to-quote-endpoint) - `/quotes/fullquote` - This step assumes basic quote details have already been collected.
   1. Request
      1. Customer contact details
      2. Pet details
      3. Optional analytics
   2. Response
      1. Quote Engine Link
      2. Additional quote details
2. [**Additional Quote Details**](qe-steps#step-2-display-quote-details-to-customer)
   1. Display quote details to customer.
   2. Add or update pets and contact information on quote if not already added.
3. [**Redirect to Quote Engine**](qe-steps#step-3-redirect-customer-to-quote-engine)
   1. Once the customer has confimed the quote details and is ready to purchase, redirect them to the Quote Engine link provided in the `quote` response.
   2. Customer completes purchase through Quote Engine.

Please check the [**Quote Engine Flow**](qe-steps) page for full step-by-step instructions.

#### [Option 2: Create Full Purchase Flow with Stripe](steps)

If you want to set up your own purchase flow, this documentation provides a step-by-step guide to integrating Stripe Elements with the Embrace API.

1. [**Generate Quote**](steps#step-1-make-a-request-to-quote-endpoint) - `/quotes/fullquote` - This step assumes customer and pet details have already been collected.
   1. Request
      1. Customer contact details
      2. Pet details
      3. Optional analytics
   2. Response
      1. Quote ID
      2. Premium summary
      3. Full pet quote, including coverage details
2. [**Request a Checkout**](steps#step-2-make-a-request-to-the-checkout-endpoint) - `/quotes/{quoteId}/checkout` - Triggered after the customer reviews the quote and is ready to proceed to checkout.
   1. Request
      1. Quote ID (included in endpoint URL)
      2. Optional analytics
   2. Response
      1. Stripe Publishable Key
      2. Stripe Client Secret
3. [**Initialize Stripe Elements**](steps#step-3-initialize-stripe-and-display-checkout)
   1. Initialize Stripe
      1. Use the Publishable Key from the Checkout response to initialize Stripe.
      2. Use the Client Secret from the Checkout response to set up Stripe Elements.
   2. Collect Payment Method Token from Stripe
      1. After the customer submits payment information, Stripe will attempt to add the payment method and return a Payment Method Token upon success.
4. [**Finalize Purchase**](steps#step-4-call-the-purchase-endpoint) - `/quotes/fullquote/{quoteId}/purchase-stripe` - After the customer submits payment via Stripe.
   1. Request
      1. Quote ID (included in endpoint URL)
      2. Payment Method Token (returned from Stripe after submission)
   2. Response
      1. Purchase succeeded result
      2. Policy number
   
Please check the [**Stripe Purchase Flow**](steps) page for full step-by-step instructions.
