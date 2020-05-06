'use strict';

const args = require('minimist')(process.argv.slice(2)); // Get arguments by name rather than by index
const chalk = require('chalk'); // Add color to the console
const http = require('http');
const os = require("os");
const replaceContacts = require('./replaceContacts.js');
const replaceContactsSql = require('./replaceContactsSql.js');
const replaceVendors = require('./replaceVendors.js');
const replaceVendorsSql = require('./replaceVendorsSql.js');

console.clear();

var hostname = os.hostname();

// Required arguments or environment variables when using remote API calls
const apiKey = args['apiKey'] || process.env.apiKey;
const url = args['url'] || process.env.url;

// Required arguments or environment variables when using remote SQL database queries
const database = args['database'] || process.env.database;
const password = args['password'] || process.env.password;
const server = args['server'] || process.env.server;
const user = args['user'] || process.env.user;

// Optional arguments or environment variables
const demo = args['demo'] || process.env.demo || "true"; // "true" or "false"
const demoTop = args['demoTop'] || process.env.demoTop || (demo=="true" ? 100 : null); // In demo mode limit the objects requested to this amount.
const hostPort = args['hostPort'] || process.env.hostPort || 80;
const loggingLevel = args['loggingLevel'] || process.env.loggingLevel || 3;
const maxRetries = args['maxRetries'] || process.env.maxRetries || 3;
const method =  args['method'] || process.env.method || "immediate"; // "http" or "immediate"
const retryInitialDelay = args['retryInitialDelay'] || process.env.retryInitialDelay || 1000; // Rate at which to delay between requests in milliseconds

// Check to ensure the required arguments without default values are passed in
const apiRequirementsMet = (apiKey && url);
const sqlRequirementsMet = (database && password && server && user);

if(!apiRequirementsMet && !sqlRequirementsMet) {
    console.warn(`Required arguments or environment variables missing`)
    console.warn(`If using API calls then 'apiKey' and 'url' must be supplied`)
    console.warn(`If using SQL queries then 'database', 'password', 'server', and 'user' must be supplied`)
    // We do not have the required minimum informaiton to continue
    process.exit(1);
}

const handleError = (error) => {
    console.error(error);
    if(method == "immediate") {
        process.exit(1);
    }
}

const apiConfig = {
    apiKey,
    demo,
    demoTop,
    handleError,
    loggingLevel,
    maxRetries,
    query: null, // Not required but will use in future to update a single object or use custom filter
    retryInitialDelay,
    url
};

const sqlConfig = {
    database,
    demo,
    demoTop,
    handleError,
    loggingLevel,
    maxRetries,
    password,
    retryInitialDelay,
    server,
    user
};

const httpServer = http.createServer((req, res) => {
    if (req.url != '/favicon.ico') {
        if(apiRequirementsMet) {
            replaceContacts(apiConfig);
            replaceVendors(apiConfig);
        } else if(sqlRequirementsMet) {
            replaceContactsSql(sqlConfig);
            replaceVendorsSql(apiConfig);
        }
        res.statusCode = 202;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`PII cleanup request accepted`);
    }
});

if(method=='http') {
    // HTTP triggered
    httpServer.listen(hostPort, hostname, () => {
        console.log(`Server running at ${chalk.blueBright(`http://${hostname}:${hostPort}/`)}`);
    });
} else {
    // Immediate
    if(apiRequirementsMet) {
        replaceContacts(apiConfig);
        replaceVendors(apiConfig);
    } else if(sqlRequirementsMet) {
        replaceContactsSql(sqlConfig);
        replaceVendorsSql(apiConfig);
    }
}
