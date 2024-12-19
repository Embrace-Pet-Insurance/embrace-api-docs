---
title: Error Handling
tags: 
 - Troubleshooting
 - Error Handling
description: How to handle errors from Stripe
---

# Error Handling

**It’s important to handle errors gracefully to ensure a good user experience.** Customers may provide invalid information, payment methods may fail, or unexpected errors may occur when interacting with the Embrace API or Stripe. By anticipating common issues and responding with clear, actionable feedback, you can build trust and keep the checkout experience smooth.

### Common Error Types
1. **Validation Errors:**
    - **Invalid Data:** Missing required fields, incorrect data formats, or invalid values may result in a `4xx` response from our API.
    - **`400` Bad Request Examples:**
      - The coverage that was selected isn't available.
      - There is an issue with the Pet's age or name
        - Name is less than 1 character or more than 100, and contains something other than letters and numbers.
        - Age is too young or too old. (Age limit sometimes varies by state)
      - The BreedId that was passed in, is invalid.
      - The Pet object within the Quote request is null or empty. 
      - More than 15 pets are added to the quote.
      - The email address that was used is already associated with a quote or policy. 
    - **`404` Not Found Examples:**
      - The endpoint you're trying to call doesn't exist.
      - An unknown email or zip is being used when trying to retrieve a quote. 
2. **Stripe-Related Errors:**
   - **Failed Payment Attempts:** A customer’s card may be declined, expired, or otherwise rejected by Stripe.
   - **Processing Issues:** Network timeouts or temporary service issues between your integration and Stripe may cause requests to fail.
   - **Examples:**
     - A setup_intent failure due to insufficient funds.
     - Stripe Elements initialization errors if provided keys are incorrect.
3. **Server Errors (5xx):**
    - **Unexpected Failures:** Internal server errors, database outages, or downtime in our systems or Stripe’s platform.
    - **Examples:**
      - `500` Internal Server Error due to a temporary backend issue.
      - `503` Service Unavailable if Stripe or Embrace services are undergoing maintenance.

### Handling Errors in Each Step
1. **Quote Generation (`/quotes/fullquote`):**
    - **Validation Errors (4xx):** If your request is missing required fields or provides invalid data, the API will return validation errors.
      - **Suggested Handling:**
        - Display clear messaging to the user (e.g., “Please verify the pet’s age and contact details.”).
        - Prompt the user to correct the input and retry.
    - **Server Errors (5xx):** In case of server issues, show a generic error message and prompt the user to try again later or contact support.
2. **Checkout Initialization (`/quotes/{quoteId}/checkout`):**
    - **Validation Errors (4xx):** If the Quote ID is invalid or not in a state ready for checkout, a 4xx error may be returned.
      - **Suggested Handling:**
        - Confirm the quote details have been generated correctly.
        - Guide the user back to review their quote inputs.
3. **Stripe Initialization Errors:**
   - If we fail to retrieve the Stripe Publishable Key or Client Secret due to an invalid quote or server issue, display a message and provide a retry option.
4. **Stripe Elements Initialization:**
   - **Client-Side Errors:** If Stripe’s JavaScript library fails to load or the Publishable Key is incorrect, you may not be able to initialize Elements.
     - **Suggested Handling:**
       - Verify that the Publishable Key and Client Secret are correct.
       - Display a message requesting the user to refresh or try again later.
   - **Payment Method Collection Errors:** If Stripe returns an error while tokenizing payment details (e.g., invalid card number), present a user-friendly message prompting them to verify their payment info or use a different card.
5. **Finalize Purchase (`/quotes/fullquote/{quoteId}/purchase-stripe`):**
   - **Payment Processing Errors:** Stripe may return errors for payment failures (e.g., card declined).
     - **Suggested Handling:**
       - Show a clear, friendly error message (e.g., “Your card was declined. Please use a different payment method or contact your card issuer.”).
       - Invalid Payment Method Token (4xx): If the token is invalid or expired, prompt the user to re-enter their payment information.
     - **Server Errors (5xx):** If a server-side issue prevents finalizing the purchase, inform the user of the issue and provide a retry option or a customer support link.
  
### User-Friendly Messaging & Logging
- **Keep It Simple:** When communicating errors to the customer, use plain language. Avoid technical jargon or complex codes. For instance, “There was a problem processing your payment. Please check your payment details or try another card.”
- **Encourage Next Steps:** Provide actionable suggestions (e.g., “Try a different card,” “Review your input,” “Wait a moment and retry,” or “Contact customer support if the problem continues.”).
- **Internal Logging:**
  - Log error responses and details server-side for troubleshooting.
  - Keep track of timestamps, user sessions, and specific endpoints involved.
  - This information helps quickly resolve issues and improve the customer experience over time.
  
### Retrying & Fallback
- **Retry Logic:** For transient network or server errors, consider implementing retry logic with exponential backoff to reduce the impact of temporary disruptions.
- **Fallback Options:** If the Stripe-based purchase flow fails repeatedly, consider falling back to the [**Quote Engine redirect**](qe-steps) option, ensuring the user still has a path to complete their purchase.
