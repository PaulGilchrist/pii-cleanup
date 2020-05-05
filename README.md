# PII Cleanup

This service is designed to replace personally identifiable information with random information for existing API objects without loss of referential integrity.  Names, addresses, emails, and phone numbers will all be changed to anonymize the contact.  This service supports being deployed many ways including a serverless function either scheduled, or http triggered.

This service can run on Windows, Mac, or Linux and can easily be tailored to different API types.  It would also be of minimal effort to switch from API based to SQL based for legacy applications or anywhere an API interface is unavailable or not optimal.  The current implementation is optimized for very high performance and lowest possible bandwidth usage.  Throttled or page limited API handling and detailed logging is included.  This service supports standard OData PATCH of individual objects, but also has functions available for bulk PATCH if the remote API suupports it (highly recommended).

This application accepts the following input arguments or environment variables:

* `apiKey` - The Authorization token passed in the request header to the API.  This argument is required and without a default value.
* `loggingLevel` - Allows values 1-3 with 3 being the highest logging and also the default value
* `method` - Allows values "http" or "immediate" (default).  "immediate" will execute once immediatly when the service is launched, then exit once complete.  "html" will launch an http listener and announce its IP and port.  Sending a GET request to this IP and port will trigger the cleanup to begin.  A response will be sent to the browser once complete, but detail logs will only be viewable from the service's console.
* `url` - The url of the API with PII data to be cleaned.  This API is of a known format, requiring slight modifications to this code if cleaning a different API type.  This argument is required and without a default value.

Since `apiKey`, and `url` are both required and have no default values, if launching this service without passing these arguments or without them in the environment, the service will exit with an appropriate error message.  Here is an example of how to call using arguments rather than depending on environment variables:

```cmd
node app.js --url=https://api.domain.com/odata --apiKey=387dbb3c-6f37-48fa-aaa3-c14f23d33bd2
```

To convert this application from a demo to production ready, remove the `$top` argument from the API GET requests in `app.js`, and uncomment the patch function calls in `replaceContacts.js`.
