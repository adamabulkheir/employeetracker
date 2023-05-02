const { default: inquirer } = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'employees'
    });

db.connect(function (err){
    if (err) throw (err);
});

module.exports = db;