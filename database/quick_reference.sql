-- =============================================
-- QUICK REFERENCE GUIDE
-- =============================================
-- Common SQL queries for Eventrix Database
-- =============================================

-- =============================================
-- 1. BASIC SELECTS
-- =============================================

-- List all users
SELECT * FROM Users ORDER BY name;

-- List all events
SELECT * FROM Events ORDER BY event_date DESC;

-- List available equipment
SELECT * FROM Equipment WHERE status = 'Available' ORDER BY category, equip_name;

-- =============================================
-- 2. COUNTING & STATISTICS
-- =============================================

-- Count users by role
SELECT role, COUNT(*) AS count
FROM Users
GROUP BY role
ORDER BY count DESC;

-- Count events by organizer
SELECT u.name AS organizer, COUNT(e.event_id) AS events_organized
FROM Users u
JOIN Events e ON u.user_id = e.organizer_id
GROUP BY u.user_id, u.name
ORDER BY events_organized DESC;

-- Equipment by category and status
SELECT category, status, COUNT(*) AS count
FROM Equipment
GROUP BY category, status
ORDER BY category, status;

-- =============================================
-- 3. EVENT QUERIES
-- =============================================

-- Events with attendance counts
SELECT 
    e.event_name,
    e.event_date,
    e.venue,
    u.name AS organizer,
    COUNT(DISTINCT c.user_id) AS attendees
FROM Events e
JOIN Users u ON e.organizer_id = u.user_id
LEFT JOIN CheckIns c ON e.event_id = c.event_id
GROUP BY e.event_id, e.event_name, e.event_date, e.venue, u.name
ORDER BY e.event_date DESC;

-- Upcoming events
SELECT event_name, event_date, venue
FROM Events
WHERE event_date > CURRENT_TIMESTAMP
ORDER BY event_date;

-- Past events in last 30 days
SELECT event_name, event_date, venue
FROM Events
WHERE event_date BETWEEN DATE_SUB(NOW(), INTERVAL 30 DAY) AND NOW()
ORDER BY event_date DESC;

-- Events with most attendees
SELECT 
    e.event_name,
    COUNT(c.user_id) AS attendee_count
FROM Events e
LEFT JOIN CheckIns c ON e.event_id = c.event_id
GROUP BY e.event_id, e.event_name
ORDER BY attendee_count DESC
LIMIT 5;

-- =============================================
-- 4. EQUIPMENT QUERIES
-- =============================================

-- Currently borrowed equipment
SELECT 
    eq.equip_name,
    eq.category,
    ev.event_name,
    u.name AS borrowed_by,
    b.borrow_date,
    DATEDIFF(CURDATE(), b.borrow_date) AS days_borrowed
FROM Equipment eq
JOIN Bookings b ON eq.equip_id = b.equip_id
JOIN Events ev ON b.event_id = ev.event_id
JOIN Users u ON b.assigned_to = u.user_id
WHERE b.return_date IS NULL
ORDER BY days_borrowed DESC;

-- Equipment usage history
SELECT 
    eq.equip_name,
    COUNT(b.booking_id) AS times_borrowed,
    MIN(b.borrow_date) AS first_borrowed,
    MAX(b.borrow_date) AS last_borrowed
FROM Equipment eq
LEFT JOIN Bookings b ON eq.equip_id = b.equip_id
GROUP BY eq.equip_id, eq.equip_name
ORDER BY times_borrowed DESC;

-- Equipment never borrowed
SELECT equip_name, category, location
FROM Equipment
WHERE equip_id NOT IN (SELECT DISTINCT equip_id FROM Bookings);

-- =============================================
-- 5. USER QUERIES
-- =============================================

-- User activity summary
SELECT 
    u.name,
    u.email,
    u.role,
    COUNT(DISTINCT CASE WHEN e.organizer_id = u.user_id THEN e.event_id END) AS organized,
    COUNT(DISTINCT c.event_id) AS attended,
    COUNT(DISTINCT b.booking_id) AS bookings
