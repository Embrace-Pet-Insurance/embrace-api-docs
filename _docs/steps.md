---
title: Stripe Purchase Flow
tags: 
 - Stripe
 - Embrace API
description: How to implement Stripe and the Embrace API, step-by-step
---
<link href="https://cdn.jsdelivr.net/npm/json-formatter-js@2.5.18/dist/json-formatter.min.css" rel="stylesheet">

<script src="https://cdn.jsdelivr.net/npm/json-formatter-js@2.5.18/dist/json-formatter.umd.min.js"></script>

# Step-by-Step Stripe Integration

## Step 1: Make a Request to Quote endpoint
In order to get the quote ID neccessary for a Stripe checkout, you will first need to make a request to Embrace's `/quotes/fullquote` endpoint.

Before you call this endpoint, you must have all of the details for the quote. Make sure to view our [**quote page**](https://docs.embrace.dev/api-details#api=embrace-quote-api-dev-v2&operation=post-quotes-fullquote) to see the full endpoint and schema.

{% include alert.html type="warning" title="Note" content="The below example does not show the full quote request schema. Please view the full request schema to see all available options." %}

<!-- Nav tabs -->
<ul class="nav nav-tabs" id="codeTabs" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="js-tab" data-bs-toggle="tab" data-bs-target="#jsCode" type="button" role="tab" aria-controls="jsCode" aria-selected="true">index.js</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="server-tab" data-bs-toggle="tab" data-bs-target="#serverCode" type="button" role="tab" aria-controls="serverCode" aria-selected="false">server.js</button>
  </li>
</ul>

<!-- Tab panes -->
<div class="tab-content" id="codeTabsContent">
  <div class="tab-pane fade show active" id="jsCode" role="tabpanel" aria-labelledby="js-tab">
  {% highlight js linenos %}
document.getElementById('quoteForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Collect quote form values
    //
    // let pets = [];
    // let pet = {
    //    name: document.getElementById('petName1').value,
    //    breedId: parseInt(document.getElementById('petBreedId1').value),
    //    ...

    // Construct the data object
    let data = {
        pets: pets,
        contact: contact,
        analytics: analytics,
        enableEmbraceRemarketing: enableEmbraceRemarketing
    };

    // Send the data via POST
    fetch('/submit-quote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        const quoteId = data.quoteId;

        if(quoteId) {
            // Get the current URL
            const url = new URL(window.location);

            // Set or update the quoteId in the URL
            url.searchParams.set('quoteId', quoteId);

            // Update the URL in the browser without reloading the page
            window.history.replaceState(null, '', url);

            // Show the other response details to the customer
        } else {
            console.error('quoteId not found in response:', data);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error submitting data.');
    });
});{% endhighlight %}
  </div>
  <div class="tab-pane fade" id="serverCode" role="tabpanel" aria-labelledby="server-tab">
  {% highlight js linenos %}
const express = require('express');
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

// Use environment variables to store sensitive data like API keys
const EMBRACE_API_KEY = process.env.EMBRACE_API_KEY || 'YOUR_EMBRACE_API_KEY';

app.post('/submit-quote', async (req, res) => {
  try {
    // Get the data from the request body
    const data = req.body;

    // Make the POST request to the Embrace API using fetch
    const apiResponse = await fetch('https://[embrace-test-endpoint]/v2/quotes/fullquote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'epi-apim-subscription-key': EMBRACE_API_KEY,
      },
      body: JSON.stringify(data),
    });

    // Check if the response is OK (status in the range 200-299)
    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      console.error('Error response from Embrace API:', errorData);
      return res.status(apiResponse.status).json(errorData);
    }

    const apiResponseData = await apiResponse.json();

    // Send back the API response data to the client
    res.json(apiResponseData);
  } catch (error) {
    console.error('Error calling Embrace API:', error.message);
    res.status(500).json({ error: 'Error calling Embrace API' });
  }
});

// CONTINUED IN STEP 2
{% endhighlight %}
  </div>
</div>

