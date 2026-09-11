PRAGMA foreign_keys = ON;
BEGIN;

CREATE TABLE department (
  department_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  hod_name TEXT NOT NULL
);
CREATE TABLE student (
  student_id INTEGER PRIMARY KEY,
  roll_no TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  department_id INTEGER NOT NULL REFERENCES department(department_id),
  admission_year INTEGER NOT NULL CHECK(admission_year BETWEEN 2000 AND 2100),
  email TEXT NOT NULL UNIQUE
);
CREATE TABLE course (
  course_id INTEGER PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  credits INTEGER NOT NULL CHECK(credits BETWEEN 1 AND 6),
  department_id INTEGER NOT NULL REFERENCES department(department_id)
);
CREATE TABLE semester (
  semester_id INTEGER PRIMARY KEY,
  academic_year TEXT NOT NULL,
  term TEXT NOT NULL CHECK(term IN ('Odd','Even')),
  UNIQUE(academic_year, term)
);
CREATE TABLE enrollment (
  student_id INTEGER NOT NULL REFERENCES student(student_id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES course(course_id),
  semester_id INTEGER NOT NULL REFERENCES semester(semester_id),
  marks INTEGER CHECK(marks BETWEEN 0 AND 100),
  attendance_pct REAL NOT NULL DEFAULT 0 CHECK(attendance_pct BETWEEN 0 AND 100),
  PRIMARY KEY(student_id, course_id, semester_id)
);
CREATE INDEX idx_student_department ON student(department_id);
CREATE INDEX idx_enrollment_course_sem ON enrollment(course_id, semester_id);

INSERT INTO department VALUES (1,'CSE-AI&ML','Dr. Kavitha'),(2,'CSE','Dr. Raman');
INSERT INTO student VALUES
 (101,'23AIML001','Ananya Rao',1,2023,'ananya@college.edu'),
 (102,'23AIML002','Bharat Kumar',1,2023,'bharat@college.edu'),
 (103,'23CSE001','Charan Teja',2,2023,'charan@college.edu');
INSERT INTO course VALUES
 (11,'DBMS301','Database Management Systems',4,1),
 (12,'AIML302','Machine Learning',4,1),
 (13,'CSE303','Operating Systems',3,2);
INSERT INTO semester VALUES (1,'2025-26','Odd');
INSERT INTO enrollment VALUES
 (101,11,1,88,92),(101,12,1,81,89),
 (102,11,1,72,74),(102,12,1,78,84),(103,13,1,91,95);

CREATE VIEW student_semester_result AS
SELECT s.roll_no,s.full_name,se.academic_year,se.term,
       ROUND(SUM(e.marks*c.credits)*1.0/SUM(c.credits),2) AS weighted_average,
       ROUND(AVG(e.attendance_pct),2) AS average_attendance
FROM enrollment e JOIN student s USING(student_id)
JOIN course c USING(course_id) JOIN semester se USING(semester_id)
GROUP BY s.student_id,se.semester_id;
COMMIT;

-- Report 1: student transcript
SELECT s.roll_no,c.code,c.title,e.marks,e.attendance_pct
FROM enrollment e JOIN student s USING(student_id) JOIN course c USING(course_id)
WHERE s.roll_no='23AIML001' ORDER BY c.code;

-- Report 2: course performance and pass percentage
SELECT c.code,ROUND(AVG(e.marks),2) AS average_marks,
       ROUND(100.0*SUM(CASE WHEN e.marks>=40 THEN 1 ELSE 0 END)/COUNT(*),2) AS pass_pct
FROM enrollment e JOIN course c USING(course_id)
GROUP BY c.course_id ORDER BY c.code;

-- Report 3: students below 75% attendance
SELECT s.roll_no,s.full_name,c.code,e.attendance_pct
FROM enrollment e JOIN student s USING(student_id) JOIN course c USING(course_id)
WHERE e.attendance_pct<75 ORDER BY e.attendance_pct;

SELECT * FROM student_semester_result ORDER BY roll_no;
