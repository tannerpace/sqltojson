const mysql = require('promise-mysql');
const fs = require('fs');
require('dotenv').config();

/**
 * Exports all tables from the connected MySQL database to a JSON file.
 * 
 * This function connects to the MySQL database using the credentials provided 
 * in the `.env` file, retrieves all table names, fetches their data, and writes 
 * the data to a JSON file named `database_export.json` in the current directory.
 * 
 * @async
 * @function exportAllTablesToJson
 * @returns {Promise<void>} Resolves when the data export is complete.
 */
const exportAllTablesToJson = async () => {
  try {
    // Establish connection to the database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    // Fetch the list of tables in the database
    const tables = await connection.query('SHOW TABLES');
    const tableKey = Object.keys(tables[0])[0];

    const databaseContent = {};

    // Loop through each table and fetch its data
    for (const table of tables) {
      const tableName = table[tableKey];
      console.log(`Exporting table: ${tableName}`);
      const rows = await connection.query(`SELECT * FROM ${tableName}`);
      databaseContent[tableName] = rows;
    }

    // Write the collected data to a JSON file
    const fileName = 'database_export.json';
    fs.writeFileSync(fileName, JSON.stringify(databaseContent, null, 2), 'utf8');
    console.log(`All table data has been exported to ${fileName}`);

    // Close the database connection
    await connection.end();
  } catch (error) {
    console.error('Error exporting data:', error);
  }
};

exportAllTablesToJson();
