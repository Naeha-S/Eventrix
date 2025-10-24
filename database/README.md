# Eventrix Database Documentation

## 📊 Database Schema Overview

This DBMS project implements a complete **Event Management System** with proper relational database design, including:

- **5 Main Tables**: Users, Events, Equipment, Bookings, CheckIns
- **Foreign Key Relationships** with referential integrity
- **Indexes** for query optimization
- **Views** for complex data aggregation
- **Stored Procedures** (MySQL version)
- **Triggers** for data consistency
- **Advanced SQL Queries** demonstrating DBMS concepts

---

## 🗂️ Database Files

### MySQL/PL-SQL Version (Production)
- **`schema.sql`** - Complete MySQL schema with stored procedures and triggers
- **`sample_data.sql`** - Sample data inserts for testing
- **`queries.sql`** - 15 advanced SQL queries demonstrating DBMS concepts

### SQLite Version (Local Development)
- **`schema_sqlite.sql`** - SQLite-compatible schema
- **`sample_data_sqlite.sql`** - Sample data for SQLite
- **`eventrix.db`** - SQLite database file (auto-generated)

---

## 📋 Entity-Relationship Model

```
Users (1) ──────< (M) Events
  │                     │
  │                     │
  ├──< (M) Bookings >───┤
  │         │
  │         └───< (M) Equipment
  │
  └──────< (M) CheckIns >──────┘
```

### Table Descriptions

#### 1. **Users**
Stores user information for organizers, volunteers, and participants.

| Column       | Type    | Description                          |
|--------------|---------|--------------------------------------|
| user_id      | INT PK  | Primary key (auto-increment)         |
| name         | VARCHAR | Full name of user                    |
| email        | VARCHAR | Unique email address                 |
| phone        | VARCHAR | Contact number                       |
| role         | ENUM    | Organizer/Volunteer/Participant      |
| roll_number  | VARCHAR | Unique student/employee ID           |

**Constraints:**
- UNIQUE on `email` and `roll_number`
- Indexes on `email`, `role`, `roll_number`

---

#### 2. **Events**
Stores event details and links to organizers.

| Column       | Type     | Description                         |
|--------------|----------|-------------------------------------|
| event_id     | INT PK   | Primary key (auto-increment)        |
| event_name   | VARCHAR  | Name of the event                   |
| event_date   | DATETIME | Date and time of event              |
| venue        | VARCHAR  | Location of event                   |
| description  | TEXT     | Detailed event description          |
| organizer_id | INT FK   | Foreign key to Users.user_id        |

**Constraints:**
- FOREIGN KEY `organizer_id` → Users(user_id) ON DELETE RESTRICT
- Indexes on `event_date`, `organizer_id`, `venue`

---

#### 3. **Equipment**
Stores equipment/resource inventory.

| Column        | Type    | Description                        |
|---------------|---------|------------------------------------|
| equip_id      | INT PK  | Primary key (auto-increment)       |
| equip_name    | VARCHAR | Name of equipment                  |
| category      | VARCHAR | Category (AV, Audio, IT, etc.)     |
| status        | ENUM    | Available/Borrowed/Damaged         |
| location      | VARCHAR | Physical location                  |
| purchase_date | DATE    | Date of purchase                   |

**Constraints:**
- Indexes on `status`, `category`, `location`

---

#### 4. **Bookings**
Tracks equipment bookings for events.

| Column       | Type    | Description                         |
|--------------|---------|-------------------------------------|
| booking_id   | INT PK  | Primary key (auto-increment)        |
| event_id     | INT FK  | Foreign key to Events.event_id      |
| equip_id     | INT FK  | Foreign key to Equipment.equip_id   |
| assigned_to  | INT FK  | Foreign key to Users.user_id        |
| borrow_date  | DATE    | Date equipment was borrowed         |
| return_date  | DATE    | Date equipment was returned (NULL = not returned) |
| remarks      | TEXT    | Additional notes                    |

**Constraints:**
- FOREIGN KEYs with CASCADE/RESTRICT policies
- CHECK: `return_date >= borrow_date`
- Indexes on `event_id`, `equip_id`, `assigned_to`, dates

---

#### 5. **CheckIns**
Tracks attendee check-ins and check-outs for events.

| Column         | Type     | Description                      |
|----------------|----------|----------------------------------|
| checkin_id     | INT PK   | Primary key (auto-increment)     |
| user_id        | INT FK   | Foreign key to Users.user_id     |
| event_id       | INT FK   | Foreign key to Events.event_id   |
| checkin_time   | DATETIME | Check-in timestamp               |
| checkout_time  | DATETIME | Check-out timestamp (nullable)   |
| status         | ENUM     | Present/Absent                   |

