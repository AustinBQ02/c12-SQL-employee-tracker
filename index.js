const express = require('express');
// Import and require mysql2, inquirer8.2.4, and console.table
const mysql = require('mysql2');
const inquirer = require('inquirer');


// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Password321!',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
);


// View All Departments
const viewDepartments = () => {
  const sql = `SELECT id, dept_name AS "Department" FROM department
  ORDER BY dept_name;`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(rows)
  });
}

inquirer.prompt([
  {
    type: 'list',
    message: 'Choose View Departments',
    name: 'view',
    choices: ['View Departments'],
  },
])
.then((data) => 
  data.view === "View Departments"
    ? viewDepartments()
    : console.log('What have you done?')
);