FROM Users u
LEFT JOIN Events e ON u.user_id = e.organizer_id
LEFT JOIN CheckIns c ON u.user_id = c.user_id
LEFT JOIN Bookings b ON u.user_id = b.assigned_to
GROUP BY u.user_id, u.name, u.email, u.role
ORDER BY organized DESC, attended DESC;

-- Users who never attended any event
SELECT name, email, role
FROM Users
WHERE user_id NOT IN (SELECT DISTINCT user_id FROM CheckIns);

-- Most active volunteers
SELECT u.name, COUNT(b.booking_id) AS equipment_managed
FROM Users u
JOIN Bookings b ON u.user_id = b.assigned_to
WHERE u.role = 'Volunteer'
GROUP BY u.user_id, u.name
ORDER BY equipment_managed DESC;

-- =============================================
-- 6. BOOKING QUERIES
-- =============================================

-- All active bookings
SELECT 
    b.booking_id,
    ev.event_name,
    eq.equip_name,
    u.name AS assigned_to,
    b.borrow_date,
    b.remarks
FROM Bookings b
JOIN Events ev ON b.event_id = ev.event_id
JOIN Equipment eq ON b.equip_id = eq.equip_id
JOIN Users u ON b.assigned_to = u.user_id
WHERE b.return_date IS NULL
ORDER BY b.borrow_date DESC;

-- Booking history for an event
SELECT 
    eq.equip_name,
    eq.category,
    u.name AS assigned_to,
    b.borrow_date,
    b.return_date,
    COALESCE(DATEDIFF(b.return_date, b.borrow_date), DATEDIFF(CURDATE(), b.borrow_date)) AS days_used
FROM Bookings b
JOIN Equipment eq ON b.equip_id = eq.equip_id
JOIN Users u ON b.assigned_to = u.user_id
WHERE b.event_id = 101  -- Replace with actual event_id
ORDER BY b.borrow_date;

-- Overdue returns (borrowed > 30 days, not returned)
SELECT 
    b.booking_id,
    eq.equip_name,
    u.name AS borrower,
    ev.event_name,
    b.borrow_date,
    DATEDIFF(CURDATE(), b.borrow_date) AS days_overdue
FROM Bookings b
JOIN Equipment eq ON b.equip_id = eq.equip_id
JOIN Users u ON b.assigned_to = u.user_id
JOIN Events ev ON b.event_id = ev.event_id
WHERE b.return_date IS NULL 
  AND DATEDIFF(CURDATE(), b.borrow_date) > 30
ORDER BY days_overdue DESC;

-- =============================================
-- 7. CHECK-IN QUERIES
-- =============================================

-- Event attendance list
SELECT 
    u.name,
    u.email,
    u.role,
    c.checkin_time,
    c.checkout_time,
    c.status
FROM CheckIns c
JOIN Users u ON c.user_id = u.user_id
WHERE c.event_id = 101  -- Replace with actual event_id
ORDER BY c.checkin_time;

-- Users who checked in but never checked out
SELECT 
    u.name,
    ev.event_name,
    c.checkin_time
FROM CheckIns c
JOIN Users u ON c.user_id = u.user_id
JOIN Events ev ON c.event_id = ev.event_id
WHERE c.checkout_time IS NULL
ORDER BY c.checkin_time DESC;

-- Average event duration per user
SELECT 
    u.name,
    AVG(TIMESTAMPDIFF(HOUR, c.checkin_time, c.checkout_time)) AS avg_hours_attended
FROM CheckIns c
JOIN Users u ON c.user_id = u.user_id
WHERE c.checkout_time IS NOT NULL
GROUP BY u.user_id, u.name
ORDER BY avg_hours_attended DESC;

-- =============================================
-- 8. SEARCH QUERIES
-- =============================================

-- Search events by keyword
SELECT event_name, event_date, venue, description
FROM Events
WHERE event_name LIKE '%Tech%' 
   OR description LIKE '%Tech%'
   OR venue LIKE '%Tech%'
ORDER BY event_date DESC;

