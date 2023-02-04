USE employees_db;

-- View All Departments
SELECT id, dept_name AS "Name" FROM department
ORDER BY Name;

-- View All Roles
-- Should see id, title, dept name, salary
SELECT roles.id, 
    roles.title AS "Title", 
    department.dept_name AS "Department", 
    roles.salary AS "Salary"
FROM roles
JOIN department ON roles.department_id = department.id;

-- View All Employees
-- Should see id, fName, lName, Title, Department, Salary, Manager NAME
SELECT a.id,
    a.first_name AS "First Name",
    a.last_name AS "Last Name",
    roles.title AS "Title",
    department.dept_name AS "Department",
    roles.salary AS "Salary",
    CONCAT(b.first_name, " ", b.last_name) AS "Manager"
FROM employee AS a
JOIN roles ON a.role_id = roles.id
JOIN department ON roles.department_id = department.id
LEFT OUTER JOIN employee AS b ON a.manager_id = b.id;