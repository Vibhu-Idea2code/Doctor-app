const mysql = require('mysql');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_database_user',
  password: 'your_database_password',
  database: 'your_database_name'
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Perform database operations here...

// Close the connection
connection.end((err) => {
  if (err) {
    console.error('Error closing database connection: ', err);
    return;
  }
  console.log('Database connection closed');
});
