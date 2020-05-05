'use strict';

const axios = require('axios')
const chalk = require('chalk'); // Add color to the console
const faker = require('faker/locale/en_US');
const https = require('https');
const patch = require('./patch.js');

const replaceContacts = (url, apiKey, apiThrottleRate, handleError, loggingLevel, demo, contactsQuery) => {
    // GET one or more contacts from EDH including all their addresses, emails, and phones
    console.log(`Getting contacts`);
    axios.get(contactsQuery, {
        headers: {
            'Authorization': `basic ${apiKey}`
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
            if(loggingLevel > 2) {
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
                if(loggingLevel > 2) {
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
                if(loggingLevel > 2) {
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
                if(loggingLevel > 2) {
                    console.log(`Replacing phone(${chalk.redBright(updatedPhone.id)}) with ${chalk.greenBright(updatedPhone.phoneNumber)}`);
                }
            });
        });
        // Call patch and not patchBulk functions only when the API does not support bulk PATCH
        if(demo == "false") {
            patch.addresses(url, apiKey, apiThrottleRate, handleError, updatedAddresses);
            patch.contacts(url, apiKey, apiThrottleRate, handleError, updatedContacts);
            patch.emails(url, apiKey, apiThrottleRate, handleError, updatedEmails);
            patch.phones(url, apiKey, apiThrottleRate, handleError, updatedPhones);
        }
        // If there are more contacts, recurse down and get them
        if(urlRes.data['@odata.nextLink']) {
            replaceContacts(url, apiKey, apiThrottleRate, handleError, urlRes.data['@odata.nextLink'], res);
        } else {
            console.log(`Contacts updated successfully`);
        }
    }).catch(error => {
        handleError(error);
    });
}

module.exports = replaceContacts;