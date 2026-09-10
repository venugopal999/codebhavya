"use strict";

const { cMain, makeProgram } = require("./helpers");
const topic = "Structures, Unions & Enums";

module.exports = [
  makeProgram({
    slug: "student-record-structure",
    title: "Store and Display a Student Record Using a Structure",
    topic,
    difficulty: "Intermediate",
    concepts: ["struct", "Members", "Record"],
    source: cMain(`    struct Student student;

    printf("Enter roll number: ");
    scanf("%d", &student.rollNumber);
    getchar();
    printf("Enter name: ");
    fgets(student.name, sizeof student.name, stdin);
    student.name[strcspn(student.name, "\\n")] = '\\0';
    printf("Enter marks: ");
    scanf("%f", &student.marks);
    printf("Roll: %d\\nName: %s\\nMarks: %.2f\\n", student.rollNumber, student.name, student.marks);
    return 0;`, ["stdio.h", "string.h"], `struct Student
{
    int rollNumber;
    char name[100];
    float marks;
};`),
    sampleInput: "101\nBhavya\n89.5",
    sampleOutput: "Roll: 101\nName: Bhavya\nMarks: 89.50",
    method: "Group related student fields in one structure and access them with the dot operator."
  }),
  makeProgram({
    slug: "employee-salary-structure",
    title: "Calculate Employee Gross Salary Using a Structure",
    topic,
    difficulty: "Intermediate",
    concepts: ["struct", "Derived values", "Employee record"],
    source: cMain(`    struct Employee employee;

    scanf("%d", &employee.id);
    scanf("%49s", employee.name);
    scanf("%lf", &employee.basicSalary);
    employee.hra = employee.basicSalary * 0.20;
    employee.da = employee.basicSalary * 0.10;
    printf("ID: %d\\nName: %s\\nGross salary: %.2f\\n",
           employee.id, employee.name, employee.basicSalary + employee.hra + employee.da);
    return 0;`, ["stdio.h"], `struct Employee
{
    int id;
    char name[50];
    double basicSalary;
    double hra;
    double da;
};`),
    sampleInput: "501\nRavi\n30000",
    sampleOutput: "ID: 501\nName: Ravi\nGross salary: 39000.00",
    method: "Store employee data together and calculate allowances from the basic salary."
  }),
  makeProgram({
    slug: "add-complex-numbers-structure",
    title: "Add Two Complex Numbers Using Structures",
    topic,
    difficulty: "Intermediate",
    concepts: ["struct", "Complex numbers", "Function return"],
    source: cMain(`    struct Complex first, second, result;

    printf("Enter real and imaginary parts of first number: ");
    scanf("%lf %lf", &first.real, &first.imaginary);
    printf("Enter real and imaginary parts of second number: ");
    scanf("%lf %lf", &second.real, &second.imaginary);
    result = add(first, second);
    printf("Sum = %.2f %c %.2fi\\n", result.real,
           result.imaginary < 0 ? '-' : '+', result.imaginary < 0 ? -result.imaginary : result.imaginary);
    return 0;`, ["stdio.h"], `struct Complex
{
    double real;
    double imaginary;
};

struct Complex add(struct Complex first, struct Complex second)
{
    struct Complex result = {first.real + second.real, first.imaginary + second.imaginary};
    return result;
}`),
    sampleInput: "3 4\n5 -2",
    sampleOutput: "Sum = 8.00 + 2.00i",
    method: "Add corresponding real and imaginary members and return the result structure."
  })
];
