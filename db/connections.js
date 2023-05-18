const { default: inquirer } = require('inquirer');
const mysql = require('mysql2/promise');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'employees'
    });


module.exports = connection;