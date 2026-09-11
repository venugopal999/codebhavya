PRAGMA foreign_keys = ON;
BEGIN;
CREATE TABLE member(member_id INTEGER PRIMARY KEY,member_code TEXT NOT NULL UNIQUE,full_name TEXT NOT NULL,member_type TEXT NOT NULL CHECK(member_type IN('Student','Faculty')),active INTEGER NOT NULL DEFAULT 1 CHECK(active IN(0,1)));
CREATE TABLE book(book_id INTEGER PRIMARY KEY,isbn TEXT NOT NULL UNIQUE,title TEXT NOT NULL,author TEXT NOT NULL,subject TEXT NOT NULL);
CREATE TABLE copy(copy_id INTEGER PRIMARY KEY,book_id INTEGER NOT NULL REFERENCES book(book_id),accession_no TEXT NOT NULL UNIQUE,status TEXT NOT NULL DEFAULT 'Available' CHECK(status IN('Available','On Loan','Lost','Repair')));
CREATE TABLE loan(loan_id INTEGER PRIMARY KEY,copy_id INTEGER NOT NULL REFERENCES copy(copy_id),member_id INTEGER NOT NULL REFERENCES member(member_id),issued_on TEXT NOT NULL,due_on TEXT NOT NULL,returned_on TEXT, CHECK(due_on>=issued_on),CHECK(returned_on IS NULL OR returned_on>=issued_on));
CREATE UNIQUE INDEX one_open_loan_per_copy ON loan(copy_id) WHERE returned_on IS NULL;
CREATE INDEX idx_loan_member_open ON loan(member_id,returned_on);
CREATE TRIGGER mark_copy_on_loan AFTER INSERT ON loan WHEN NEW.returned_on IS NULL
BEGIN UPDATE copy SET status='On Loan' WHERE copy_id=NEW.copy_id; END;
CREATE TRIGGER mark_copy_returned AFTER UPDATE OF returned_on ON loan WHEN OLD.returned_on IS NULL AND NEW.returned_on IS NOT NULL
BEGIN UPDATE copy SET status='Available' WHERE copy_id=NEW.copy_id; END;
CREATE VIEW overdue_loans AS
SELECT l.loan_id,m.member_code,m.full_name,b.title,l.due_on,
 CAST(julianday('2026-09-11')-julianday(l.due_on) AS INTEGER) AS days_overdue
FROM loan l JOIN member m USING(member_id) JOIN copy c USING(copy_id) JOIN book b USING(book_id)
WHERE l.returned_on IS NULL AND l.due_on<'2026-09-11';

INSERT INTO member VALUES(1,'S24001','Ishita Rao','Student',1),(2,'F0012','Dr. Meera','Faculty',1);
INSERT INTO book VALUES(1,'9780133970777','Fundamentals of Database Systems','Elmasri and Navathe','DBMS'),(2,'9780262033848','Introduction to Algorithms','Cormen et al.','Algorithms');
INSERT INTO copy VALUES(11,1,'A1001','Available'),(12,1,'A1002','Available'),(21,2,'A2001','Available');
INSERT INTO loan VALUES(101,11,1,'2026-08-20','2026-09-03',NULL),(102,21,2,'2026-09-01','2026-09-29',NULL);
COMMIT;

SELECT b.title,COUNT(*) AS total_copies,SUM(c.status='Available') AS available_copies
FROM book b JOIN copy c USING(book_id) GROUP BY b.book_id ORDER BY b.title;
SELECT *,days_overdue*2 AS illustrative_fine FROM overdue_loans ORDER BY days_overdue DESC;

-- A return is atomic: update the loan; the trigger releases the physical copy.
BEGIN;
UPDATE loan SET returned_on='2026-09-11' WHERE loan_id=101 AND returned_on IS NULL;
COMMIT;
SELECT l.loan_id,l.returned_on,c.accession_no,c.status FROM loan l JOIN copy c USING(copy_id) ORDER BY l.loan_id;

-- Most borrowed titles, including ties by deterministic title order.
SELECT b.title,COUNT(l.loan_id) AS borrow_count FROM book b JOIN copy c USING(book_id)
LEFT JOIN loan l USING(copy_id) GROUP BY b.book_id ORDER BY borrow_count DESC,b.title;
