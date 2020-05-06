'use strict';

// Currently this module is a demo, but 90% complete to production readiness
const chalk = require('chalk'); // Add color to the console
const faker = require('faker/locale/en_US');
const sql = require('mssql');

const replaceVendorsSql = (config) => {
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
        // Get Financial Vendors
        sql.query(`select ${`top ${config.demoTop}`} FinancialVendorId,TaxId from purch.FinancialVendor`).then(result => {
            const  ssnPattern = /^[0-9]{3}\-?[0-9]{2}\-?[0-9]{4}$/;
            // Loop through each FinancialVendor replacing it's PII properties with fake data
            let updateQuery = '';
            result.recordset.forEach(financialVendor => {
                // RegEx for SSN
                if(ssnPattern.test(financialVendor.TaxId)) {
                    let taxId = '';
                    for(let i = 0; i < 11; i++) {
                        if(i==3 || i==6) {
                            taxId += `-`;
                        } else {
                            taxId += Math.floor(Math.random() * 9 + 1).toString(); // Not using 0
                        }
                    }
                    updateQuery += `update purch.FinancialVendor set TaxId='${taxId}' where FinancialVendorId=${financialVendor.FinancialVendorId}\n`
                }
            });
            if(config.loggingLevel > 2) {
                console.log(chalk.greenBright(`Replacing vendors`));
                console.log(updateQuery);
            }
            // Update Vendor (incomplete - need to replace '' with updateQuery)
            sql.query('').then(result => {
                console.log(chalk.greenBright(`Vendor update successful`));
            }).catch(err => {
                console.error(`Vendor update error`);
                console.error(err);
            })
        }).catch(err => {
            console.error(`Vendor query error`);
            console.error(err);
        })
    }).catch((err) => {
        console.error(`SQL connection error`);
        console.error(err);
    });
}

module.exports = replaceVendorsSql;