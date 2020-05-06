'use strict';

const axios = require('axios')
const chalk = require('chalk'); // Add color to the console
const faker = require('faker/locale/en_US');
const https = require('https');
const patch = require('./patch.js');

// Contacts have firstName, lastName, displayName, addresses, emails, and phones that all need to be replaced
const replaceContacts = (config) => {
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
        config.query = config.url + '/contacts?$select=id&$expand=addressAssocs($select=addressId),emailAssocs($select=emailId),phoneAssocs($select=phoneId)';
        if(config.demoTop != null) {
            config.query += `&$top=${config.demoTop}`;
        }
    }
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
        const originalContacts = urlRes.data.value;
        let updatedAddresses = [];
        let updatedContacts = [];
        let updatedEmails = [];
        let updatedPhones = [];
        // Loop through each contact replacing it's PII properties with fake data
        originalContacts.forEach(originalContact => {
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();
            let updatedContact = {
                id: originalContact.id,
                firstName,
                lastName,
                displayName: `${lastName}, ${firstName}`
            }
            updatedContacts.push(updatedContact);
            if(config.loggingLevel > 2) {
                console.log(`Replacing contact(${chalk.redBright(updatedContact.id)}) with ${chalk.greenBright(`${updatedContact.firstName} ${updatedContact.lastName}`)}`);
            }
            // Loop through each address replacing it's PII properties with fake data
            originalContact.addressAssocs.forEach(addressAssoc => {
                let updatedAddress = {
                    id: addressAssoc.addressId,
                    address1: faker.name.streetAddress(),
                    address2: null,
                    city: faker.address.city(),
                    stateProvince: faker.address.stateAbbr(),
                    postalCode: faker.address.zipCode(),
                    county: faker.address.county(),
                    country: "USA"
                }
                updatedAddresses.push(updatedAddress);
                if(config.loggingLevel > 2) {
                    console.log(`Replacing address(${chalk.redBright(updatedAddress.id)}) with ${chalk.greenBright(`${updatedAddress.address1} ${updatedAddress.city}, ${updatedAddress.stateProvince}. ${updatedAddress.postalCode}`)}`);
                }
            });
            // Loop through each email replacing it's PII properties with fake data
            originalContact.emailAssocs.forEach(emailAssoc => {
                let updatedEmail = {
                    id: emailAssoc.emailId,
                    emailAddress: faker.internet.email(updatedContact.firstName, updatedContact.lastName)
                }
                updatedEmails.push(updatedEmail);
                if(config.loggingLevel > 2) {
                    console.log(`Replacing email(${chalk.redBright(updatedEmail.id)}) with ${chalk.greenBright(updatedEmail.emailAddress)}`);
                }
            });
            // Loop through each phone replacing it's PII properties with fake data
            originalContact.phoneAssocs.forEach(phoneAssoc => {
                let updatedPhone = {
                    id: phoneAssoc.phoneId,
                    phoneNumber: ''
                }
                for(let i = 0; i < 10; i++) {
                    if(i==0 || i==3) {
                        // First area code digit, and first local digit cannot be 0 or 1
                        updatedPhone.phoneNumber += Math.floor(Math.random() * 8 + 2).toString();
                    } else {
                        updatedPhone.phoneNumber += Math.floor(Math.random() * 10).toString();
                    }
                }
                updatedPhones.push(updatedPhone);
                if(config.loggingLevel > 2) {
                    console.log(`Replacing phone(${chalk.redBright(updatedPhone.id)}) with ${chalk.greenBright(updatedPhone.phoneNumber)}`);
                }
            });
        });
        // Call patch and not patchBulk functions only when the API does not support bulk PATCH
        if(config.demo == "false") {
            patch.addresses({
                apiKey: config.apiKey,
                handleError: config.handleError,
                maxRetries: config.maxRetries,
                retryCount: 0,
                retryInitialDelay: config.retryInitialDelay,
                updatedAddresses,
                url: config.url
            });
            patch.contacts({
                apiKey: config.apiKey,
                handleError: config.handleError,
                maxRetries: config.maxRetries,
                retryCount: 0,
                retryInitialDelay: config.retryInitialDelay,
                updatedContacts,
                url: config.url
            });
            patch.emails({
                apiKey: config.apiKey,
                handleError: config.handleError,
                maxRetries: config.maxRetries,
                retryCount: 0,
                retryInitialDelay: config.retryInitialDelay,
                updatedEmails,
                url: config.url
            });
            patch.phones({
                apiKey: config.apiKey,
                handleError: config.handleError,
                maxRetries: config.maxRetries,
                retryCount: 0,
                retryInitialDelay: config.retryInitialDelay,
                updatedPhones,
                url: config.url
            });
        }
        // If there are more contacts, recurse down and get them
        if(urlRes.data['@odata.nextLink']) {
            config.query = urlRes.data['@odata.nextLink'];
            replaceContacts(config);
        }
    }).catch(error => {
        config.handleError(error);
    });
}

module.exports = replaceContacts;