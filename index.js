const { connection } = require('./db/connections');
const mysql2 = require('mysql2');
const inquirer = require('inquirer');

async function startApp() {
    console.log('Welcome to Employee Tracker!\n');
    const {action} = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            {
                name: 'View all employees',
                value: 'VIEW_EMPLOYEES'
            },
            {
                name: 'View all departments',
                value: 'VIEW_DEPARTMENTS'
            },
            {
                name: 'View all roles',
                value: 'VIEW_ROLES'
            },
            {
                name: 'Add an employee',
                value: 'ADD_EMPLOYEE'
            },
            {
                name: 'Add a department',
                value: 'ADD_DEPARTMENT'
            },
            {
                name: 'Add a role',
                value: 'ADD_ROLE'
            },
            {
                name: 'Update an employee role',
                value: 'UPDATE_EMPLOYEE_ROLE'
            },
            {
                name: 'Quit',
                value: 'QUIT'
            }
        ]
    })
};

switch (action) {
    case 'VIEW_EMPLOYEES':
        viewEmployees();
        break;
    case 'VIEW_DEPARTMENTS':
        viewDepartments();
        break;
    case 'VIEW_ROLES':
        viewRoles();
        break;
    case 'ADD_EMPLOYEE':
        addEmployee();
        break;
    case 'ADD_DEPARTMENT':
        addDepartment();
        break;
    case 'ADD_ROLE':
        addRole();
        break;
    case 'UPDATE_EMPLOYEE_ROLE':
        updateEmployeeRole();
        break;
    case 'QUIT':
        console.log('Goodbye!');
        connection.end();
        break;
}

async function viewEmployees() {
    const [rows] = await connection.query(
        `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM employee AS e
        LEFT JOIN employee AS m ON m.id = e.manager_id
        INNER JOIN role AS r ON e.role_id = r.id
        INNER JOIN department AS d ON r.department_id = d.id
        ORDER BY e.id`
    );

    console.table(rows);

    startApp();
}

async function viewDepartments() {
    const [rows] = await connection.query(
        `SELECT id, name AS department
        FROM department
        ORDER BY id`
    );

    console.table(rows);

    startApp();
}

async function viewRoles() {
    const [rows] = await connection.query(
        `SELECT r.id, r.title, d.name AS department, r.salary
        FROM role AS r
        INNER JOIN department AS d ON r.department_id = d.id
        ORDER BY r.id`
    );

    console.table(rows);

    startApp();
}