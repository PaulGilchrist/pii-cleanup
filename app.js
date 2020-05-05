'use strict';

const args = require('minimist')(process.argv.slice(2)); // Get arguments by name rather than by index
const chalk = require('chalk'); // Add color to the console
const http = require('http');
const os = require("os");
const replaceContacts = require('./replaceContacts.js');

console.clear();

var hostname = os.hostname();

// Get arguments or environment variables
const apiKey = args['apiKey'] || process.env.apiKey;
const apiThrottleRate = args['apiThrottleRate'] || process.env.apiThrottleRate || 500; // Rate at which to delay between requests in milliseconds
const demo = args['demo'] || process.env.demo || "true"; // "true" (default), "false"
const demoTop = args['demoTop'] || process.env.demoTop || 100; // In demo mode limit the objects requested to this amount
const hostPort = args['hostPort'] || process.env.hostPort || 80;
const loggingLevel = args['loggingLevel'] || process.env.loggingLevel || 3;
const method =  args['method'] || process.env.method || "immediate"; // "http" or "immediate" (default)
const url = args['url'] || process.env.url;
// Check to ensure the required arguments without default values are passed in
if (!url || !apiKey) {
    if (!url) {
        console.warn(`url needs to be passed in as an argument or environment variable`)
    }
    if (!apiKey) {
        console.warn(`apiKey needs to be passed in as an argument or environment variable`)
    }
    // We do not have the required minimum infomraiton to continue
    process.exit(1);
}
console.log(`url = ${chalk.blueBright(url)}`)

const handleError = (error) => {
    console.error(error);
    if(method == "immediate") {
        process.exit(1);
    }
}

// We want to get the least amount of data back.  In this case all we need are the IDs to maintain referential integrity.  We are changing the PII and those changes are not based on the original values, so we do not need to know them
let contactsQuery = url + '/contacts?$select=id&$expand=addressAssocs($select=addressId),emailAssocs($select=emailId),phoneAssocs($select=phoneId)';
if(demo == "true") {
    contactsQuery += `&$top=${demoTop}`;
}

const server = http.createServer((req, res) => {
    if (req.url != '/favicon.ico') {
        replaceContacts(url, apiKey, apiThrottleRate, handleError, loggingLevel, demo, contactsQuery);
        res.statusCode = 202;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`PII cleanup request accepted`);
    }
});

switch(method) {
    case "http": {
        server.listen(hostPort, hostname, () => {
            console.log(`Server running at ${chalk.blueBright(`http://${hostname}:${hostPort}/`)}`);
        });
        break;
    }
    default: {
        replaceContacts(url, apiKey, apiThrottleRate, handleError, loggingLevel, demo, contactsQuery);
    }
}
