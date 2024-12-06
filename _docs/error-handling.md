---
title: Error Handling
tags: 
 - Troubleshooting
 - Error Handling
description: How to handle errors from Stripe
---
# Error Handling

### Embrace API Errors

**400:** Bad Request

{% highlight json %}
{
    "type": "string",
    "title": "string",
    "status": 0,
    "detail": "string",
    "instance": "string",
    "errors": {}
}
{% endhighlight %}

**401:** Access Denied

**Cause:** Invalid API Key is being used, or header authorization is not correct.

{% highlight json %}
{
    "statusCode": 401,
    "message": "Access denied due to invalid subscription key. Make sure to provide a valid key for an active subscription."
}
{% endhighlight %}

**404:** Resource Not Found

**Cause:** The endpoint can't be found, or the method (GET, POST, PUT, etc..) does not exist for the particular endpoint.

{% highlight json %}
{
    "statusCode": 404,
    "message": "Resource not found"
}
{% endhighlight %}


### Common Errors:
- **Invalid Token:** If Stripe returns an invalid token, your backend should handle it and provide feedback to the user. Ensure proper validation of the token before proceeding with the charge.
- **Payment Failure:** In case of payment failure from Stripe, do not proceed with the policy purchase. Provide a clear error message to the user.

[Stripe docs](https://docs.stripe.com/error-handling) contain additional information on handling errors. 