With a successful `quote` response, a **`quoteId`** will be returned. In the example above you can see we are setting the `quoteId` as a URL parameter, so it can be used after the customer has confirmed their quote details. 

## Step 2: Make a Request to the Checkout endpoint
Once the customer has confirmed their quote details, and are ready to checkout, you will need to make a request to Embrace's Checkout endpoint `/quotes/{quoteId}/checkout`. 

More details on the `checkout` request, response, and the full endpoint can be found in our [**checkout endpoint page**](https://docs.embrace.dev/api-details#api=embrace-quote-api-dev-v2&operation=post-quotes-checkout)

<!-- Nav tabs -->
<ul class="nav nav-tabs" id="step2CodeTabs" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="step-2-js-tab" data-bs-toggle="tab" data-bs-target="#step2JsCode" type="button" role="tab" aria-controls="step2JsCode" aria-selected="true">quote-details.js</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="step-2-server-tab" data-bs-toggle="tab" data-bs-target="#step2ServerCode" type="button" role="tab" aria-controls="step2ServerCode" aria-selected="false">server.js</button>
  </li>
</ul>

<!-- Tab panes -->
<div class="tab-content" id="codeTabsContent">
  <div class="tab-pane fade show active" id="step2JsCode" role="tabpanel" aria-labelledby="step-2-js-tab">
{% highlight js linenos %}
let publishableKey;
let clientSecret;

document.getElementById('quoteForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Create a URLSearchParams object from the current URL
    const urlParams = new URLSearchParams(window.location.search);

    // Get the value of 'quoteId' from the URL
    const quoteId = urlParams.get('quoteId');

    if(quoteId) {
        // Send the quoteId via POST
        fetch(`/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quoteId)
        })
        .then(response => response.json())
        .then(data => {

            if(data.stripePublishableKey && data.stripeSetupIntentClientSecret) {
                // Set the stripe keys from the checkout response
                publishableKey = data.stripePublishableKey;
                clientSecret = data.stripeSetupIntentClientSecret;
            } else {
                console.error('Stripe keys not found in response:', data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error submitting data.');
        });
    } else {
        console.error('quoteId not found in URL:', quoteId);
    }
});
{% endhighlight %}
  </div>
  <div class="tab-pane fade" id="step2ServerCode" role="tabpanel" aria-labelledby="step-2-server-tab">
  {% highlight js linenos %}
// --------------------------------------
// ------- CONTINUED FROM STEP 1 --------
// --------------------------------------

app.post('/checkout', async (req, res) => {
  try {
    // Get the data from the request body
    const data = req.body;
    const quoteId = req.body.quoteId;

    // Make the POST request to the Embrace API using fetch
    const apiResponse = await fetch('https://[embrace-test-endpoint]/v2/quotes/${quoteId}/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'epi-apim-subscription-key': EMBRACE_API_KEY,
      },
      body: JSON.stringify(data),
    });

    // Check if the response is OK (status in the range 200-299)
    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      console.error('Error response from Embrace API:', errorData);
      return res.status(apiResponse.status).json(errorData);
    }

    const apiResponseData = await apiResponse.json();

    // Send back the API response data to the client
    res.json(apiResponseData);
  } catch (error) {
    console.error('Error calling Embrace API:', error.message);
    res.status(500).json({ error: 'Error calling Embrace API' });
  }
});

// CONTINUED IN STEP 4
{% endhighlight %}
  </div>
</div>

With a successful `checkout` response, you will receive the following:
- **`stripePublishableKey`** - used to create a new instance of Stripe.
- **`stripeSetupIntentClientSecret`** - associated with this specific customer, and used to create a [Stripe Element](https://docs.stripe.com/sdks/stripejs-react#element-components).

**Example Response:**

<div class="mb-5" id="checkout-response"></div>

<script src="{{ site.baseurl }}/assets/js/formatter.js"></script>

## Step 3: Initialize Stripe and Display Checkout
Stripe offers front-end UI components called [Stripe Elements](https://docs.stripe.com/payments/payment-element). This is what we will use to display the checkout to the customer.

<!-- Nav tabs -->
<ul class="nav nav-tabs" id="codeTabs" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="html-tab" data-bs-toggle="tab" data-bs-target="#htmlCode" type="button" role="tab" aria-controls="htmlCode" aria-selected="true">checkout.html</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="step-3-js-tab" data-bs-toggle="tab" data-bs-target="#step3JsCode" type="button" role="tab" aria-controls="step3JsCode" aria-selected="false">checkout.js</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="css-tab" data-bs-toggle="tab" data-bs-target="#cssCode" type="button" role="tab" aria-controls="cssCode" aria-selected="false">checkout.css</button>
  </li>
</ul>

<!-- Tab panes -->
<div class="tab-content" id="codeTabsContent">
  <div class="tab-pane fade show active" id="htmlCode" role="tabpanel" aria-labelledby="html-tab">
  {% highlight html linenos %}
  <html>
    <head>
      <title>Accept a payment</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="checkout.css" />
      <script src="https://js.stripe.com/v3/"></script>
      <script src="checkout.js" defer></script>
    </head>
    <body>
      <!-- Display a payment form -->
      <form id="payment-form">
        <div id="payment-element">
          <!--Stripe.js injects the Payment Element-->
        </div>
        <button id="submit">
          <div class="spinner hidden" id="spinner"></div>
          <span id="button-text">Pay now</span>
        </button>
        <div id="payment-message" class="hidden"></div>
      </form>
    </body>
  </html>{% endhighlight %}
  </div>
  <div class="tab-pane fade" id="step3JsCode" role="tabpanel" aria-labelledby="step-3-js-tab">
  {% highlight js linenos %}
  // Here is where you'll use the stripePublishableKey returned from checkout
  const stripe = Stripe(publishableKey);
  let paymentMethodId;

  initialize();

  document.querySelector("#payment-form").addEventListener("submit", handleSubmit);

  async function initialize() {
    const appearance = {
      theme: 'stripe',
    };

    // Here is where you'll use the stripeSetupIntentClientSecret returned from checkout
    elements = stripe.elements({ appearance, clientSecret });

    const paymentElementOptions = {
      layout: "tabs",
    };

    const paymentElement = elements.create("payment", paymentElementOptions);
    paymentElement.mount("#payment-element");
  }
  
  // This is hit after the user clicks the button to pay
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const { setupIntent, error } = await stripe.confirmSetup({
      elements,
      confirmParams: {},
      redirect: "if_required"
    });

    if(setupIntent) {
      // Get the payment_method ID, to send to the Purchase endpoint
      paymentMethodId = setupIntent.payment_method;

      // -----------------------------------------------------------------------------------
      // ------- This is where you'll call the Purchase endpoint as seen in Step 4 -------
      // -----------------------------------------------------------------------------------
    } else {
      console.error("Something went wrong");
      showMessage("An unexpected error occurred.");
    }

    setLoading(false);
  }

  // ------- UI helpers -------
  function showMessage(messageText) {
    const messageContainer = document.querySelector("#payment-message");

    messageContainer.classList.remove("hidden");
    messageContainer.textContent = messageText;

    setTimeout(function () {
      messageContainer.classList.add("hidden");
      messageContainer.textContent = "";
    }, 4000);
  }

  // Show a spinner on payment submission
  function setLoading(isLoading) {
    if (isLoading) {
      // Disable the button and show a spinner
      document.querySelector("#submit").disabled = true;
      document.querySelector("#spinner").classList.remove("hidden");
      document.querySelector("#button-text").classList.add("hidden");
    } else {
      document.querySelector("#submit").disabled = false;
      document.querySelector("#spinner").classList.add("hidden");
      document.querySelector("#button-text").classList.remove("hidden");
    }
  }{% endhighlight %}
  </div>
  <div class="tab-pane fade" id="cssCode" role="tabpanel" aria-labelledby="css-tab">
  {% highlight css linenos %}
  /* Variables */
  * {
    box-sizing: border-box;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    height: 100vh;
    width: 100vw;
  }
  
  form {
    width: 30vw;
    min-width: 500px;
    align-self: center;
    box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
      0px 2px 5px 0px rgba(50, 50, 93, 0.1), 0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
    border-radius: 7px;
    padding: 40px;
    margin-top: auto;
    margin-bottom: auto;
  }
  
  .hidden {
    display: none;
  }
  
  #payment-message {
    color: rgb(105, 115, 134);
    font-size: 16px;
    line-height: 20px;
    padding-top: 12px;
    text-align: center;
  }
  
  #payment-element {
    margin-bottom: 24px;
  }
  
  /* Buttons and links */
  button {
    background: #0055DE;
    font-family: Arial, sans-serif;
    color: #ffffff;
    border-radius: 4px;
    border: 0;
    padding: 12px 16px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: block;
    transition: all 0.2s ease;
    box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
    width: 100%;
  }
  button:hover {
    filter: contrast(115%);
  }
  button:disabled {
    opacity: 0.5;
    cursor: default;
  }
  
  /* spinner/processing state, errors */
  .spinner,
  .spinner:before,
  .spinner:after {
    border-radius: 50%;
  }
  .spinner {
    color: #ffffff;
    font-size: 22px;
    text-indent: -99999px;
    margin: 0px auto;
    position: relative;
    width: 20px;
    height: 20px;
    box-shadow: inset 0 0 0 2px;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
  }
  .spinner:before,
  .spinner:after {
    position: absolute;
    content: "";
  }
  .spinner:before {
    width: 10.4px;
    height: 20.4px;
    background: #0055DE;
    border-radius: 20.4px 0 0 20.4px;
    top: -0.2px;
    left: -0.2px;
    -webkit-transform-origin: 10.4px 10.2px;
    transform-origin: 10.4px 10.2px;
    -webkit-animation: loading 2s infinite ease 1.5s;
    animation: loading 2s infinite ease 1.5s;
  }
  .spinner:after {
    width: 10.4px;
    height: 10.2px;
    background: #0055DE;
    border-radius: 0 10.2px 10.2px 0;
    top: -0.1px;
    left: 10.2px;
    -webkit-transform-origin: 0px 10.2px;
    transform-origin: 0px 10.2px;
    -webkit-animation: loading 2s infinite ease;
    animation: loading 2s infinite ease;
  }
  
  /* Payment status page */
  #payment-status {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    row-gap: 30px;
    width: 30vw;
    min-width: 500px;
    min-height: 380px;
    align-self: center;
    box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
      0px 2px 5px 0px rgba(50, 50, 93, 0.1), 0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
    border-radius: 7px;
    padding: 40px;
    opacity: 0;
    animation: fadeInAnimation 1s ease forwards;
  }
  
  #status-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 40px;
    border-radius: 50%;
  }
  
  h2 {
    margin: 0;
    color: #30313D;
    text-align: center;
  }
  
  a {
    text-decoration: none;
    font-size: 16px;
    font-weight: 600;
    font-family: Arial, sans-serif;
    display: block;
  }
  a:hover {
    filter: contrast(120%);
  }
  
  #details-table {
    overflow-x: auto;
    width: 100%;
  }
  
  table {
    width: 100%;
    font-size: 14px;
    border-collapse: collapse;
  }
  table tbody tr:first-child td {
    border-top: 1px solid #E6E6E6; /* Top border */
    padding-top: 10px;
  }
  table tbody tr:last-child td {
    border-bottom: 1px solid #E6E6E6; /* Bottom border */
  }
  td {
    padding-bottom: 10px;
  }
  
  .TableContent {
    text-align: right;
    color: #6D6E78;
  }
  
  .TableLabel {
    font-weight: 600;
    color: #30313D;
  }
  
  #view-details {
    color: #0055DE;
  }
  
  #retry-button {
    text-align: center;
    background: #0055DE;
    color: #ffffff;
    border-radius: 4px;
    border: 0;
    padding: 12px 16px;
    transition: all 0.2s ease;
    box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
    width: 100%;
  }
  
  @-webkit-keyframes loading {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes loading {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes fadeInAnimation {
    to {
        opacity: 1;
    }
  }
  
  @media only screen and (max-width: 600px) {
    form, #dpm-annotation, #payment-status{
      width: 80vw;
      min-width: initial;
    }
  }{% endhighlight %}
  </div>
</div>

After the customer submits their payment information, you should call Stripe's `confirmSetup` function, as seen on line 30 in the checkout.js example above. 

In our example, we added `redirect: "if_required"` so the page doesn't automatically redirect. This is so we can retreive the `payment_method` ID from the `setupIntent`. This ID will need to be added to the `purchase` request, in Step 4, to complete the policy purchase. 

To test this checkout, you can use Stripe's test cards. Check the [**Testing**](/docs/testing) page for more information.

## Step 4: Call the Purchase Endpoint
To finalize the policy purchase, you will need to call the `purchase-stripe` endpoint, and pass in the `payment_method` ID that was returned from Stripe. 

Make sure to view our [**purchase-stripe endpoint page**](https://docs.embrace.dev/api-details#api=embrace-quote-api-dev-v2&operation=post-quotes-fullquote-quoteid-purchase) to see the full endpoint and request schema.

<!-- Nav tabs -->
<ul class="nav nav-tabs" id="step2CodeTabs" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="step-4-js-tab" data-bs-toggle="tab" data-bs-target="#step4JsCode" type="button" role="tab" aria-controls="step4JsCode" aria-selected="true">checkout.js</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="step-4-server-tab" data-bs-toggle="tab" data-bs-target="#step4ServerCode" type="button" role="tab" aria-controls="step4ServerCode" aria-selected="false">server.js</button>
  </li>
</ul>

<!-- Tab panes -->
<div class="tab-content" id="codeTabsContent">
  <div class="tab-pane fade show active" id="step4JsCode" role="tabpanel" aria-labelledby="step-4-js-tab">
{% highlight js linenos %}
async function completePurchase() {
  let data = {
    // The payment_method ID that was returned from Stripe
    paymentMethodToken: paymentMethodId,
    analytics: analytics,
    quoteIdToPurchase: quoteId,
    allPetsVisitedVet: allPetsVisitedVet,
    mailingAddress: mailingAddress,
    billingAddress: billingAddress,
    agreeToTermsOfService: agreeToTermsOfService,
    firstName: firstName,
    lastName: lastName
  };

  // Send the data via POST
  fetch('/purchase-stripe', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
      if(data.policyPurchaseSucceeded) {
          console.log(data.policyNumber);
      } else {
          console.error('error when purchasing:', data);
      }
  })
  .catch(error => {
      console.error('Error:', error);
      alert('Error submitting data.');
  });
};{% endhighlight %}
  </div>
  <div class="tab-pane fade" id="step4ServerCode" role="tabpanel" aria-labelledby="step-4-server-tab">
{% highlight js linenos %}
// ---------------------------------------
// -------- CONTINUED FROM STEP 2 --------
// ---------------------------------------

app.post('/purchase-stripe', async (req, res) => {
  try {
    // Get the data from the request body
    const data = req.body;
    const quoteId = req.body.quoteIdToPurchase;

    // Make the POST request to the Embrace API using fetch
    const apiResponse = await fetch(`https://[embrace-test-endpoint]/v2/quotes/fullquote/${quoteId}/purchase-stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'epi-apim-subscription-key': EMBRACE_API_KEY,
      },
      body: JSON.stringify(data),
    });

    // Check if the response is OK (status in the range 200-299)
    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      console.error('Error response from Embrace API:', errorData);
      return res.status(apiResponse.status).json(errorData);
    }

    const apiResponseData = await apiResponse.json();

    // Send back the API response data to the client
    res.json(apiResponseData);
  } catch (error) {
    console.error('Error calling Embrace API:', error.message);
    res.status(500).json({ error: 'Error calling Embrace API' });
  }
});

const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
{% endhighlight %}
  </div>
</div>


**Example Response:**
{% highlight json %}
{
  "purchaseSucceeded": true,
  "policyNumber": "INS-987654321"
}
{% endhighlight %}