-- Search users by name or email
SELECT name, email, role, roll_number
FROM Users
WHERE name LIKE '%John%' 
   OR email LIKE '%john%'
ORDER BY name;

-- Search equipment by name or category
SELECT equip_name, category, status, location
FROM Equipment
WHERE equip_name LIKE '%Mic%' 
   OR category LIKE '%Audio%'
ORDER BY status, equip_name;

-- =============================================
-- 9. REPORTING QUERIES
-- =============================================

-- Monthly event report
SELECT 
    YEAR(event_date) AS year,
    MONTH(event_date) AS month,
    MONTHNAME(event_date) AS month_name,
    COUNT(*) AS events_count,
    SUM(attendee_count) AS total_attendees
FROM (
    SELECT 
        e.event_id,
        e.event_date,
        COUNT(c.user_id) AS attendee_count
    FROM Events e
    LEFT JOIN CheckIns c ON e.event_id = c.event_id
    GROUP BY e.event_id, e.event_date
) AS monthly
GROUP BY YEAR(event_date), MONTH(event_date), MONTHNAME(event_date)
ORDER BY year DESC, month DESC;

-- Equipment utilization report
SELECT 
    eq.category,
    COUNT(DISTINCT eq.equip_id) AS total_equipment,
    SUM(CASE WHEN eq.status = 'Available' THEN 1 ELSE 0 END) AS available,
    SUM(CASE WHEN eq.status = 'Borrowed' THEN 1 ELSE 0 END) AS borrowed,
    SUM(CASE WHEN eq.status = 'Damaged' THEN 1 ELSE 0 END) AS damaged,
    ROUND(SUM(CASE WHEN eq.status = 'Available' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS availability_percentage
FROM Equipment eq
GROUP BY eq.category
ORDER BY eq.category;

-- User role distribution
SELECT 
    role,
    COUNT(*) AS user_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM Users), 2) AS percentage
FROM Users
GROUP BY role
ORDER BY user_count DESC;

-- =============================================
-- 10. DATA MODIFICATION EXAMPLES
-- =============================================

-- Add a new user
INSERT INTO Users (name, email, phone, role, roll_number)
VALUES ('New User', 'newuser@example.com', '999-999-9999', 'Participant', '202100099');

-- Update user information
UPDATE Users
SET phone = '111-222-3333', role = 'Volunteer'
WHERE user_id = 10;

-- Mark equipment as damaged
UPDATE Equipment
SET status = 'Damaged'
WHERE equip_id = 204;

-- Return equipment
UPDATE Bookings
SET return_date = CURDATE()
WHERE booking_id = 301;

-- Check out a user from event
UPDATE CheckIns
SET checkout_time = NOW()
WHERE checkin_id = 401;

-- Delete a booking (if no longer needed)
DELETE FROM Bookings
WHERE booking_id = 999 AND return_date IS NOT NULL;

-- =============================================
-- 11. USING VIEWS
-- =============================================

-- Use event summary view
SELECT * FROM vw_event_summary
WHERE event_date > CURRENT_TIMESTAMP
ORDER BY event_date;

-- Use equipment status view
SELECT * FROM vw_equipment_status
WHERE status = 'Borrowed';

-- Use user activity view
SELECT * FROM vw_user_activity
WHERE organized_events > 0
ORDER BY organized_events DESC;

-- =============================================
-- 12. TRANSACTION EXAMPLES
-- =============================================

-- Create an event with equipment booking
START TRANSACTION;

INSERT INTO Events (event_name, event_date, venue, description, organizer_id)
VALUES ('New Conference', '2025-01-15 10:00:00', 'Hall B', 'Annual meeting', 1);

SET @new_event_id = LAST_INSERT_ID();

INSERT INTO Bookings (event_id, equip_id, assigned_to, borrow_date)
VALUES (@new_event_id, 201, 2, '2025-01-14');

UPDATE Equipment SET status = 'Borrowed' WHERE equip_id = 201;

COMMIT;

-- =============================================
-- END OF QUICK REFERENCE
-- =============================================
