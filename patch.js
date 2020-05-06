'use strict';

const axios = require('axios')
const https = require('https');
const utils = require('./utils.js');

const patch = {
    addresses: (config) => {
        // Only use this function if the API does not support bulk PATCH
        const defaultConfig = {
            apiKey: null, // Required but with no default
            handleError: null, // Callback function should an error occur.  Not required
            maxRetries: 3, // Max number of times to retry should a 429 (too many requests) error occur
            retryCount: 0, // Current retry attempt
            retryInitialDelay: 1000, // Rate at which to delay between retries in milliseconds
            updatedAddresses: [], // Required but with no default
            url: null, // Required but with no default
        };
        config = { ...defaultConfig, ...config };
        let promissArray = [];
        config.updatedAddresses.forEach(updatedAddress => {
            promissArray.push(
                axios.request({
                    data: updatedAddress,            
                    headers: {
                        'Authorization': `basic ${config.apiKey}`
                    },
                    httpsAgent: new https.Agent({
                        keepAlive: true,
                        rejectUnauthorized: false // (NOTE: this will disable client verification)
                    }),
                    method: 'patch',
                    url: config.url + `/addresses(${updatedAddress.id})`
                })
            );        
        });
        utils.seralizePromises(promissArray).then((results) => {
            // results is an array of promise results in the same order
            console.log(`PATCH of addresses completed successfully`);
        }).catch(error => {
            // If error 429 then retry after an increasing delay
            if(error.response.status == 429 && config.retryCount++ >= config.maxRetries) {
                // Retry
                utils.wait(config.retryInitialDelay*(config.retryCount^2)).then(() => {
                    addresses(config);
                });
            } else {
                if(handleError != null) {
                    config.handleError(error);
                }
            }
        });
    },
    addressesBulk: (config) => {
        // Bulk support must be implemented in the API
        const defaultConfig = {
            apiKey: null, // Required but with no default
            handleError: null, // Callback function should an error occur.  Not required
            maxRetries: 3, // Max number of times to retry should a 429 (too many requests) error occur
            retryCount: 0, // Current retry attempt
            retryInitialDelay: 1000, // Rate at which to delay between retries in milliseconds
            updatedAddresses: [], // Required but with no default
            url: null, // Required but with no default
        };
        config = { ...defaultConfig, ...config };
        if(config.updatedAddresses.length > 0) {
            axios.request({
                data: config.updatedAddresses,            
                headers: {
                    'Authorization': `basic ${config.apiKey}`
                },
                httpsAgent: new https.Agent({
                    keepAlive: true,
                    rejectUnauthorized: false // (NOTE: this will disable client verification)
                }),
                method: 'patch',
                url: config.url + '/addresses'
            }).then(urlRes => {
                console.log(`Bulk PATCH of addresses completed successfully`);
            }).catch(error => {
                if(error.response.status == 429 && config.retryCount++ >= config.maxRetries) {
                    // Retry
                    utils.wait(config.retryInitialDelay*(config.retryCount^2)).then(() => {
                        addressesBulk(config);
                    });
                } else {
                    if(handleError != null) {
                        config.handleError(error);
                    }
                }
            });
        }
    },
    contacts: (config) => {
        // Only use this function if the API does not support bulk PATCH
        const defaultConfig = {
            apiKey: null, // Required but with no default
            handleError: null, // Callback function should an error occur.  Not required
            maxRetries: 3, // Max number of times to retry should a 429 (too many requests) error occur
            retryCount: 0, // Current retry attempt
            retryInitialDelay: 1000, // Rate at which to delay between retries in milliseconds
            updatedContacts: [], // Required but with no default
            url: null, // Required but with no default
        };
        config = { ...defaultConfig, ...config };
        let promissArray = [];
        config.updatedContacts.forEach(updatedContact => {
            promissArray.push(
                axios.request({
                    data: updatedContact,            
                    headers: {
                        'Authorization': `basic ${config.apiKey}`
                    },
                    httpsAgent: new https.Agent({
                        keepAlive: true,
                        rejectUnauthorized: false // (NOTE: this will disable client verification)
                    }),
                    method: 'patch',
                    url: config.url + `/contacts(${updatedContact.id})`
                })
            );
        });
        utils.seralizePromises(promissArray).then((results) => {
            // results is an array of promise results in the same order
            console.log(`PATCH of contacts completed successfully`);
        }).catch(error => {
            // If error 429 then retry after an increasing delay
            if(error.response.status == 429 && config.retryCount++ >= config.maxRetries) {
                // Retry
                utils.wait(config.retryInitialDelay*(config.retryCount^2)).then(() => {
                    contacts(config);
                });
            } else {
                if(handleError != null) {
                    config.handleError(error);
                }
            }
        });
    },
    contactsBulk: (config) => {
        // Bulk support must be implemented in the API
        const defaultConfig = {
            apiKey: null, // Required but with no default
            handleError: null, // Callback function should an error occur.  Not required
            maxRetries: 3, // Max number of times to retry should a 429 (too many requests) error occur
            retryCount: 0, // Current retry attempt
            retryInitialDelay: 1000, // Rate at which to delay between retries in milliseconds
            updatedContacts: [], // Required but with no default
            url: null, // Required but with no default
        };
        config = { ...defaultConfig, ...config };
        if(config.updatedContacts.length > 0) {
            axios.request({
                data: config.updatedContacts,            
                headers: {
                    'Authorization': `basic ${config.apiKey}`
                },
                httpsAgent: new https.Agent({
                    keepAlive: true,
                    rejectUnauthorized: false // (NOTE: this will disable client verification)
                }),
                method: 'patch',
                url: config.url + '/contacts'
            }).then(urlRes => {
                console.log(`Bulk PATCH of contacts completed successfully`);
            }).catch(error => {
                if(error.response.status == 429 && config.retryCount++ >= config.maxRetries) {
                    // Retry
                    utils.wait(config.retryInitialDelay*(config.retryCount^2)).then(() => {
                        contactsBulk(config);
                    });
                } else {
                    if(handleError != null) {
                        config.handleError(error);
                    }
                }
            });
        }
    },
    emails: (config) => {
        // Only use this function if the API does not support bulk PATCH
        const defaultConfig = {
            apiKey: null, // Required but with no default
            handleError: null, // Callback function should an error occur.  Not required
            maxRetries: 3, // Max number of times to retry should a 429 (too many requests) error occur
            retryCount: 0, // Current retry attempt
            retryInitialDelay: 1000, // Rate at which to delay between retries in milliseconds
            updatedEmails: [], // Required but with no default
            url: null, // Required but with no default
        };
        config = { ...defaultConfig, ...config };
        let promissArray = [];
        config.updatedEmails.forEach(updatedEmail => {
            promissArray.push(
                axios.request({
                    data: updatedEmail,            
                    headers: {
                        'Authorization': `basic ${config.apiKey}`
                    },
                    httpsAgent: new https.Agent({
                        keepAlive: true,
                        rejectUnauthorized: false // (NOTE: this will disable client verification)
                    }),
                    method: 'patch',
                    url: config.url + `/emails(${updatedEmail.id})`
                })
            );
        });
        utils.seralizePromises(promissArray).then((results) => {
            // results is an array of promise results in the same order
            console.log(`PATCH of emails completed successfully`);
        }).catch(error => {
            // If error 429 then retry after an increasing delay
            if(error.response.status == 429 && config.retryCount++ >= config.maxRetries) {
                // Retry
                utils.wait(config.retryInitialDelay*(config.retryCount^2)).then(() => {
                    emails(config);
                });
            } else {
                if(handleError != null) {
                    config.handleError(error);
                }
            }
        });
    },
    emailsBulk: (config) => {
        // Bulk support must be implemented in the API
        const defaultConfig = {
            apiKey: null, // Required but with no default
            handleError: null, // Callback function should an error occur.  Not required
            maxRetries: 3, // Max number of times to retry should a 429 (too many requests) error occur
            retryCount: 0, // Current retry attempt
            retryInitialDelay: 1000, // Rate at which to delay between retries in milliseconds
            updatedEmails: [], // Required but with no default
            url: null, // Required but with no default
        };
        config = { ...defaultConfig, ...config };
        if(config.updatedEmails.length > 0) {
            axios.request({
                data: config.updatedEmails,            
                headers: {
                    'Authorization': `basic ${config.apiKey}`
                },
                httpsAgent: new https.Agent({
                    keepAlive: true,
                    rejectUnauthorized: false // (NOTE: this will disable client verification)
                }),
                method: 'patch',
                url: config.url + '/emails'
            }).then(urlRes => {
                console.log(`Bulk PATCH of emails completed successfully`);
            }).catch(error => {
                if(error.response.status == 429 && config.retryCount++ >= config.maxRetries) {
                    // Retry
                    utils.wait(config.retryInitialDelay*(config.retryCount^2)).then(() => {
                        emailsBulk(config);
                    });
                } else {
                    if(handleError != null) {
                        config.handleError(error);
                    }
                }
            });
        }
    },
    phones: (config) => {
        // Only use this function if the API does not support bulk PATCH
        const defaultConfig = {
            apiKey: null, // Required but with no default
            handleError: null, // Callback function should an error occur.  Not required
            maxRetries: 3, // Max number of times to retry should a 429 (too many requests) error occur
            retryCount: 0, // Current retry attempt
            retryInitialDelay: 1000, // Rate at which to delay between retries in milliseconds
            updatedPhones: [], // Required but with no default
            url: null, // Required but with no default
        };
        config = { ...defaultConfig, ...config };
        let promissArray = [];
        config.updatedPhones.forEach(updatedPhone => {
            promissArray.push(
                axios.request({
                    data: updatedPhone,            
                    headers: {
                        'Authorization': `basic ${config.apiKey}`
                    },
                    httpsAgent: new https.Agent({
                        keepAlive: true,
                        rejectUnauthorized: false // (NOTE: this will disable client verification)
                    }),
                    method: 'patch',
                    url: config.url + `/phones(${updatedPhone.id})`
                })
            );
        });
        utils.seralizePromises(promissArray).then((results) => {
            // results is an array of promise results in the same order
            console.log(`PATCH of phones completed successfully`);
        }).catch(error => {
            // If error 429 then retry after an increasing delay
            if(error.response.status == 429 && config.retryCount++ >= config.maxRetries) {
                // Retry
                utils.wait(config.retryInitialDelay*(config.retryCount^2)).then(() => {
                    phones(config);
                });
            } else {
                if(handleError != null) {
                    config.handleError(error);
                }
            }
        });
    },
    phonesBulk: (config) => {
        // Bulk support must be implemented in the API
        const defaultConfig = {
            apiKey: null, // Required but with no default
            handleError: null, // Callback function should an error occur.  Not required
            maxRetries: 3, // Max number of times to retry should a 429 (too many requests) error occur
            retryCount: 0, // Current retry attempt
            retryInitialDelay: 1000, // Rate at which to delay between retries in milliseconds
            updatedPhones: [], // Required but with no default
            url: null, // Required but with no default
        };
        config = { ...defaultConfig, ...config };
        if(config.updatedPhones.length > 0) {
            axios.request({
                data: config.updatedPhones,            
                headers: {
                    'Authorization': `basic ${config.apiKey}`
                },
                httpsAgent: new https.Agent({
                    keepAlive: true,
                    rejectUnauthorized: false // (NOTE: this will disable client verification)
                }),
                method: 'patch',
                url: config.url + '/phones'
            }).then(urlRes => {
                console.log(`Bulk PATCH of phones completed successfully`);
            }).catch(error => {
                if(error.response.status == 429 && config.retryCount++ >= config.maxRetries) {
                    // Retry
                    utils.wait(config.retryInitialDelay*(config.retryCount^2)).then(() => {
                        phonesBulk(config);
                    });
                } else {
                    if(handleError != null) {
                        config.handleError(error);
                    }
                }
            });
        }
    },
    vendors: (config) => {
        // Only use this function if the API does not support bulk PATCH
        const defaultConfig = {
            apiKey: null, // Required but with no default
            handleError: null, // Callback function should an error occur.  Not required
            maxRetries: 3, // Max number of times to retry should a 429 (too many requests) error occur
            retryCount: 0, // Current retry attempt
            retryInitialDelay: 1000, // Rate at which to delay between retries in milliseconds
            updatedVendors: [], // Required but with no default
            url: null, // Required but with no default
        };
        config = { ...defaultConfig, ...config };
        let promissArray = [];
        config.updatedVendors.forEach(updatedVendor => {
            promissArray.push(
                axios.request({
                    data: updatedVendor,            
                    headers: {
                        'Authorization': `basic ${config.apiKey}`
                    },
                    httpsAgent: new https.Agent({
                        keepAlive: true,
                        rejectUnauthorized: false // (NOTE: this will disable client verification)
                    }),
                    method: 'patch',
                    url: config.url + `/financialVendors(${updatedVendor.id})`
                })
            );
        });
        utils.seralizePromises(promissArray).then((results) => {
            // results is an array of promise results in the same order
            console.log(`PATCH of vendors completed successfully`);
        }).catch(error => {
            // If error 429 then retry after an increasing delay
            if(error.response.status == 429 && config.retryCount++ >= config.maxRetries) {
                // Retry
                utils.wait(config.retryInitialDelay*(config.retryCount^2)).then(() => {
                    vendors(config);
                });
            } else {
                if(handleError != null) {
                    config.handleError(error);
                }
            }
        });
    },
    vendorsBulk: (config) => {
        // Bulk support must be implemented in the API
        const defaultConfig = {
            apiKey: null, // Required but with no default
            handleError: null, // Callback function should an error occur.  Not required
            maxRetries: 3, // Max number of times to retry should a 429 (too many requests) error occur
            retryCount: 0, // Current retry attempt
            retryInitialDelay: 1000, // Rate at which to delay between retries in milliseconds
            updatedVendors: [], // Required but with no default
            url: null, // Required but with no default
        };
        config = { ...defaultConfig, ...config };
        if(config.updatedVendors.length > 0) {
            axios.request({
                data: config.updatedVendors,            
                headers: {
                    'Authorization': `basic ${config.apiKey}`
                },
                httpsAgent: new https.Agent({
                    keepAlive: true,
                    rejectUnauthorized: false // (NOTE: this will disable client verification)
                }),
                method: 'patch',
                url: config.url + '/financialVendors'
            }).then(urlRes => {
                console.log(`Bulk PATCH of vendors completed successfully`);
            }).catch(error => {
                if(error.response.status == 429 && config.retryCount++ >= config.maxRetries) {
                    // Retry
                    utils.wait(config.retryInitialDelay*(config.retryCount^2)).then(() => {
                        vendorsBulk(config);
                    });
                } else {
                    if(handleError != null) {
                        config.handleError(error);
                    }
                }
            });
        }
    }
}

module.exports = patch;
