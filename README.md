# sqltojson

sqltojson is a Node.js utility designed to export data from a MySQL database into a single JSON file. This tool is particularly useful for projects transitioning from traditional SQL-based architectures to serverless, object-oriented, or JSON-based systems. It can also be leveraged for data visualization, schema documentation, or generating type definitions for type-safe programming languages like TypeScript.

Features
Convert SQL to JSON: Exports all tables from a MySQL database into a structured JSON object.
Serverless Transition: Facilitates the migration of SQL-based projects to serverless environments by providing an easy-to-consume JSON format.
Data Visualization: Outputs data in a format that can be used directly in visualization tools or front-end applications.
Schema-based Type Definition: Can be used with utilities to auto-generate types or interfaces (e.g., TypeScript definitions) from the exported JSON.
Dynamic and Reusable: Automatically adapts to any database schema, requiring no hardcoding of table names.
Ideal Use Cases
Serverless Applications: Replace traditional database dependencies with a lightweight JSON file for serverless platforms like Vercel or AWS Lambda.
Object-Oriented Development: Convert relational data into object-oriented structures for easier integration into modern programming paradigms.
Data Visualization: Use the JSON output with visualization libraries or tools like D3.js, Tableau, or Power BI.
Type Generation: Generate TypeScript or other type-safe definitions for API or data model layers, ensuring consistent schema definitions across your project.
Requirements
Node.js (version 14.16.1 or later).
A MySQL database.
Access to the MySQL database credentials.
Installation
Clone this repository:

```bash
git clone https://github.com/tannerpace/sqltojson.git
cd sqltojson
Install dependencies:
```
bash
Copy
Edit
npm install
Create a .env file in the project root and add your database credentials:

env
Copy
Edit
DB_HOST=localhost
DB_USER=username
DB_PASSWORD=password
DB_DATABASE=database_name
Usage
Run the script:

bash
Copy
Edit
node sqlToJson.js
The script will:

Connect to the specified database.
Dynamically fetch all table names.
Export all table data into a single JSON file named database_export.json.
Use the database_export.json file for:

Migrating your data to a serverless architecture.
Visualizing your database in JSON format.
Generating type definitions.
Output Format
The output file, database_export.json, contains a JSON object where each key is a table name and its value is an array of rows from that table:

json
Copy
Edit
{
"users": [
{ "id": 1, "username": "user1" },
{ "id": 2, "username": "user2" }
],
"locations": [
{ "id": 1, "name": "Location A" },
{ "id": 2, "name": "Location B" }
]
}
Advanced Features
Generating Type Definitions
The exported JSON file can serve as the basis for generating types or interfaces for languages like TypeScript. For example:

Use tools like quicktype to generate TypeScript types from database_export.json.
Example TypeScript interface generated for the users table:
typescript
Copy
Edit
interface User {
id: number;
username: string;
}
Serverless Transition
Replace database queries with the JSON file in serverless environments like Vercel, AWS Lambda, or Netlify Functions.
Example: Import and use the JSON file in your API routes:
javascript
Copy
Edit
const data = require('./database_export.json');

const getUsers = () => {
return data.users; // Access the users table data
};

console.log(getUsers());
Data Visualization
Integrate the JSON file with tools or libraries like D3.js or Plotly to create visual representations of your data.
Example Workflow
Extract Data: Run the script to generate database_export.json.
Visualize Data: Use the JSON file with your visualization library or tools.
Generate Types: Use utilities like quicktype or custom scripts to create type definitions from the JSON schema.
Deploy Serverless: Serve the JSON file in a serverless architecture by importing it directly in API routes or static files.
Troubleshooting
ER_NO_SUCH_TABLE: Ensure the database contains data and the .env file points to the correct database.
Empty Output: Confirm the tables in your database contain rows.
Node.js Version: Use Node.js version 14.16.1 or later for compatibility.
License
This project is open-source and available under the MIT License.
