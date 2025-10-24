# Eventrix - Event Management System

<div align="center">

![DBMS Project](https://img.shields.io/badge/DBMS-Project-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange)
![SQLite](https://img.shields.io/badge/SQLite-3-green)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6)

A comprehensive **Event Management System** built for DBMS coursework, demonstrating advanced database concepts including relational schema design, SQL queries, stored procedures, triggers, and views.

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Database Schema](#-database-schema)
- [Tech Stack](#-tech-stack)
- [Setup Instructions](#-setup-instructions)
- [Database Files](#-database-files)
- [SQL Concepts Demonstrated](#-sql-concepts-demonstrated)
- [Usage](#-usage)
- [Project Structure](#-project-structure)

---

## ✨ Features

### Application Features
- 📅 **Event Management** - Create, view, edit, and manage events
- 👥 **User Management** - Manage organizers, volunteers, and participants
- 🎤 **Equipment Booking** - Track equipment inventory and bookings
- ✅ **Check-in System** - Attendee check-in/check-out tracking
- 📊 **Dashboard Analytics** - Visual insights and statistics
- 🔍 **Search & Filter** - Find events, users, and equipment quickly
- 📱 **Responsive Design** - Modern UI that works on all devices

### Database Features
- 🗄️ **Normalized Schema** - Proper 3NF design with 5 core tables
- 🔗 **Foreign Keys** - Referential integrity with CASCADE/RESTRICT
- 📈 **Indexes** - Optimized for query performance
- 👁️ **Views** - Pre-computed aggregations for complex queries
- ⚡ **Triggers** - Automated data consistency checks
- 🔧 **Stored Procedures** - Reusable database logic (MySQL)
- 📝 **Advanced Queries** - 15 complex SQL queries demonstrating DBMS concepts

---

## 🗂️ Database Schema

### Entity-Relationship Diagram

```
┌─────────┐       ┌─────────┐       ┌──────────┐
│  Users  │◄──────│  Events │──────►│ CheckIns │
└────┬────┘   1:M └────┬────┘   1:M └──────────┘
     │                 │
     │ 1:M         1:M │
     │                 │
     ▼                 ▼
┌──────────┐       ┌──────────┐
│ Bookings │◄──────│ Equipment│
└──────────┘   M:1 └──────────┘
```

### Core Tables

1. **Users** - Stores user information (organizers, volunteers, participants)
2. **Events** - Event details with organizer references
3. **Equipment** - Inventory of equipment/resources
4. **Bookings** - Equipment reservations for events
5. **CheckIns** - Attendee check-in/check-out records

For detailed schema documentation, see [`database/README.md`](./database/README.md)

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling

### Database
- **MySQL 8.0+** - Production database (with stored procedures & triggers)
- **SQLite 3** - Local development database
- **SQL** - Pure SQL implementation (no ORM)

### Development
- **Node.js** - Runtime environment
- **ESBuild** - Fast TypeScript compilation

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** 18+ and npm
- **MySQL 8.0+** (for production setup) OR **SQLite3** (for local development)
- Git

### Quick Start (SQLite - Easiest)

1. **Clone the repository**
   ```bash
   git clone https://github.com/Naeha-S/Eventrix.git
   cd Eventrix
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Initialize SQLite database**
   ```bash
   cd database
   sqlite3 eventrix.db < schema_sqlite.sql
   sqlite3 eventrix.db < sample_data_sqlite.sql
   cd ..
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

6. **Login credentials**
   ```
   Email: admin@example.com
   Password: password
   ```

### MySQL Setup (Production)

1. **Install MySQL Server**
   - Download from [mysql.com](https://dev.mysql.com/downloads/mysql/)
   - Or use XAMPP/MAMP/WAMP

2. **Create database**
   ```sql
   mysql -u root -p
   CREATE DATABASE eventrix CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   USE eventrix;
   ```

3. **Import schema and data**
   ```bash
   mysql -u root -p eventrix < database/schema.sql
   mysql -u root -p eventrix < database/sample_data.sql
   ```

4. **Verify installation**
   ```sql
   mysql -u root -p eventrix
   SHOW TABLES;
   SELECT * FROM vw_event_summary;
   ```

5. **Follow steps 1-2 and 4-6 from Quick Start above**

---

## 📁 Database Files

Located in the `database/` directory:

### MySQL/PL-SQL (Production)
- **`schema.sql`** - Complete schema with stored procedures, triggers, views
- **`sample_data.sql`** - Sample data (10 users, 7 events, 10 equipment, bookings, check-ins)
- **`queries.sql`** - 15 advanced SQL queries for DBMS demonstration

### SQLite (Local Development)
- **`schema_sqlite.sql`** - SQLite-compatible schema
- **`sample_data_sqlite.sql`** - Sample data for SQLite
- **`eventrix.db`** - SQLite database file (created after initialization)

### Documentation
- **`README.md`** - Comprehensive database documentation

---

## 🎓 SQL Concepts Demonstrated

This DBMS project showcases the following concepts:

### Data Definition Language (DDL)
- ✅ CREATE TABLE with constraints
- ✅ PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK, NOT NULL
- ✅ AUTO_INCREMENT / AUTOINCREMENT
- ✅ Indexes for performance optimization
- ✅ CREATE VIEW for data abstraction
- ✅ CREATE TRIGGER for automated actions
- ✅ CREATE PROCEDURE (MySQL)

### Data Manipulation Language (DML)
- ✅ INSERT with multiple rows
- ✅ UPDATE with conditions
- ✅ DELETE with cascading effects
- ✅ SELECT with complex conditions

### Advanced SQL Queries
1. **Multi-table JOINS** (INNER, LEFT, RIGHT)
2. **Subqueries** (nested and correlated)
3. **Aggregations** (COUNT, SUM, AVG, GROUP BY, HAVING)
4. **Window Functions** (RANK, DENSE_RANK, ROW_NUMBER)
5. **Date/Time Functions** (DATE_ADD, DATEDIFF, NOW)
6. **Set Operations** (UNION, INTERSECT concepts)
7. **CASE Statements** (conditional logic)
8. **String Functions** (CONCAT, GROUP_CONCAT)
9. **Recursive CTEs** (hierarchical queries - MySQL 8.0+)
10. **Pivot Queries** (monthly statistics)

### Database Design Principles
- ✅ **Normalization** - Third Normal Form (3NF)
- ✅ **Referential Integrity** - ON DELETE CASCADE/RESTRICT
- ✅ **Data Validation** - CHECK constraints and ENUM types
- ✅ **Indexing Strategy** - Primary, foreign, and composite indexes
- ✅ **Transaction Management** - ACID properties in stored procedures

### Sample Queries in `queries.sql`

```sql
-- Example: Find users who organized more events than average
SELECT u.name, COUNT(e.event_id) AS events_organized
FROM Users u
INNER JOIN Events e ON u.user_id = e.organizer_id
GROUP BY u.user_id, u.name
HAVING COUNT(e.event_id) > (
    SELECT AVG(event_count) 
    FROM (SELECT COUNT(event_id) AS event_count 
          FROM Events GROUP BY organizer_id) AS subquery
);

-- Example: Equipment utilization with window functions
SELECT 
    equip_name,
    times_borrowed,
    RANK() OVER (ORDER BY times_borrowed DESC) AS popularity_rank
FROM (
    SELECT eq.equip_name, COUNT(b.booking_id) AS times_borrowed
    FROM Equipment eq
    LEFT JOIN Bookings b ON eq.equip_id = b.equip_id
    GROUP BY eq.equip_id, eq.equip_name
) AS stats;
```

---

## 💻 Usage

### Running SQL Queries

#### MySQL
```bash
# Connect to database
mysql -u root -p eventrix

# Run specific query file
mysql -u root -p eventrix < database/queries.sql

# Export results to file
mysql -u root -p eventrix < database/queries.sql > results.txt
```

#### SQLite
```bash
# Interactive mode
sqlite3 database/eventrix.db

# Run query file
sqlite3 database/eventrix.db < database/queries.sql

# Useful SQLite commands
.tables                    # List all tables
.schema Users              # Show table schema
.mode column               # Pretty print columns
.headers on                # Show column headers
SELECT * FROM vw_event_summary;
```

### Application Usage

1. **Login** - Use `admin@example.com` / `password`
2. **Dashboard** - View overview of events, equipment, and users
3. **Events** - Create, edit, view events; manage attendees
4. **Equipment** - Track inventory and bookings
5. **Users** - Manage organizers, volunteers, participants
6. **Bookings** - Reserve equipment for events

---

## 📂 Project Structure

```
Eventrix/
├── components/           # React components
│   ├── LoginPage.tsx     # Authentication
│   ├── Dashboard.tsx     # Analytics dashboard
│   ├── EventsPage.tsx    # Event management
│   ├── EquipmentPage.tsx # Equipment tracking
│   ├── UsersPage.tsx     # User management
│   └── BookingPage.tsx   # Booking system
├── data/
│   └── mockData.ts       # Mock data (for frontend dev without DB)
├── database/             # 🗄️ DATABASE FILES
│   ├── schema.sql        # MySQL schema
│   ├── schema_sqlite.sql # SQLite schema
│   ├── sample_data.sql   # MySQL sample data
│   ├── sample_data_sqlite.sql # SQLite sample data
│   ├── queries.sql       # Advanced SQL queries
│   ├── README.md         # Database documentation
│   └── eventrix.db       # SQLite database (generated)
├── App.tsx               # Main application
├── types.ts              # TypeScript interfaces
├── index.html            # Entry HTML
├── vite.config.ts        # Vite configuration
├── package.json          # Dependencies
└── README.md             # This file
```

---

## 🧪 Testing the Database

### Verify Data Integrity
```sql
-- Check all foreign keys are valid
SELECT 'Invalid Events' AS issue, COUNT(*) AS count
FROM Events e
LEFT JOIN Users u ON e.organizer_id = u.user_id
WHERE u.user_id IS NULL
UNION ALL
SELECT 'Invalid Bookings', COUNT(*)
FROM Bookings b
LEFT JOIN Equipment eq ON b.equip_id = eq.equip_id
WHERE eq.equip_id IS NULL;
```

### Test Triggers
```sql
-- Test: Update booking return date should update equipment status
UPDATE Bookings SET return_date = CURDATE() WHERE booking_id = 301;
SELECT status FROM Equipment WHERE equip_id = 202; -- Should be 'Available'
```

### Test Stored Procedures (MySQL)
```sql
-- Test check-in procedure
CALL sp_checkin_user(3, 105, @checkin_id);
SELECT @checkin_id;

-- Test equipment booking procedure
CALL sp_book_equipment(107, 203, 5, CURDATE(), 'Test booking', @booking_id);
SELECT @booking_id;
```

---

## 🎯 Key Features for DBMS Evaluation

### 1. Complex Queries (15 examples in `queries.sql`)
- Multi-table joins with aggregations
- Subqueries (nested and correlated)
- Window functions for ranking
- Date/time manipulations
- Set operations

### 2. Database Objects
- **Tables**: 5 properly normalized tables
- **Views**: 3 views for common queries
- **Triggers**: 6 triggers for data automation
- **Stored Procedures**: 3 procedures (MySQL)
- **Indexes**: 20+ indexes for optimization

### 3. Constraints & Validation
- Primary keys on all tables
- Foreign keys with referential actions
- CHECK constraints for data validation
- UNIQUE constraints for business rules
- NOT NULL constraints where applicable

---

## 🤝 Contributing

This is a DBMS course project. For improvements:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request



**Built with ❤️ for DBMS Project**

⭐ Star this repo if you find it helpful!

