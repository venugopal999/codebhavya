PRAGMA foreign_keys = ON;
BEGIN;
CREATE TABLE student (
 student_id INTEGER PRIMARY KEY, roll_no TEXT NOT NULL UNIQUE, full_name TEXT NOT NULL,
 branch TEXT NOT NULL, cgpa REAL NOT NULL CHECK(cgpa BETWEEN 0 AND 10),
 active_backlogs INTEGER NOT NULL DEFAULT 0 CHECK(active_backlogs>=0)
);
CREATE TABLE company (
 company_id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE,
 min_cgpa REAL NOT NULL CHECK(min_cgpa BETWEEN 0 AND 10),
 max_backlogs INTEGER NOT NULL DEFAULT 0 CHECK(max_backlogs>=0), package_lpa REAL NOT NULL CHECK(package_lpa>0)
);
CREATE TABLE drive (
 drive_id INTEGER PRIMARY KEY, company_id INTEGER NOT NULL REFERENCES company(company_id),
 drive_date TEXT NOT NULL, role TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN('Scheduled','Completed','Cancelled'))
);
CREATE TABLE application (
 application_id INTEGER PRIMARY KEY, drive_id INTEGER NOT NULL REFERENCES drive(drive_id) ON DELETE CASCADE,
 student_id INTEGER NOT NULL REFERENCES student(student_id) ON DELETE CASCADE,
 applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 stage TEXT NOT NULL CHECK(stage IN('Applied','Aptitude','Technical','HR','Selected','Rejected','Withdrawn')),
 UNIQUE(drive_id,student_id)
);
CREATE TABLE stage_event (
 event_id INTEGER PRIMARY KEY, application_id INTEGER NOT NULL REFERENCES application(application_id) ON DELETE CASCADE,
 stage TEXT NOT NULL, event_time TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, note TEXT
);
CREATE TRIGGER application_stage_audit AFTER UPDATE OF stage ON application
BEGIN INSERT INTO stage_event(application_id,stage,note) VALUES(NEW.application_id,NEW.stage,'Stage updated'); END;
CREATE INDEX idx_application_drive_stage ON application(drive_id,stage);
CREATE INDEX idx_student_eligibility ON student(cgpa,active_backlogs);

INSERT INTO student VALUES (1,'22AIML001','Asha Reddy','AI&ML',8.4,0),(2,'22AIML002','Deepak Sai','AI&ML',7.1,1),(3,'22CSE011','Farah Khan','CSE',9.0,0),(4,'22CSE018','Girish N','CSE',6.8,0);
INSERT INTO company VALUES (1,'NovaSoft',7.0,0,8.5),(2,'DataSpring',6.5,1,5.2);
INSERT INTO drive VALUES (101,1,'2026-09-20','Graduate Engineer','Scheduled'),(102,2,'2026-09-25','Data Analyst','Completed');
INSERT INTO application(application_id,drive_id,student_id,stage) VALUES (1001,101,1,'Technical'),(1002,101,3,'Selected'),(1003,102,2,'Selected'),(1004,102,4,'Rejected');
INSERT INTO stage_event(application_id,stage,note) SELECT application_id,stage,'Initial status' FROM application;
COMMIT;

-- Eligibility is derived, not copied into another table.
SELECT s.roll_no,s.full_name,c.name AS company,c.package_lpa
FROM student s CROSS JOIN company c
WHERE s.cgpa>=c.min_cgpa AND s.active_backlogs<=c.max_backlogs
ORDER BY c.name,s.cgpa DESC;

-- Funnel report uses conditional aggregation.
SELECT c.name,d.role,COUNT(*) AS applicants,
 SUM(a.stage IN('Aptitude','Technical','HR','Selected')) AS cleared_aptitude,
 SUM(a.stage IN('Technical','HR','Selected')) AS reached_technical,
 SUM(a.stage='Selected') AS selected
FROM application a JOIN drive d USING(drive_id) JOIN company c USING(company_id)
GROUP BY d.drive_id ORDER BY d.drive_date;

-- Update inside a transaction; trigger preserves the audit event.
BEGIN;
UPDATE application SET stage='HR' WHERE application_id=1001 AND stage='Technical';
COMMIT;
SELECT a.application_id,s.roll_no,a.stage,se.event_time,se.note
FROM application a JOIN student s USING(student_id) JOIN stage_event se USING(application_id)
ORDER BY a.application_id,se.event_id;
