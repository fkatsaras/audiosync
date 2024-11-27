const mysql = require('mysql2');
require('dotenv').config();

function createConnection() {
    
    const isTest = process.env.NODE_ENV === 'test' // Check if the environment is test
    const dbName = isTest ? process.env.TEST_DB_NAME : process.env.DB_NAME;

    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: dbName,
        port: process.env.DB_PORT
    });

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

function executeQuery(connection, query, values = []) {
    return new Promise((resolve, reject) => {

        let fQuery = query;
        // Log the query with the values for debugging purposes
        // Replace placeholders (?)
        if (values.length > 0) {
            fQuery = query.replace(/\?/g, () => {
                // Pop the first element from the values array and replace the placeholder
                const value = values.shift();
                // For safety, you might want to sanitize or format this value for logging
                return typeof value === 'string' ? `'${value}'` : value;
            });
        }

        // console.log("Executing query: ", fQuery);  // Log the final query with values

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

// Exporting functions
module.exports = {
    createConnection,
    closeConnection,
    executeQuery,
    callProcedure
};