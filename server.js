const express = require('express');
const mysql = require('mysql2');
const inquirer = require("inquirer");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Berg2585',
    database: 'employee_db'
  },
  console.log(`Connecting to employee_db database.`)
);

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database: employee_db ' + err.stack);
    return;
  }

  console.log('Connected to database with ID ' + db.threadId);
  init();
});

const start = [
  {
    type: "list", message: "What would you like to do in the database?", name: "Add"
    , choices: [
      "Display All Employees"
      , "Add Employee"
      , "Refresh Employee Role"
      , "Display All Roles"
      , "Create New Role"
      , "Refresh Salary By Role"
      , "Display All Departments"
      , "Create Department"
      , "Refresh Manager By Department"
      , "Exit"
    ]
  }
];

function init() {
  inquirer.prompt(start).then((choices) => {
    // console.log(choices, "choices");
    if(choices.Add === "Display All Employees") {
        displayAllEmployees();
    } else if (choices.Add === "Add Employee") {
        addEmployee();
    } else if (choices.Add === "Refresh Employee Role") {
        reloadEmployeeRole();
    } else if (choices.Add === "Display All Roles") {
        displayAllRoles();
    } else if (choices.Add === "Create New Role") {
        createNewRole();
    } else if (choices.Add === "Refresh Salary By Role") {
        reloadSalaryByRole();
    } else if (choices.Add === "Display All Departments") {
        displayAllDepartments();
    } else if (choices.Add === "Create Department") {
        createDepartment();
    } else if (choices.Add === "Refresh Manager By Department") {
        reloadDepartmentByManager();
    } else if (choices.Add === "Exit") {
        process.exit;
    }
  })
  // .catch((error) => {
  //   console.log(error)
  // })
  // inquirer.prompt(start).then();
};
async function createNewRole() {
  db.query(`SELECT * FROM department ORDER BY id ASC;`
      , function (err, results) {
          if (err) throw err;
            const departments = results.map(element => {
              return element.name
            })
            const mainId = results.map(element => {
              return element.id
            })
            inquirer.prompt([
                {
                  type: "input" , message: "What role are you looking for?", name: "role"
               }
                , {
                  type: "input", message: "What is the salary of the role you are looking for?", name: "salary"
                }
                , {
                  type: "list", message: "Please choose what the department id is?", name: "department", choices: departments
                }
            ]).then((choices) => {
                const numberId = departments.findIndex((departments) => departments === choices.department)
                const department_id = mainId[numberId]
                db.query(`INSERT INTO employee_role (title, salary, department_id)
                    VALUES ('${choices.role}', '${choices.salary}', '${department_id}');`
                    , function (err, results) {
                    console.log(`Added ${choices.role} to the database`);
                    setTimeout(() => init(), 2000)
                    // init();
                });
            })
    });
    
}
async function reloadSalaryByRole() {
  db.query(`SELECT id, title FROM employee_role ORDER BY id ASC;`
      , function (err, results) {
           if (err) throw err;
            const roles = results.map(element => {
              return element.title
            })
            const mainId = results.map(element => {
              return element.id
            })
            inquirer.prompt([
                {
                  type: "list", message: "What is the employee's new role?", name: "role", choices: roles
                }
                , {
                  type: "input", message: "What would be the new salary of the role?", name: "salary"
                }
            ]).then((choices) => {
                const numberId = roles.findIndex((roles) => roles === choices.role)
                const role_id = mainId[numberId]
                db.query(`UPDATE employee_role 
                    SET salary = ${choices.salary}
                    WHERE id = ${role_id};`
                    , function (err, results) {
                        console.log(`Updated ${choices.role}'s salary in the database`);
                        setTimeout(() => init(), 2000)
                });
            })
    });
}
async function chooseRole(employee_id, employee) {
  db.query(`SELECT id, title, department_id FROM employee_role ORDER BY id ASC;`
      , function (err, results) {
          if (err) throw err;
            const roles = results.map(element => {
              return element.title
            })
            const departments = results.map(element => {
              return element.department_id
            })
            const mainId = results.map(element => {
              return element.id
            })
            
            inquirer.prompt([
                {
                  type: "list", message: "What is the new role on the employee?", name: "role", choices: roles
                }
            ]).then((choices) => {
                const numberId = roles.findIndex((roles) => roles === choices.role)
                const role_id = mainId[numberId]
                const department_id = departments[numberId]
                db.query(`UPDATE employee 
                    SET role_id = ${role_id}, department_id = ${department_id}
                    WHERE id = ${employee_id};`
                    , function (err, results) {
                        console.log(`Updated ${employee}'s role in the database`);
                        setTimeout(() => init(), 2000)
                });
            })
    });
}
async function reloadEmployeeRole() {
  db.query(`SELECT id, concat(first_name, ' ', last_name) as employee FROM employee ORDER BY id ASC;`
        , function (err, results) {
            if (err) throw err;
            const employees = results.map(element => {
              return element.employee
            })
            const mainId = results.map(element => {
              return element.id
            })
            
            inquirer.prompt([
                {
                  type: "list", message: "Which employee would you like to update in the database?", name: "employee", choices: employees
               }
            ]).then((choices) => {
                const numberId = employees.findIndex((employees) => employees === choices.employee)
                const employee_id = mainId[numberId]
                chooseRole(employee_id, choices.employee);
            })
        }
    );
}
async function addEmployee() {
  db.query(`SELECT * FROM employee_role ORDER BY id ASC;`
      , function (err, results) {
          if (err) throw err;
            const tempRole = results.map(element => {
              return element.title
            });
            const addRoleIds = results.map(element => {
              return element.id
            });
            const addDepartmentIds = results.map(element => {
              return element.department_id
            });
            
            inquirer.prompt([
                {
                  type: "input", message: "What is the employee's first name?", name: "first"
               }
                , {
                  type: "input", message: "What is the employee's last name?", name: "last"
                }
                , {
                  type: "list", message: "What is the employee's role?", name: "role", choices: tempRole
                }
            ]).then((choices) => {
                const roleIdNumber = tempRole.findIndex((tempRole) => tempRole === choices.role)
                const role_id = addRoleIds[roleIdNumber]
                const department_id = addDepartmentIds[roleIdNumber]
                db.query(`INSERT INTO employee (first_name, last_name, role_id, department_id)
                    VALUES ('${choices.first}', '${choices.last}', '${role_id}', '${department_id}');`
                    , function (err, results) {
                        console.log(`Added ${choices.first} ${choices.last} to the database`);
                        setTimeout(() => init(), 2000)
                });
            })
    });
    
}
async function createDepartment() {
  db.query(`SELECT first_name, last_name, concat(first_name, ' ', last_name) as managers FROM employee ORDER BY id ASC;`
      , function (err, results) {
          if (err) throw err;
            const managers = results.map(element => {
              return element.managers
            })
            const first = results.map(element => {
              return element.first_name
            })
            const last = results.map(element => {
              return element.last_name
            })
            
            inquirer.prompt([
                {
                  type: "input", message: "What is the name of the department?", name: "department"
                }
                , {
                  type: "list", message: "Who is the department's manager?", name: "manager", choices: managers
                }
            ]).then((choices) => {
                const numberId = managers.findIndex((managers) => managers === choices.manager)
                const lastName = last[numberId]
                const firstName = first[numberId]
                db.query(`INSERT INTO department (name, manager_first, manager_last)
                    VALUES ('${choices.department}', '${firstName}', '${lastName}');`
                    , function (err, results) {
                    console.log(`Added ${choices.department} to the database`);
                    setTimeout(() => init(), 2000)
                });
            })
    });
}
async function reloadDepartmentManager(department, id) {
  db.query(`SELECT first_name, last_name, concat(first_name, ' ', last_name) as managers FROM employee ORDER BY id ASC;`
      , function (err, results) {
          if (err) throw err;
            const managers = results.map(element => {
              return element.managers
            })
            const first = results.map(element => {
              return element.first_name
            })
            const last = results.map(element => {
              return element.last_name
            })
            
            inquirer.prompt([
              {
                type: "list", message: "Who is the department's new manager?", name: "manager", choices: managers
              }
            ]).then((choices) => {
                const numberId = managers.findIndex((managers) => managers === choices.manager)
                const lastName = last[numberId]
                const firstName = first[numberId]
                db.query(`UPDATE department 
                    SET manager_first = '${firstName}', manager_last = '${lastName}'
                    WHERE id = ${id};`
                    , function (err, results) {
                    console.log(`Updated the manager of ${department} in the database`);
                    setTimeout(() => init(), 2000)
                });
            })
    });
}
async function reloadDepartmentByManager() {
  db.query(`SELECT id, name FROM department ORDER BY id ASC;`
      , function (err, results) {
          if (err) throw err;
            const departments = results.map(element => {
              return element.name
            })
            const mainId = results.map(element => {
              return element.id
            })
            
            inquirer.prompt([
              {
                type: "list", message: "What department would you like to update the manager?", name: "department", choices: departments
              }
            ]).then((choices) => {
                const numberId = departments.findIndex((departments) => departments === choices.department)
                const id = mainId[numberId]
                reloadDepartmentManager(choices.department, id)
            })
    });
}
async function displayAllEmployees() {
  db.query(`SELECT employ.id
    , concat(employ.first_name, ' ', employ.last_name) as Employee
    , role.title as Title
    , depart.name as Department
    , role.salary as Salary
    , concat(depart.manager_first, ' ', depart.manager_last) as Manager
    FROM employee employ
    INNER JOIN department depart 
    ON employ.department_id = depart.id
    INNER JOIN employee_role role
    ON employ.role_id = role.id
    ORDER BY id ASC;`, function (err, results) {
    console.table(results);
  });
    setTimeout(() => init(), 2000)
}
async function displayAllRoles() {
  db.query(`SELECT role.id
    , role.title as title
    , depart.name as department
    , role.salary
    FROM employee_role role
    INNER JOIN department depart 
    ON role.department_id = depart.id
    ORDER BY id ASC;`, function (err, results) {
    console.table(results);
  });
    setTimeout(() => init(), 2000)
}
async function displayAllDepartments() {
  db.query(`SELECT depart.id
    , depart.name as Department
    , concat(depart.manager_first, ' ', depart.manager_last) as Manager
    FROM department depart
    ORDER BY id ASC;`, function (err, results) {
    console.table(results);
  });
    setTimeout(() => init(), 2000)
}

// init();
