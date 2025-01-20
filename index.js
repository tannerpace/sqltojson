#!/usr/bin/env node
const path = require('path');
const mysql = require('promise-mysql');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const REQUIRED_ENV_VARS = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_DATABASE'];

// Validate environment variables
const validateEnvVars = () => {
  const missingVars = REQUIRED_ENV_VARS.filter((varName) => !process.env[varName]);
  if (missingVars.length > 0) {
    console.error('The following environment variables are missing in the .env file:');
    missingVars.forEach((varName) => console.error(`  - ${varName}`));
    console.error('Please ensure your .env file includes all required variables.');
    return false;
  }
  return true;
};


const askQuestion = (question) => {
  return new Promise((resolve) => {
    const rl = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(question, (answer) => {
      rl.close();
      const affirmativeAnswers = new Set(['yes', 'y', 'ye', 'yep', 'yeah', 'sure', 'ok', 'okay', 'affirmative']);
      const isAffirmative = affirmativeAnswers.has(answer.trim().toLowerCase());
      resolve(isAffirmative);
    });
  });
};

// Main function to export tables
const exportAllTablesWithTypes = async () => {
  if (!validateEnvVars()) {
    console.log('Expected .env file in:', process.cwd());
    return process.exit(1);
  }

  try {

    const dbName = process.env.DB_DATABASE
    const proceed = await askQuestion(`Do you want to export the database: ${dbName}? (yes/no): `);

    console.log('User Wants to proceed: ', proceed);

    if (!proceed) {
      console.log('User chose not to proceed.');
      return process.exit(0);
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });



    const tables = await connection.query('SHOW TABLES');
    const tableKey = Object.keys(tables[0])[0];
    const databaseContent = {};
    const typeDefinitions = [];

    for (const table of tables) {
      const tableName = table[tableKey];
      console.log(`Exporting table: ${tableName}`);

      const rows = await connection.query(`SELECT * FROM ${tableName}`);
      databaseContent[tableName] = rows;

      const columns = await connection.query(`SHOW COLUMNS FROM ${tableName}`);
      const fields = columns.map(column => {
        const tsType = mapMysqlTypeToTypeScript(column.Type);
        const optional = column.Null === 'YES' ? '?' : '';
        return `  ${column.Field}${optional}: ${tsType};`;
      });
      const typeDef = `export interface ${capitalize(tableName)} {\n${fields.join('\n')}\n}`;
      typeDefinitions.push(typeDef);
    }

    // Ask the user about file export preferences
    const exportSingleFileAnswer = await askQuestion(
      'Do you want to export all tables into a single JSON file? (yes/no): '
    );
    const exportSingleFile = exportSingleFileAnswer === 'yes';

    const exportIndividualFilesAnswer = await askQuestion(
      'Do you want to export each table into individual JSON files? (yes/no): '
    );
    const exportIndividualFiles = exportIndividualFilesAnswer === 'yes';

    if (exportSingleFile) {
      const jsonFileName = 'database_export.json';
      fs.writeFileSync(jsonFileName, JSON.stringify(databaseContent, null, 2), 'utf8');
      console.log(`All table data has been exported to ${jsonFileName}`);
    }

    if (exportIndividualFiles) {
      for (const [tableName, rows] of Object.entries(databaseContent)) {
        const fileName = `${tableName}.json`;
        fs.writeFileSync(fileName, JSON.stringify(rows, null, 2), 'utf8');
        console.log(`Table data for '${tableName}' has been exported to ${fileName}`);
      }
    }

    const typesFileName = 'database_types.d.ts';
    fs.writeFileSync(typesFileName, typeDefinitions.join('\n\n'), 'utf8');
    console.log(`TypeScript types have been exported to ${typesFileName}`);

    await connection.end();
  } catch (error) {
    console.error('Error exporting data:', error);
  }
};

// Map MySQL types to TypeScript types
const mapMysqlTypeToTypeScript = (mysqlType) => {
  if (mysqlType.startsWith('int') || mysqlType.startsWith('decimal') || mysqlType.startsWith('float') || mysqlType.startsWith('double')) {
    return 'number';
  }
  if (mysqlType.startsWith('varchar') || mysqlType.startsWith('text') || mysqlType.startsWith('char')) {
    return 'string';
  }
  if (mysqlType.startsWith('date') || mysqlType.startsWith('timestamp')) {
    return 'Date';
  }
  if (mysqlType.startsWith('tinyint(1)')) {
    return 'boolean';
  }
  return 'any';
};

// Capitalize a string
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

exportAllTablesWithTypes();
