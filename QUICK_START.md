# 🚀 QUICK START GUIDE

## What I've Fixed

✅ **Fixed Input Focus Issue** - Text inputs no longer lose focus after typing one character
✅ **Added Complete SQL Database** - MySQL and SQLite schemas with proper DBMS concepts
✅ **Created 5 Database Tables** - Users, Events, Equipment, Bookings, CheckIns
✅ **Added 15 Advanced SQL Queries** - Demonstrating joins, subqueries, window functions, etc.
✅ **Built Setup Scripts** - Automatic database initialization
✅ **Comprehensive Documentation** - Full README and database docs

---

## 📁 New Database Files Created

```
database/
├── schema.sql                    # MySQL/PL-SQL production schema
├── schema_sqlite.sql             # SQLite local development schema
├── sample_data.sql               # MySQL sample data
├── sample_data_sqlite.sql        # SQLite sample data
├── queries.sql                   # 15 advanced SQL queries for DBMS demo
├── quick_reference.sql           # Common queries cheat sheet
├── setup.bat                     # Windows setup script
├── setup.sh                      # Linux/Mac setup script
├── README.md                     # Complete database documentation
└── eventrix.db                   # SQLite database (created after setup)
```

---

## 🎯 How to Run Your Project

### Option 1: Quick Start (SQLite - Easiest)

**Windows PowerShell:**
```powershell
# Navigate to database folder
cd database

# Run setup script
.\setup.bat

# Go back and start app
cd ..
npm run dev
```

**Or manually:**
```powershell
cd database
sqlite3 eventrix.db ".read schema_sqlite.sql"
sqlite3 eventrix.db ".read sample_data_sqlite.sql"
cd ..
npm run dev
```

### Option 2: MySQL Setup (For Production/Grading)

1. **Install MySQL** (if not already installed)
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use XAMPP: https://www.apachefriends.org/

2. **Create Database:**
   ```sql
   mysql -u root -p
   CREATE DATABASE eventrix;
   USE eventrix;
   ```

3. **Import Schema:**
   ```bash
   mysql -u root -p eventrix < database/schema.sql
   mysql -u root -p eventrix < database/sample_data.sql
   ```

4. **Verify:**
   ```sql
   SHOW TABLES;
   SELECT * FROM vw_event_summary;
   ```

5. **Run App:**
   ```bash
   npm run dev
   ```

---

## 🔐 Login Credentials

```
Email: admin@example.com
Password: password
```

---

## 📊 Database Features for DBMS Project

### 1. **Tables (5 Normalized Tables)**
- Users - User management with roles
- Events - Event details with foreign keys
- Equipment - Inventory tracking
- Bookings - Equipment reservations
- CheckIns - Attendance tracking

### 2. **Constraints**
- PRIMARY KEY on all tables
- FOREIGN KEY with CASCADE/RESTRICT
- UNIQUE constraints (email, roll_number)
- CHECK constraints (date validation, status enums)
- NOT NULL constraints

### 3. **Indexes (20+ indexes)**
- Primary key indexes (automatic)
- Foreign key indexes for JOIN optimization
- Composite indexes for complex queries
- Single-column indexes for WHERE clauses

### 4. **Views (3 Pre-built Views)**
- `vw_event_summary` - Events with attendance
- `vw_equipment_status` - Equipment availability
- `vw_user_activity` - User engagement metrics

### 5. **Triggers (6 Triggers in MySQL)**
- Auto-update timestamps on all tables
- Update equipment status on return
- Prevent organizer deletion with upcoming events

### 6. **Stored Procedures (MySQL only - 3 procedures)**
- `sp_checkin_user` - Check in attendee
- `sp_book_equipment` - Book with validation
- `sp_return_equipment` - Return and update status

### 7. **Advanced Queries (15 Examples)**
- Multi-table JOINs
- Nested subqueries
- Window functions (RANK, ROW_NUMBER)
- Date/time functions
- Set operations (UNION)
- Pivot queries
- Recursive CTEs (MySQL 8.0+)
- Aggregations with HAVING
- Correlated subqueries
- Analytical queries

---

## 📝 SQL Query Examples

### Basic Queries
```sql
-- List all users
SELECT * FROM Users;

-- List events with attendance
SELECT * FROM vw_event_summary;

-- Find available equipment
SELECT * FROM Equipment WHERE status = 'Available';
```

