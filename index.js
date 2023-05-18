const connection  = require("./db/connections");
const mysql2 = require('mysql2/promise');
const inquirer = require('inquirer');

async function startApp() {
    console.log('Welcome to Employee Tracker!\n');
    const { action } = await inquirer.prompt({
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
    });

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
}
    async function viewEmployees() {
        try {
            const [rows] = await (await connection).query(
            `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM employee AS e
        LEFT JOIN employee AS m ON m.id = e.manager_id
        INNER JOIN role AS r ON e.role_id = r.id
        INNER JOIN departments AS d ON r.department_id = d.id
        ORDER BY e.id`
        );

        console.table(rows);

        startApp();
            }catch (error) {
                console.error('error occurred:', error);
            }
    }


    async function viewDepartments() {
        const [rows] = await (await connection).query(
            `SELECT id, name AS departments
        FROM departments
        ORDER BY id`
        );

        console.table(rows);

        startApp();
    }

    async function viewRoles() {
        const [rows] = await (await connection).query(
            `SELECT r.id, r.title, d.name AS departments, r.salary
        FROM role AS r
        INNER JOIN departments AS d ON r.department_id = d.id
        ORDER BY r.id`
        );

        console.table(rows);

        startApp();
    }

    startApp();

    async function addEmployee() {
        try {
            const roles = await (await connection).query('SELECT id, title FROM role');
            const managers = await (await connection).query('SELECT id, CONCAT(first_name, " ", last_name) AS manager FROM employee');
    
            const employeeData = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: "Enter the employee's first name:",
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: "Enter the employee's last name:",
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: "Select the employee's role:",
                    choices: roles[0].map(role => ({ name: role.title, value: role.id })),
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: "Select the employee's manager:",
                    choices: [...managers[0].map(manager => ({ name: manager.manager, value: manager.id })), { name: 'None', value: null }],
                },
            ]);
    
            await connection.query(
                `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES (?, ?, ?, ?)`,
                [employeeData.first_name, employeeData.last_name, employeeData.role_id, employeeData.manager_id]
            );
    
            console.log('Employee added successfully!\n');
    
            startApp();
        } catch (error) {
            console.error('Error occurred:', error);
        }
    }

    async function addDepartment() {
        try {
            const departmentData = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Enter department name:',
                },
            ]);
        await (await connection).query(
            'INSERT INTO departments (name) VALUES (?)',
            [departmentData.name]
        );
        console.log('department added\n');

        startApp();
    } catch (error) {
        console.error('error occurred', error);
    }
}

async function addRole() {
    try {
        const roleData = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter new role title:',
            },
        ]);
    await (await connection).query(
        'INSERT INTO role (name) VALUES (?)',
        [roleData.name]
    );
    console.log('role added\n');
    startApp();
    } catch (error) {
        console.error('error occurred', error);
    }
}