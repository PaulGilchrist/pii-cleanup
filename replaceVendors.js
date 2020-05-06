'use strict';

const axios = require('axios')
const chalk = require('chalk'); // Add color to the console
const faker = require('faker/locale/en_US');
const https = require('https');
const patch = require('./patch.js');

// Contacts have firstName, lastName, displayName, addresses, emails, and phones that all need to be replaced
const replaceVendors = (config) => {
    const defaultConfig = {
        apiKey: null, // Required but with no default
        demo: "true", // "true" or "false"
        demoTop: 100, // In demo mode limit the objects requested to this amount
        handleError: null, // Callback function should an error occur.  Not required
        loggingLevel: 3, //1-3 with 3 being most verbose logging
        maxRetries: 3, // Max number of times to retry should a 429 (too many requests) error occur
        query: null, // Not required
        retryInitialDelay: 1000, // Rate at which to delay between retries in milliseconds
        url: null // Required but with no default
    }
    config = { ...defaultConfig, ...config };
    if (config.query == null) {
        // We want to get the least amount of data back.  In this case all we need are the IDs to maintain referential integrity.
        // We are changing the PII and those changes are not based on the original values, so we do not need to know them
        config.query = config.url + '/financialVendors?$select=id,taxId&$filter=(length(taxId) ge 11)';
        if(config.demoTop != null) {
            config.query += `&$top=${config.demoTop}`;
        }
    }
    const  ssnPattern = /^[0-9]{3}\-?[0-9]{2}\-?[0-9]{4}$/;
    // GET one or more contacts from EDH including all their addresses, emails, and phones
    console.log(`GET = ${chalk.blueBright(config.query)}`)
    axios.get(config.query, {
        headers: {
            'Authorization': `basic ${config.apiKey}`
        },
        httpsAgent: new https.Agent({
            keepAlive: true,
            rejectUnauthorized: false // (NOTE: this will disable client verification)
        })
    }).then(urlRes => {
        const originalVendors = urlRes.data.value;
        let updatedVendors = [];
        // Loop through each vendor determining if they are using a SSN as their taxId, and replacing it with fake data
        originalVendors.forEach(originalVendor => {
            // RegEx for SSN
            if(ssnPattern.test(originalVendor.taxId)) {
                let updatedVendor = {
                    id: originalVendor.id,
                    taxId: ''
                }
                for(let i = 0; i < 11; i++) {
                    if(i==3 || i==6) {
                        updatedVendor.taxId += `-`;
                    } else {
                        updatedVendor.taxId += Math.floor(Math.random() * 9 + 1).toString(); // Not using 0
                    }
                }
                updatedVendors.push(updatedVendor);
                if(config.loggingLevel > 2) {
                    console.log(`Replacing vendor(${chalk.redBright(updatedVendor.id)}) with ${chalk.greenBright(updatedVendor.taxId)}`);
                }
            }
        });
        // Call patch and not patchBulk functions only when the API does not support bulk PATCH
        if(config.demo == "false") {            
            patch.vendors({
                apiKey: config.apiKey,
                handleError: config.handleError,
                maxRetries: config.maxRetries,
                retryCount: 0,
                retryInitialDelay: config.retryInitialDelay,
                updatedVendors,
                url: config.url
            });
        }
        // If there are more vendors, recurse down and get them
        if(urlRes.data['@odata.nextLink']) {
            config.query = urlRes.data['@odata.nextLink'];
            replaceVendors(config);
        }
    }).catch(error => {
        config.handleError(error);
    });
}

module.exports = replaceVendors;