**Constraints:**
- UNIQUE(user_id, event_id) - one check-in per user per event
- CHECK: `checkout_time >= checkin_time`
- Indexes on `user_id`, `event_id`, `checkin_time`, `status`

---

## 🔍 Database Views

### 1. **vw_event_summary**
Event details with organizer info and attendance counts.

```sql
SELECT * FROM vw_event_summary;
```

### 2. **vw_equipment_status**
Real-time equipment availability and current bookings.

```sql
SELECT * FROM vw_equipment_status WHERE status = 'Available';
```

### 3. **vw_user_activity**
User engagement metrics (organized/attended events, bookings).

```sql
SELECT * FROM vw_user_activity ORDER BY organized_events DESC;
```

---

## ⚙️ Stored Procedures (MySQL)

### 1. **sp_checkin_user**
Check-in a user to an event.

```sql
CALL sp_checkin_user(3, 101, @checkin_id);
SELECT @checkin_id;
```

### 2. **sp_book_equipment**
Book equipment for an event (with availability check).

```sql
CALL sp_book_equipment(101, 201, 2, '2024-08-14', 'For presentation', @booking_id);
```

### 3. **sp_return_equipment**
Return equipment and update status.

```sql
CALL sp_return_equipment(301, '2024-08-16');
```

---

## 🎯 Advanced SQL Queries

The `queries.sql` file includes 15 complex queries demonstrating:

1. **JOINS** - Multi-table joins with aggregations
2. **SUBQUERIES** - Nested and correlated subqueries
3. **AGGREGATION** - GROUP BY with HAVING clauses
4. **WINDOW FUNCTIONS** - RANK(), ROW_NUMBER(), DENSE_RANK()
5. **DATE FUNCTIONS** - Temporal analysis
6. **SET OPERATIONS** - UNION queries
7. **PIVOT QUERIES** - Monthly statistics
8. **RECURSIVE CTEs** - Hierarchical data (MySQL 8.0+)
9. **CONFLICT DETECTION** - Overlapping bookings
10. **ANALYTICS** - ROI analysis, engagement scores

### Example: Top 5 Most Popular Events

```sql
SELECT 
    e.event_name,
    COUNT(c.checkin_id) AS attendees,
    RANK() OVER (ORDER BY COUNT(c.checkin_id) DESC) AS popularity_rank
FROM Events e
LEFT JOIN CheckIns c ON e.event_id = c.event_id
GROUP BY e.event_id, e.event_name
ORDER BY attendees DESC
LIMIT 5;
```

---

## 🚀 Setup Instructions

### Option 1: MySQL Setup (Recommended for Production)

#### Prerequisites
- MySQL Server 8.0+ or MariaDB 10.5+
- MySQL Workbench or command-line client

#### Steps

1. **Create Database**
```sql
CREATE DATABASE eventrix CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE eventrix;
```

2. **Import Schema**
```bash
mysql -u root -p eventrix < database/schema.sql
```

3. **Import Sample Data**
```bash
mysql -u root -p eventrix < database/sample_data.sql
```

4. **Verify Installation**
```sql
SHOW TABLES;
SELECT * FROM vw_event_summary;
```

#### Connection Details
```
Host: localhost
Port: 3306
Database: eventrix
Username: root (or your MySQL user)
Password: [your password]
```

---

### Option 2: SQLite Setup (Easy Local Development)

#### Prerequisites
- SQLite3 (usually pre-installed on Windows/Mac/Linux)
- Or use the Node.js `better-sqlite3` package (see below)

#### Steps

1. **Create and Initialize Database**
```bash
cd database
sqlite3 eventrix.db < schema_sqlite.sql
sqlite3 eventrix.db < sample_data_sqlite.sql
```

2. **Verify Installation**
```bash
sqlite3 eventrix.db "SELECT * FROM vw_event_summary;"
```

3. **Interactive Mode**
```bash
sqlite3 eventrix.db
.tables
.schema Users
SELECT * FROM Users;
```

---

### Option 3: Run Locally with Node.js (Auto-setup)

See the main README for instructions on running the Node.js backend with SQLite integration.

---

## 📊 Sample Queries for Testing

### 1. List all events with attendance
```sql
SELECT 
    e.event_name,
    e.event_date,
    u.name AS organizer,
    COUNT(c.user_id) AS attendees
FROM Events e
JOIN Users u ON e.organizer_id = u.user_id
LEFT JOIN CheckIns c ON e.event_id = c.event_id
GROUP BY e.event_id, e.event_name, e.event_date, u.name
ORDER BY attendees DESC;
```

