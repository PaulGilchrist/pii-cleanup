# PII Cleanup

This service is designed to replace personally identifiable information with random information for existing API or SQL objects without loss of referential integrity.  Contact names, addresses, emails, phone numbers, and vendor social security numbers will all be changed to anonymize the sensitive data.  This can be valuable for removing production data from non-production environments or for supporting the California Consumer Protection Act (CCPA) for both non-production and production.

This service supports being deployed many ways including a serverless function either scheduled, or http triggered.  This service can run on Windows, Mac, or Linux and can easily be tailored to different API contracts or SQL database schemas.  The current implementation is optimized for very high performance and lowest possible bandwidth usage.  Throttled or page limited API handling and detailed logging is included with full control over retry and delay configuration.  Also supported is the ability to change the data only in memory (demo mode), to see the results before committing to changes being pushed back to the API or database.

This service supports standard OData PATCH of individual objects, but also has functions available for bulk PATCH if the remote API suupports it (highly recommended).  Also supported is direct SQL connection for legacy applications 

## API Call - Required input arguments or environment variables

* `apiKey` - The Authorization token passed in the request header to the API
* `url` - The url of the API with PII data to be cleaned.  This API is of a known format, requiring slight modifications to this code if cleaning a different API type.

## SQL Query - Required input arguments or environment variables

* `database` - Database name.
* `password` - Login password (sql auth)
* `server` - SQL server name
* `user` - Login name (sql auth)

## Optional input arguments or environment variables

* `demo` - When in demo mode, GET requests will be run against the API, and the data will be changed in memory with details output to the console, but no changes will be written back to the API. Default = `true`.  Acceptable values are `true` or `false`
* `demoTop` - In demo mode limit the objects requested to this amount.  Default = 100
* `hostPort` - Default = 80
* `loggingLevel` - Allows values `1-3` with 3 being the highest logging. Default = 3
* `maxRetries` - Max number of times to retry should a 429 (too many requests) error occur.  Default = 3
* `method` - Allows values `http` or `immediate`.  "immediate" will execute once immediatly when the service is launched, then exit once complete.  "html" will launch an http listener and announce its IP and port.  Sending a GET request to this IP and port will trigger the cleanup to begin.  A response will be sent to the browser once complete, but detail logs will only be viewable from the service's console.  Default = "immediate"
* `retryInitialDelay` - Rate at which to delay between retries in milliseconds.  Default = 1000

## Examples

### Missing required arguments or environment

```cmd
node app.js
```

### API mode - Demo only

```cmd
node app.js --url=https://api.domain.com/odata --apiKey=387dbb3c-6f37-48fa-aaa3-c14f23d33bd2
```

### API mode - Modify 2 contacts and 2 vendors

```cmd
node app.js --url=https://api.domain.com/odata --apiKey=387dbb3c-6f37-48fa-aaa3-c14f23d33bd2 --demoTop=2 --demo=false
```

### SQL mode - Demo only

```cmd
node app.js --database=myDB --user=myLogin --password=myPassword --server=mySqlServer --demoTop=10
```

