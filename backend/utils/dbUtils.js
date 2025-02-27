const mysql = require('mysql2');
require('dotenv').config();

function getDbDetails() {
    const environment = process.env.NODE_ENV || 'development';
    let dbConfig;

    if (environment == 'test') {
        dbConfig = {
            host: process.env.TEST_DB_HOST,
            user: process.env.TEST_DB_USER,
            password: process.env.TEST_DB_PASSWORD,
            database: process.env.TEST_DB_NAME,
            port: process.env.TEST_DB_PORT || 3306,
        }
    } else if (environment == 'production') {
        dbConfig = {
            host: process.env.PROD_DB_HOST,
            user: process.env.PROD_DB_USER,
            password: process.env.PROD_DB_PASSWORD,
            database: process.env.PROD_DB_NAME,
            port: process.env.PROD_DB_PORT || 3306,
        }
    } else {
        dbConfig = {
            host: process.env.DEV_DB_HOST,
            user: process.env.DEV_DB_USER,
            password: process.env.DEV_DB_PASSWORD,
            database: process.env.DEV_DB_NAME,
            port: process.env.DEV_DB_PORT || 3306,
        }
    }

    return dbConfig;
}

function createConnection() {

    const dbConfig = getDbDetails();
    // Create the database connection
    const connection = mysql.createConnection(dbConfig);

    connection.connect((err) => {
        if (err) {
            console.error(`An error occurred during connection: ${err}`);
            return null;
        }
        // console.log(`Connection to ${dbName} was successful`);
    });

    return connection;
}

function closeConnection(connection) {
    if (connection && connection.state !== 'disconnected') {
        connection.end((err) => {
            if (err) {
                console.error(`An error occurred while closing the connection: ${err}`);
            } else {
                // console.log("Connection to MySQL DB closed.");
            }
        });
    }
}

function escapeQuotesInString(value) {
    // Replace single quotes to avoid mysql2 issues
    return value.replace(/'/g,"''")
}

function executeQuery(connection, query, values = []) {
    return new Promise((resolve, reject) => {

        let fQuery = query;
        // Log the query with the values for debugging purposes
        // Replace placeholders (?)
        if (values.length > 0) {
            fQuery = query.replace(/\?/g, () => {
                // Pop the first element from the values array and replace the placeholder
                const value = values.shift();
                // For safety, sanitize or format this value for logging
                if (typeof value === 'string') {
                    return `'${escapeQuotesInString(value)}'`
                } else {
                    return value
                }
            });
        }

        console.log("Executing query: ", fQuery);  // Log the final query with values

        // Execute the query
        connection.execute(fQuery, (err, results, fields) => {
            if (err) {
                console.error(`An error occurred during query execution: ${err}`);
                reject(err);
            } else {
                // console.log(results);
                // console.log(fields);
                resolve(results);
            }
        });
    });
}

function executeProcQuery(connection, query, values = []) {
    return new Promise((resolve, reject) => {
        connection.execute(query, values, (err, results) => {
            if (err) {
                console.error(`An error occurred during query execution: ${err}`);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function callProcedure(connection, procedureName, inParams = [], outParams = []) {
    return new Promise(async (resolve, reject) => {
        try {
            // Prepare placeholders for IN and OUT parameters
            const inPlaceholders = inParams.map(() => '?').join(', ');
            const outPlaceholders = outParams.map(param => `@${param}`).join(', ');

            // Call the stored procedure
            const query = `CALL ${procedureName}(${inPlaceholders}, ${outPlaceholders});`;
            await executeProcQuery(connection, query, inParams);

            // Fetch OUT parameters
            const outputQuery = `SELECT ${outParams.map(param => `@${param}`).join(', ')};`;
            const outputResult = await executeProcQuery(connection, outputQuery);

            if (outputResult && Array.isArray(outputResult) && outputResult.length > 0) {
                // Extract each output parameter in the order specified by outParams
                const outValues = outParams.map(param => outputResult[0][`@${param}`] ?? null);

                // Log for debugging
                // console.log('Output values from stored procedure:', outValues);
                
                resolve(outValues);
            } else {
                console.error(`Unexpected output structure from procedure ${procedureName}.`);
                reject(new Error(`No output returned from procedure ${procedureName}`));
            }
        } catch (err) {
            console.error(`Error calling stored procedure ${procedureName}: ${err.message}`);
            reject(new Error(`Error calling stored procedure ${procedureName}: ${err.message}`));
        }
    });
}

function beginTransaction(connection) {
    return new Promise((resolve, reject) => {
        connection.beginTransaction((err) => {
            if (err) {
                console.error(`An error occurred while starting the transaction: ${err.message}`);
                reject(err);
            } else {
                // console.log("Transaction started successfully.");
                resolve();
            }
        });
    });
}


function rollbackTransaction(connection) {
    return new Promise((resolve, reject) => {
        connection.rollback((err) => {
            if (err) {
                console.error(`An error occurred during transaction rollback: ${err}`);
                reject(err);
            } else {
                // console.log("Transaction rolled back successfully.");
                resolve();
            }
        });
    });
}

function commitTransaction(connection) {
    return new Promise((resolve, reject) => {
        connection.commit((err) => {
            if (err) {
                console.error(`An error occurred during transaction commit: ${err}`);
                reject(err);
            } else {
                // console.log("Transaction committed successfully.");
                resolve();
            }
        });
    });
}

// Exporting functions
module.exports = {
    getDbDetails,
    createConnection,
    closeConnection,
    executeQuery,
    callProcedure,
    rollbackTransaction,
    commitTransaction,
    beginTransaction
};