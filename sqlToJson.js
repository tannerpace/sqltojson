const mysql = require('promise-mysql');
const fs = require('fs');
require('dotenv').config();

const exportAllTablesToJson = async () => {
  try {

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });


    const tables = await connection.query('SHOW TABLES');
    const tableKey = Object.keys(tables[0])[0];

    const databaseContent = {};

    for (const table of tables) {
      const tableName = table[tableKey];
      console.log(`Exporting table: ${tableName}`);


      const rows = await connection.query(`SELECT * FROM ${tableName}`);


      databaseContent[tableName] = rows;
    }


    const fileName = 'database_export.json';
    fs.writeFileSync(fileName, JSON.stringify(databaseContent, null, 2), 'utf8');
    console.log(`All table data has been exported to ${fileName}`);


    await connection.end();
  } catch (error) {
    console.error('Error exporting data:', error);
  }
};

exportAllTablesToJson();
