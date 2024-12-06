---
title: Redirect To Quote Engine
tags: 
 - Quote Engine
 - Embrace API
description: How to redirect customer to Quote Engine for policy purchase
---
<link href="https://cdn.jsdelivr.net/npm/json-formatter-js@2.5.18/dist/json-formatter.min.css" rel="stylesheet">

<script src="https://cdn.jsdelivr.net/npm/json-formatter-js@2.5.18/dist/json-formatter.umd.min.js"></script>

# Step-by-Step Quote Engine Redirect

## Step 1: Make a Request to Quote endpoint
In order to get the redirect URL for Quote Engine, you'll need to make a request to Embrace's `/quotes/fullquote` endpoint.

Before you call this endpoint, you must have all of the details for the quote. Make sure to view our [**quote page**](https://docs.embrace.dev/api-details#api=embrace-quote-api-dev-v2&operation=post-quotes-fullquote) to get the full endpoint and schema.

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
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if(data.quoteId) {
            const quoteEngineLink = data.premiumSummary.quoteLinkUrl;

            // Handle and display other response properties as needed
        } else {
            console.error('quoteId not found in response:', data);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error submitting data.');
    });
});
  {% endhighlight %}
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

const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
  {% endhighlight %}
  </div>
</div>

{% include alert.html type="warning" title="Note" content="The above example does not include all available properties available in the quote request. Please view the full request schema to see all available options." %}

With a successful `quote` response, a **`quoteLinkUrl`** will be returned. In the example above you can see we are setting `quoteLinkUrl` from the returned `premiumSummary`. 

**Quote Response Example:**

<div id="quote-response"></div>

<script src="{{ site.baseurl }}/assets/js/formatter.js"></script>

## Step 2: Display Quote Details to Customer
After a successful `quote` response, display the quote information to the customer as needed.

If the pet information was not added when the quote was generated, you can use the `pet` endpoint to add a pet. You can check the [**pet endpoint page**](https://docs.embrace.dev/api-details#api=embrace-quote-api-2&operation=post-quotes-fullquote-quoteid-pet) for the full endpoint and schemas.

<!-- Nav tabs -->
<ul class="nav nav-tabs" id="codeTabs" role="tablist">
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
document.getElementById('quoteDetails').addEventListener('click', function(e){
    e.preventDefault();

    let data = {
        name: document.getElementById('pet-name').value,
        breedId: parseInt(document.getElementById('breed').value),
        gender: document.getElementById('gender').value,
        age: document.getElementById('age').value
    };

    fetch(`/update-pet`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        // Pet sends back full quote response
    })
    .catch(error => {
        console.error('Error:', error);
    });
});{% endhighlight %}
  </div>
  <div class="tab-pane fade" id="step2ServerCode" role="tabpanel" aria-labelledby="step-2-server-tab">
  {% highlight js linenos %}
app.post('/update-pet', async (req, res) => {
  try {
    // Get the data from the request body
    const data = req.body;
    const quoteId = req.body.quoteId;

    // Make the POST request to the Embrace API using fetch
    const apiResponse = await fetch('https://[embrace-test-endpoint]/v2/quotes/fullquote/${quoteId}/pet', {
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
});{% endhighlight %}
  </div>
</div>



## Step 3: Redirect Customer to Quote Engine
After the customer has reviewed the quote information, added pets, and is ready purchase the quote, redirect them to Quote Engine using the **`quoteLinkUrl`** obtained from the `quote` response in Step 1. 

{% highlight js linenos %}

{% endhighlight %}


