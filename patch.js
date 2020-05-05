'use strict';

const axios = require('axios')
const https = require('https');

const patch = {
    addresses: (url, apiKey, apiThrottleRate, handleError, updatedAddresses) => {
        // Only use this function if the API does not support bulk PATCH
        updatedAddresses.forEach(updatedAddress => {
            //Don't overrun throttling
            setTimeout(() => {
                axios.request({
                    data: updatedAddress,            
                    headers: {
                        'Authorization': `basic ${apiKey}`
                    },
                    httpsAgent: new https.Agent({
                        keepAlive: true,
                        rejectUnauthorized: false // (NOTE: this will disable client verification)
                    }),
                    method: 'patch',
                    url: url + `/addresses(${updatedAddress.id})`
                }).catch(error => {
                    // If error 429 then retry after a slight delay
                    handleError(error);
                });
            }, apiThrottleRate);
        });
    },
    addressesBulk: (url, apiKey, handleError, updatedAddresses) => {
        // Bulk support must be implemented in the API
        if(updatedAddresses.length > 0) {
            axios.request({
                data: updatedAddresses,            
                headers: {
                    'Authorization': `basic ${apiKey}`
                },
                httpsAgent: new https.Agent({
                    keepAlive: true,
                    rejectUnauthorized: false // (NOTE: this will disable client verification)
                }),
                method: 'patch',
                url: url + '/addresses'
            }).then(urlRes => {
                console.log(`Bulk PATCH of addresses completed successfully`);
            }).catch(error => {
                // If error 429 then retry after a slight delay
                handleError(error);
            });
        }
    },
    contacts: (url, apiKey, apiThrottleRate, handleError, updatedContacts) => {
        // Only use this function if the API does not support bulk PATCH
        updatedContacts.forEach(updatedContact => {
            //Don't overrun throttling
            setTimeout(() => {
                axios.request({
                    data: updatedContact,            
                    headers: {
                        'Authorization': `basic ${apiKey}`
                    },
                    httpsAgent: new https.Agent({
                        keepAlive: true,
                        rejectUnauthorized: false // (NOTE: this will disable client verification)
                    }),
                    method: 'patch',
                    url: url + `/contacts(${updatedContact.id})`
                }).catch(error => {
                    // If error 429 then retry after a slight delay
                    handleError(error);
                });
            }, apiThrottleRate);
        });
    },
    contactsBulk: (url, apiKey, handleError, updatedContacts) => {
        // Bulk support must be implemented in the API
        if(updatedContacts.length > 0) {
            axios.request({
                data: updatedContacts,            
                headers: {
                    'Authorization': `basic ${apiKey}`
                },
                httpsAgent: new https.Agent({
                    keepAlive: true,
                    rejectUnauthorized: false // (NOTE: this will disable client verification)
                }),
                method: 'patch',
                url: url + '/contacts'
            }).then(urlRes => {
                console.log(`Bulk PATCH of contacts completed successfully`);
            }).catch(error => {
                // If error 429 then retry after a slight delay
                handleError(error);
            });
        }
    },
    emails: (url, apiKey, apiThrottleRate, handleError, updatedEmails) => {
        // Only use this function if the API does not support bulk PATCH
        updatedEmails.forEach(updatedEmail => {
            //Don't overrun throttling
            setTimeout(() => {
                axios.request({
                    data: updatedEmail,            
                    headers: {
                        'Authorization': `basic ${apiKey}`
                    },
                    httpsAgent: new https.Agent({
                        keepAlive: true,
                        rejectUnauthorized: false // (NOTE: this will disable client verification)
                    }),
                    method: 'patch',
                    url: url + `/emails(${updatedEmail.id})`
                }).catch(error => {
                    // If error 429 then retry after a slight delay
                    handleError(error);
                });
            }, apiThrottleRate);
        });
    },
    emailsBulk: (url, apiKey, handleError, updatedEmails) => {
        // Bulk support must be implemented in the API
        if(updatedEmails.length > 0) {
            axios.request({
                data: updatedEmails,            
                headers: {
                    'Authorization': `basic ${apiKey}`
                },
                httpsAgent: new https.Agent({
                    keepAlive: true,
                    rejectUnauthorized: false // (NOTE: this will disable client verification)
                }),
                method: 'patch',
                url: url + '/emails'
            }).then(urlRes => {
                console.log(`Bulk PATCH of emails completed successfully`);
            }).catch(error => {
                // If error 429 then retry after a slight delay
                handleError(error);
            });
        }
    },
    phones: (url, apiKey, apiThrottleRate, handleError, updatedPhones) => {
        // Only use this function if the API does not support bulk PATCH
        updatedPhones.forEach(updatedPhone => {
            //Don't overrun throttling
            setTimeout(() => {
                axios.request({
                    data: updatedPhone,            
                    headers: {
                        'Authorization': `basic ${apiKey}`
                    },
                    httpsAgent: new https.Agent({
                        keepAlive: true,
                        rejectUnauthorized: false // (NOTE: this will disable client verification)
                    }),
                    method: 'patch',
                    url: url + `/phones(${updatedPhone.id})`
                }).catch(error => {
                    // If error 429 then retry after a slight delay
                    handleError(error);
                });
            }, apiThrottleRate);
        });
    },
    phonesBulk: (url, apiKey, handleError, updatedPhones) => {
        // Bulk support must be implemented in the API
        if(updatedPhones.length > 0) {
            axios.request({
                data: updatedPhones,            
                headers: {
                    'Authorization': `basic ${apiKey}`
                },
                httpsAgent: new https.Agent({
                    keepAlive: true,
                    rejectUnauthorized: false // (NOTE: this will disable client verification)
                }),
                method: 'patch',
                url: url + '/phones'
            }).then(urlRes => {
                console.log(`Bulk PATCH of phones completed successfully`);
            }).catch(error => {
                // If error 429 then retry after a slight delay
                handleError(error);
            });
        }
    },
    vendors: (url, apiKey, apiThrottleRate, handleError, updatedVendors) => {
        // Only use this function if the API does not support bulk PATCH
        updatedVendors.forEach(updatedVendor => {
            //Don't overrun throttling
            setTimeout(() => {
                axios.request({
                    data: updatedVendor,            
                    headers: {
                        'Authorization': `basic ${apiKey}`
                    },
                    httpsAgent: new https.Agent({
                        keepAlive: true,
                        rejectUnauthorized: false // (NOTE: this will disable client verification)
                    }),
                    method: 'patch',
                    url: url + `/financialVendors(${updatedVendor.id})`
                }).catch(error => {
                    // If error 429 then retry after a slight delay
                    handleError(error);
                });
            }, apiThrottleRate);
        });
    },
    vendorsBulk: (url, apiKey, handleError, updatedVendors) => {
        // Bulk support must be implemented in the API
        if(updatedVendors.length > 0) {
            axios.request({
                data: updatedVendors,            
                headers: {
                    'Authorization': `basic ${apiKey}`
                },
                httpsAgent: new https.Agent({
                    keepAlive: true,
                    rejectUnauthorized: false // (NOTE: this will disable client verification)
                }),
                method: 'patch',
                url: url + '/financialVendors'
            }).then(urlRes => {
                console.log(`Bulk PATCH of vendors completed successfully`);
            }).catch(error => {
                // If error 429 then retry after a slight delay
                handleError(error);
            });
        }
    }
}

module.exports = patch;
