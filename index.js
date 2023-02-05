const express = require("express");
// Import and require mysql2, inquirer8.2.4, and console.table
const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "Password321!",
    database: "employees_db",
  },
  console.log(`\nConnected to the employees_db database.`)
);

// VIEW FUNCTIONS

// View All Departments
const viewDepartments = () => {
  // Sort by Dept A-Z because humans like that kind of thing
  const sql = `
    SELECT id, dept_name AS "Department" 
    FROM department
    ORDER BY dept_name;`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(rows);
    firstPrompt();
  });
};

// View All Roles
const viewRoles = () => {
  const sql = `
    SELECT  
      roles.title AS "Title", 
      roles.id AS "Role ID",
      department.dept_name AS "Department", 
      roles.salary AS "Salary"
    FROM roles
    JOIN department 
    ON roles.department_id = department.id
    ORDER BY roles.title;`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(rows);
    firstPrompt();
  });
};

// View All Employees
const viewEmployees = async () => {
  // employee table aliased twice, as a and b
  // in order to make the self join, manager name display
  // LEFT OUTER JOIN ensures Managers (nulls) are included
  const sql = `
    SELECT a.id,
      a.first_name AS "First Name",
      a.last_name AS "Last Name",
      roles.title AS "Title",
      department.dept_name AS "Department",
      roles.salary AS "Salary",
      CONCAT(b.first_name, " ", b.last_name) AS "Manager"
    FROM employee AS a
    JOIN roles 
    ON a.role_id = roles.id
    JOIN department 
    ON roles.department_id = department.id
    LEFT OUTER JOIN employee AS b 
    ON a.manager_id = b.id;`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(rows);
    firstPrompt();
  });
};

// ADD FUNCTIONS
// Add a new Department
const addDepartment = () => {
  inquirer
    .prompt({
      type: "input",
      name: "deptName",
      message: "Please enter the name of the department to add:",
    })
    .then((data) => {
      const sql = `INSERT INTO department (dept_name) VALUES (?);`;
      db.query(sql, data.deptName, (err, rows) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(`Added ${data.deptName} to the database.\n`);
        viewDepartments();
      });
    });
};

// Add a new role
const addRole = () => {
  inquirer.prompt([
    {
      type: "input",
      name: "roleName",
      message: "Please enter the NAME of the new role:",
    },
    {
      type: "input",
      name: "roleSalary",
      message: "Please enter the SALARY of the new role:",
    },
    {
      type: "list",
      message: "Please select a DEPARTMENT for the new role:",
      name: "roleDepartment",
      choices: ["1", "2", "3", "4"],
    }
  ])
  .then((data) => {
    const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);`;
    const params = [data.roleName, data.roleSalary, data.roleDepartment]
    db.query(sql, params, (err, rows) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(`Added ${data.roleName} to the database.\n`);
      viewRoles();
    });
  })
};

// Prompts for user input
const firstPrompt = () => {
  console.log("\n");
  inquirer
    .prompt([
      {
        type: "list",
        message: "Main Menu: What would you like to do?",
        name: "firstChoice",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
          "Quit",
        ],
      },
    ])
    .then((data) => {
      switch (data.firstChoice) {
        case "View All Departments":
          viewDepartments();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "View All Employees":
          viewEmployees();
          break;
        case "Add a Department":
          addDepartment();
          break;
        case "Add a Role":
          addRole();
          break;
        case "Quit":
          process.exit(0);
      }
    });
};

const init = () => firstPrompt();

init();