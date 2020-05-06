'use strict';

// Currently this module is a demo, but 90% complete to production readiness
const chalk = require('chalk'); // Add color to the console
const faker = require('faker/locale/en_US');
const sql = require('mssql');

const replaceContactsSql = (config) => {
    const defaultConfig = {
        database: null, // Required but with no default
        demo: "true", // "true" or "false"
        demoTop: 10, // In demo mode limit the objects requested to this amount
        handleError: null, // Callback function should an error occur.  Not required
        loggingLevel: 3, //1-3 with 3 being most verbose logging
        maxRetries: 3, // Max number of times to retry should a 429 (too many requests) error occur
        password: null, // Required but with no default
        retryInitialDelay: 1000, // Rate at which to delay between retries in milliseconds
        server: null, // Required but with no default
        user: null, // Required but with no default
    }
    config = { ...defaultConfig, ...config };
    //Initiallising SQL connection string
    const dbConfig = {
        server: config.server,
        database: config.database,
        user: config.user,
        password: config.password,
        "options": {
            "encrypt": true,
            "enableArithAbort": true
        }
    };
    sql.connect(dbConfig).then(() => {
        // Get Addresses
        sql.query(`select ${`top ${config.demoTop}`} AddressId from shr.Address`).then(result => {
            // Loop through each address replacing it's PII properties with fake data
            let updateQuery = '';
            result.recordset.forEach(address => {
                updateQuery += `update shr.Address set Address1='${faker.address.streetAddress()}', Address2=null, City: '${faker.address.city()}', StateProvince='${faker.address.stateAbbr()}', PostalCode='${faker.address.zipCode()}', County='${faker.address.county()}', Country='USA' where AddressId=${address.AddressId}\n`
            });
            if(config.loggingLevel > 2) {
                console.log(chalk.greenBright(`Replacing addresses`));
                console.log(updateQuery);
            }
            // Update Addresses (incomplete - need to replace '' with updateQuery)
            sql.query('').then(result => {
                console.log(chalk.greenBright(`Addresses update successful`));
            }).catch(err => {
                console.error(`Address update error`);
                console.error(err);
            })
        }).catch(err => {
            console.error(`Address query error`);
            console.error(err);
        })
        // Replace Contacts
        sql.query(`select ${`top ${config.demoTop}`} ContactId from shr.Contact`).then(result => {
            // Loop through each contact replacing it's PII properties with fake data
            let updateQuery = '';
            result.recordset.forEach(contact => {
                const firstName = faker.name.firstName();
                const lastName = faker.name.lastName();
                updateQuery += `update shr.Contact set FirstName='${firstName}', LastName='${lastName}', DisplayName='${lastName}, ${firstName}' where ContactId=${contact.ContactId}\n`
            });
            if(config.loggingLevel > 2) {
                console.log(chalk.greenBright(`Replacing contacts`));
                console.log(updateQuery);
            }
            // Update Contacts (incomplete - need to replace '' with updateQuery)
            sql.query('').then(result => {
                console.log(chalk.greenBright(`Contact update successful`));
                // Replace Emails - Must be done after successful update of contact name, since email address uses the name
                sql.query(`select ${`top ${config.demoTop}`} c.FirstName, c.LastName, e.EmailId from shr.ContactEmailAssoc cea inner join shr.Contact c on c.ContactId=cea.ContactId inner join shr.Email e on e.EmailId=cea.EmailId`).then(result => {
                    // Loop through each email replacing it's PII properties with fake data
                    let updateQuery = '';
                    result.recordset.forEach(email => {
                        const firstName = faker.name.firstName();
                        const lastName = faker.name.lastName();
                        updateQuery += `update shr.Email set EmailAddress='${faker.internet.email(email.FirstName, email.LastName)}' where EmailId=${email.EmailId}\n`
                    });
                    if(config.loggingLevel > 2) {
                        console.log(chalk.greenBright(`Replacing emails`));
                        console.log(updateQuery);
                    }
                    // Update Emails (incomplete - need to replace '' with updateQuery)
                    sql.query('').then(result => {
                        console.log(chalk.greenBright(`Email update successful`));
                    }).catch(err => {
                        console.error(`Email update error`);
                        console.error(err);
                    })
                }).catch(err => {
                    console.error(`Email query error`);
                    console.error(err);
                })
            }).catch(err => {
                console.error(`Contact update error`);
                console.error(err);
            })
        }).catch(err => {
            console.error(`Contact query error`);
            console.error(err);
        })
        // Replace Phones
        sql.query(`select ${`top ${config.demoTop}`} PhoneId from shr.Phone`).then(result => {
            // Loop through each phone replacing it's PII properties with fake data
            let updateQuery = '';
            result.recordset.forEach(phone => {
                let phoneNumber = '';
                for(let i = 0; i < 10; i++) {
                    if(i==0 || i==3) {
                        // First area code digit, and first local digit cannot be 0 or 1
                        phoneNumber += Math.floor(Math.random() * 8 + 2).toString();
                    } else {
                        phoneNumber += Math.floor(Math.random() * 10).toString();
                    }
                }
                updateQuery += `update shr.Phone set PhoneNumber='${phoneNumber}' where PhoneId=${phone.PhoneId}\n`
            });
            if(config.loggingLevel > 2) {
                console.log(chalk.greenBright(`Replacing phones`));
                console.log(updateQuery);
            }
            // Update Phone (incomplete - need to replace '' with updateQuery)
            sql.query('').then(result => {
                console.log(chalk.greenBright(`Phone update successful`));
            }).catch(err => {
                console.error(`Phone update error`);
                console.error(err);
            })
        }).catch(err => {
            console.error(`Phone query error`);
            console.error(err);
        })
    }).catch((err) => {
        console.error(`SQL connection error`);
        console.error(err);
    });
}

module.exports = replaceContactsSql;