### 2. Find available equipment
```sql
SELECT equip_name, category, location
FROM Equipment
WHERE status = 'Available'
ORDER BY category, equip_name;
```

### 3. Check who hasn't returned equipment
```sql
SELECT 
    u.name AS borrower,
    eq.equip_name,
    ev.event_name,
    b.borrow_date,
    DATEDIFF(CURDATE(), b.borrow_date) AS days_borrowed
FROM Bookings b
JOIN Users u ON b.assigned_to = u.user_id
JOIN Equipment eq ON b.equip_id = eq.equip_id
JOIN Events ev ON b.event_id = ev.event_id
WHERE b.return_date IS NULL
ORDER BY days_borrowed DESC;
```

### 4. User engagement leaderboard
```sql
SELECT * FROM vw_user_activity
ORDER BY (organized_events * 5 + attended_events * 2 + equipment_bookings * 3) DESC
LIMIT 10;
```

---

## 🔐 Security Considerations

### For Production Deployment:

1. **Create dedicated database user**
```sql
CREATE USER 'eventrix_app'@'localhost' IDENTIFIED BY 'secure_password_here';
GRANT SELECT, INSERT, UPDATE, DELETE ON eventrix.* TO 'eventrix_app'@'localhost';
FLUSH PRIVILEGES;
```

2. **Restrict DROP/TRUNCATE permissions**
```sql
-- Only admins should have DROP permissions
REVOKE DROP ON eventrix.* FROM 'eventrix_app'@'localhost';
```

3. **Use prepared statements** in application code to prevent SQL injection

4. **Enable SSL/TLS** for MySQL connections

5. **Regular backups**
```bash
mysqldump -u root -p eventrix > backup_$(date +%Y%m%d).sql
```

---

## 🧪 Testing the Database

### Run all verification queries:
```bash
mysql -u root -p eventrix < database/queries.sql > test_results.txt
```

### Check data integrity:
```sql
-- Verify all foreign keys are valid
SELECT 'Events with invalid organizers' AS issue, COUNT(*) AS count
FROM Events e
LEFT JOIN Users u ON e.organizer_id = u.user_id
WHERE u.user_id IS NULL
UNION ALL
SELECT 'Bookings with invalid equipment', COUNT(*)
FROM Bookings b
LEFT JOIN Equipment eq ON b.equip_id = eq.equip_id
WHERE eq.equip_id IS NULL;
```

---

## 📈 Performance Optimization

All tables include appropriate indexes:
- **Primary Keys** - Auto-indexed
- **Foreign Keys** - Indexed for JOIN performance
- **Composite Indexes** - For complex WHERE clauses
- **Covering Indexes** - For frequently accessed queries

### Query Performance Tips:
1. Use `EXPLAIN` to analyze query plans
2. Avoid `SELECT *` - specify needed columns
3. Use views for complex recurring queries
4. Partition large tables by date if needed
5. Regularly run `ANALYZE TABLE` to update statistics

---

## 🎓 DBMS Concepts Demonstrated

This project demonstrates the following key DBMS concepts:

✅ **Data Definition Language (DDL)** - CREATE, ALTER, DROP
✅ **Data Manipulation Language (DML)** - INSERT, UPDATE, DELETE, SELECT
✅ **Constraints** - PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK, NOT NULL
✅ **Normalization** - 3NF (Third Normal Form)
✅ **Joins** - INNER, LEFT, RIGHT, CROSS joins
✅ **Aggregation** - COUNT, SUM, AVG, MIN, MAX, GROUP BY
✅ **Subqueries** - Nested and correlated subqueries
✅ **Views** - Virtual tables for data abstraction
✅ **Indexes** - Performance optimization
✅ **Transactions** - ACID properties (in stored procedures)
✅ **Triggers** - Automated data integrity enforcement
✅ **Stored Procedures** - Reusable database logic
✅ **Window Functions** - Analytical queries
✅ **Set Operations** - UNION, INTERSECT concepts

---

## 📝 Project Information

**Project Name:** Eventrix - Event Management System
**Database Type:** Relational Database (MySQL/SQLite)
**Purpose:** DBMS Course Project
**Features:** 
- Complete CRUD operations
- Referential integrity
- Data validation
- Query optimization
- Real-world application scenario

---

## 🤝 Support

For issues or questions about the database:
1. Check `queries.sql` for example queries
2. Review the schema files for table structures
3. Verify foreign key constraints are not violated
4. Check trigger definitions for automated behaviors

---

## 📄 License

This database schema is part of an educational DBMS project.
