# PII Cleanup

This service is designed to replace personally identifiable information with random information for existing API objects without loss of referential integrity.  Contact names, addresses, emails, phone numbers, and vendor social security numbers will all be changed to anonymize the sensitive data.  This can be valuable for removing production data from non-production environments or for supporting the California Consumer Protection Act (CCPA) for both non-production and production.

This service supports being deployed many ways including a serverless function either scheduled, or http triggered.  This service can run on Windows, Mac, or Linux and can easily be tailored to different API types.  The current implementation is optimized for very high performance and lowest possible bandwidth usage.  Throttled or page limited API handling and detailed logging is included.  This service supports standard OData PATCH of individual objects, but also has functions available for bulk PATCH if the remote API suupports it (highly recommended).

This application accepts the following input arguments or environment variables:

* `apiKey` - The Authorization token passed in the request header to the API.  This argument is required and without a default value.
* `apiThrottleRate` - Rate at which to delay between requests in milliseconds.  Default = 500
* `demo` - `true` or `false`.  When in demo mode, GET requests will be run against the API, and the data will be changed in memory with details output to the console, but no changes will be written back to the API. Default = 'true'
* `demoTop` - In demo mode limit the objects requested to this amount.  Default = 100
* `hostPort` - Default = 80
* `loggingLevel` - Allows values `1-3` with 3 being the highest logging. Default = 3
* `method` - Allows values `http` or `immediate`.  "immediate" will execute once immediatly when the service is launched, then exit once complete.  "html" will launch an http listener and announce its IP and port.  Sending a GET request to this IP and port will trigger the cleanup to begin.  A response will be sent to the browser once complete, but detail logs will only be viewable from the service's console.  Default = "immediate"
* `url` - The url of the API with PII data to be cleaned.  This API is of a known format, requiring slight modifications to this code if cleaning a different API type.  This argument is required and without a default value.

Since `apiKey`, and `url` are both required and have no default values, if launching this service without passing these arguments or without them in the environment, the service will exit with an appropriate error message.  Here is an example of how to call using arguments rather than depending on environment variables:

```cmd
node app.js --url=https://api.domain.com/odata --apiKey=387dbb3c-6f37-48fa-aaa3-c14f23d33bd2
```

The above will get 100 of each object type (contacts & vendors) and change them in memory only (demo="true").  To test actually writing back to the API use the following example:

```cmd
node app.js --url=https://api.domain.com/odata --apiKey=387dbb3c-6f37-48fa-aaa3-c14f23d33bd2 --demoTop=1 --demo=false
```

In the above example, setting `--demo="false"` allows PATCH calls back to the API, but the setting of `--demoTop=1` keeps the actuial changes to a minimum.  Make sure to only do this on non-production.

This service could also be used as a solid starting point for SQL based PII cleanup for legacy applications or anywhere an API interface is unavailable or non-optimal.