### Advanced Queries
```sql
-- Events ranked by attendance
SELECT 
    event_name,
    COUNT(c.checkin_id) AS attendees,
    RANK() OVER (ORDER BY COUNT(c.checkin_id) DESC) AS rank
FROM Events e
LEFT JOIN CheckIns c ON e.event_id = c.event_id
GROUP BY e.event_id, e.event_name;

-- Users who organized more events than average
SELECT u.name, COUNT(e.event_id) AS events
FROM Users u
JOIN Events e ON u.user_id = e.organizer_id
GROUP BY u.user_id, u.name
HAVING COUNT(e.event_id) > (
    SELECT AVG(cnt) FROM (
        SELECT COUNT(*) AS cnt FROM Events GROUP BY organizer_id
    ) sub
);
```

See `database/queries.sql` for all 15 advanced queries!

---

## 🎓 DBMS Concepts Covered

✅ DDL (CREATE, ALTER, DROP)
✅ DML (INSERT, UPDATE, DELETE, SELECT)
✅ Joins (INNER, LEFT, RIGHT)
✅ Subqueries (nested & correlated)
✅ Aggregation (COUNT, SUM, AVG, GROUP BY, HAVING)
✅ Window Functions (RANK, ROW_NUMBER, DENSE_RANK)
✅ Views (data abstraction)
✅ Indexes (query optimization)
✅ Triggers (automated actions)
✅ Stored Procedures (reusable logic)
✅ Transactions (ACID properties)
✅ Constraints (referential integrity)
✅ Normalization (3NF design)

---

## 📚 Documentation Files

1. **Main README.md** - Complete project overview
2. **database/README.md** - Detailed database documentation
3. **database/quick_reference.sql** - Common query patterns
4. **database/queries.sql** - 15 advanced DBMS queries

---

## 🧪 Testing Your Database

### SQLite Commands
```bash
sqlite3 database/eventrix.db

.tables                          # List all tables
.schema Users                    # Show table structure
SELECT * FROM Users;             # Query data
SELECT * FROM vw_event_summary;  # Use views
.quit                            # Exit
```

### MySQL Commands
```bash
mysql -u root -p eventrix

SHOW TABLES;
DESCRIBE Users;
SELECT * FROM vw_event_summary;
CALL sp_checkin_user(3, 101, @id);
```

---

## 🎨 Frontend Features (Already Working)

- ✅ Input focus issue **FIXED**
- ✅ Login/Authentication page
- ✅ Dashboard with analytics
- ✅ Event management (create, edit, view)
- ✅ Equipment tracking
- ✅ User management
- ✅ Booking system
- ✅ Check-in/check-out
- ✅ Search and filters
- ✅ Responsive design

---

## 💡 For Your DBMS Project Submission

### What to Submit:
1. ✅ **SQL Schema Files** - `schema.sql` (MySQL) + `schema_sqlite.sql` (SQLite)
2. ✅ **Sample Data** - `sample_data.sql` with 10+ records per table
3. ✅ **Advanced Queries** - `queries.sql` with 15 complex queries
4. ✅ **Documentation** - README files explaining design
5. ✅ **ER Diagram** - (Draw from the schema or use the text diagram in README)
6. ✅ **Working Application** - Frontend + Database integration

### Key Points to Highlight:
- ✅ Proper normalization (3NF)
- ✅ Foreign key relationships
- ✅ Indexes for optimization
- ✅ Views for complex queries
- ✅ Triggers for automation
- ✅ Stored procedures (MySQL)
- ✅ Advanced SQL concepts (joins, subqueries, window functions)

---

## 🐛 Troubleshooting

### Issue: SQLite3 not found
**Solution:**
- Windows: Download from https://www.sqlite.org/download.html
- Mac: `brew install sqlite3` (or it's pre-installed)
- Linux: `sudo apt install sqlite3`

### Issue: MySQL connection fails
**Solution:**
- Verify MySQL is running
- Check username/password
- Ensure database 'eventrix' exists
- Grant proper permissions

### Issue: Input still loses focus
**Solution:**
- Clear browser cache
- Hard refresh (Ctrl+F5)
- The fix is in LoginPage.tsx (FormField moved outside component)

---

## 📞 Need Help?

1. Check `database/README.md` for detailed docs
2. Review `database/quick_reference.sql` for query examples
3. Look at `database/queries.sql` for advanced examples
4. Read comments in SQL files for explanations

---

## 🎉 You're All Set!

Your project now has:
- ✅ Working frontend (input bug fixed)
- ✅ Complete SQL database (MySQL + SQLite)
- ✅ Advanced DBMS concepts demonstrated
- ✅ Comprehensive documentation
- ✅ Easy setup scripts
- ✅ Sample data and queries

**Run:** `npm run dev` and start testing!

**Login:** admin@example.com / password

---

Good luck with your DBMS project! 🚀
