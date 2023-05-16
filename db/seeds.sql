INSERT INTO departments
    (name)

VALUES
("Sales"),
("HR"),
("Finance"),
("IT"),
("Legal");

INSERT INTO roles
    (title, salary, department_id)

VALUES
("Sales Lead", 40000, 1)
("Sales Associate", 30000, 1)
("Human Resources", 60000, 2)
("Software Engineer", 76000, 3)
("Lawyer", 80000, 5)
("Accountant", 70000, 3)
("Banker", 50000, 3);

INSERT INTO employees
    (first_name, last_name, role_id, manager_id)

VALUES
("Michael", "Jordank", 1, NULL),
("Tony", "Kukush", 2, 1),
("Luc", "Bongley", 4, 3),
("Scottie", "Spliffen", 5, NULL),
("Son", "Goku", 3, 4),
("Tao", "Pai Pai", 2, NULL),
("Yojibmo", "Bimbsy", 5, 6),
