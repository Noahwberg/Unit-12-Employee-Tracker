INSERT INTO department (name, manager_first, manager_last)
VALUES ("Engineering", "Ashley", "Rodriguez")
  , ("Finance", "Kunal", "Singh")
  , ("Legal", "Sarah", "Lourd")
  , ("Sales", "John", "Doe");

INSERT INTO employee_role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 4)
  , ("Salesperson", 80000, 4)
  , ("Lead Engineer", 150000, 1)
  , ("Software Engineer", 120000, 1)
  , ("Account Manager", 160000, 2)
  , ("Accountant", 125000, 2)
  , ("Legal Team Lead", 250000, 3)
  , ("Lawyer", 190000, 3);

INSERT INTO employee (first_name, last_name, role_id, department_id)
VALUES ("John", "Doe", 1, 4)
  , ("Mike", "Chan", 6, 2)
  , ("Ashley", "Rodriguez", 3, 1)
  , ("Kevin", "Tupik", 2, 4)
  , ("Kunal", "Singh", 5, 2)
  , ("Malia", "Brown", 4, 1)
  , ("Sarah", "Lourd", 7, 3)
  , ("Tom", "Allen", 8, 3);
