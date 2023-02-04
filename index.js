const express = require("express");
// Import and require mysql2, inquirer8.2.4, and console.table
const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require('console.table');


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
  const sql = `SELECT id, dept_name AS "Department" FROM department
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
  ON roles.department_id = department.id;`;

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
  const sql = `SELECT a.id,
    a.first_name AS "First Name",
    a.last_name AS "Last Name",
    roles.title AS "Title",
    department.dept_name AS "Department",
    roles.salary AS "Salary",
    CONCAT(b.first_name, " ", b.last_name) AS "Manager"
  FROM employee AS a
  JOIN roles ON a.role_id = roles.id
  JOIN department ON roles.department_id = department.id
  LEFT OUTER JOIN employee AS b ON a.manager_id = b.id;`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(rows);
    firstPrompt();
  });
};

const firstPrompt = () => {
  console.log("\n");
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do first?",
        name: "firstChoice",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
          "Quit"
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
        case "Quit":
          process.exit(0);
      }
    });
};

const init = () => firstPrompt();

init();
