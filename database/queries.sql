-- =============================================
-- Eventrix Advanced Queries
-- =============================================
-- DBMS Project: Complex queries demonstrating SQL concepts
-- =============================================

-- =============================================
-- 1. JOINS: Get event details with organizer and attendee information
-- =============================================
SELECT 
    e.event_name,
    e.event_date,
    e.venue,
    u_org.name AS organizer_name,
    u_org.email AS organizer_email,
    COUNT(DISTINCT c.user_id) AS total_attendees,
    COUNT(DISTINCT b.booking_id) AS equipment_booked
FROM Events e
INNER JOIN Users u_org ON e.organizer_id = u_org.user_id
LEFT JOIN CheckIns c ON e.event_id = c.event_id AND c.status = 'Present'
LEFT JOIN Bookings b ON e.event_id = b.event_id
GROUP BY e.event_id, e.event_name, e.event_date, e.venue, u_org.name, u_org.email
ORDER BY e.event_date DESC;

-- =============================================
-- 2. SUBQUERIES: Find users who have organized more events than average
-- =============================================
SELECT 
    u.name,
    u.email,
    u.role,
    COUNT(e.event_id) AS events_organized
FROM Users u
INNER JOIN Events e ON u.user_id = e.organizer_id
GROUP BY u.user_id, u.name, u.email, u.role
HAVING COUNT(e.event_id) > (
    SELECT AVG(event_count) 
    FROM (
        SELECT COUNT(event_id) AS event_count 
        FROM Events 
        GROUP BY organizer_id
    ) AS subquery
);

-- =============================================
-- 3. AGGREGATION: Equipment usage statistics
-- =============================================
SELECT 
    eq.category,
    COUNT(DISTINCT eq.equip_id) AS total_equipment,
    SUM(CASE WHEN eq.status = 'Available' THEN 1 ELSE 0 END) AS available,
    SUM(CASE WHEN eq.status = 'Borrowed' THEN 1 ELSE 0 END) AS borrowed,
    SUM(CASE WHEN eq.status = 'Damaged' THEN 1 ELSE 0 END) AS damaged,
    COUNT(b.booking_id) AS total_bookings,
    ROUND(AVG(DATEDIFF(COALESCE(b.return_date, CURDATE()), b.borrow_date)), 2) AS avg_borrow_days
FROM Equipment eq
LEFT JOIN Bookings b ON eq.equip_id = b.equip_id
GROUP BY eq.category
ORDER BY total_bookings DESC;

-- =============================================
-- 4. WINDOW FUNCTIONS: Rank events by attendance
-- =============================================
SELECT 
    e.event_name,
    e.event_date,
    e.venue,
    COUNT(c.checkin_id) AS attendee_count,
    RANK() OVER (ORDER BY COUNT(c.checkin_id) DESC) AS attendance_rank,
    DENSE_RANK() OVER (ORDER BY COUNT(c.checkin_id) DESC) AS attendance_dense_rank,
    ROW_NUMBER() OVER (ORDER BY e.event_date DESC) AS chronological_order
FROM Events e
LEFT JOIN CheckIns c ON e.event_id = c.event_id
GROUP BY e.event_id, e.event_name, e.event_date, e.venue
ORDER BY attendance_rank;

-- =============================================
-- 5. CORRELATED SUBQUERY: Find events with above-average attendance
-- =============================================
SELECT 
    e.event_id,
    e.event_name,
    e.event_date,
    (SELECT COUNT(*) FROM CheckIns c WHERE c.event_id = e.event_id) AS attendees,
    (SELECT AVG(attendee_count) FROM (
        SELECT COUNT(*) AS attendee_count 
        FROM CheckIns 
        GROUP BY event_id
    ) AS avg_table) AS avg_attendance
FROM Events e
WHERE (SELECT COUNT(*) FROM CheckIns c WHERE c.event_id = e.event_id) > 
      (SELECT AVG(attendee_count) FROM (
          SELECT COUNT(*) AS attendee_count 
          FROM CheckIns 
          GROUP BY event_id
      ) AS avg_table)
ORDER BY attendees DESC;

-- =============================================
-- 6. COMPLEX JOIN: User activity report
-- =============================================
SELECT 
    u.name,
    u.email,
    u.role,
    u.roll_number,
    COALESCE(organized.count, 0) AS events_organized,
    COALESCE(attended.count, 0) AS events_attended,
    COALESCE(bookings.count, 0) AS equipment_bookings,
    COALESCE(bookings.active, 0) AS active_bookings
FROM Users u
LEFT JOIN (
    SELECT organizer_id, COUNT(*) AS count 
    FROM Events 
    GROUP BY organizer_id
) organized ON u.user_id = organized.organizer_id
LEFT JOIN (
    SELECT user_id, COUNT(*) AS count 
    FROM CheckIns 
    GROUP BY user_id
) attended ON u.user_id = attended.user_id
LEFT JOIN (
    SELECT assigned_to, 
           COUNT(*) AS count,
           SUM(CASE WHEN return_date IS NULL THEN 1 ELSE 0 END) AS active
    FROM Bookings 
    GROUP BY assigned_to
) bookings ON u.user_id = bookings.assigned_to
ORDER BY events_organized DESC, events_attended DESC;

-- =============================================
-- 7. DATE FUNCTIONS: Upcoming events and past events analysis
-- =============================================
SELECT 
    CASE 
        WHEN e.event_date > NOW() THEN 'Upcoming'
        WHEN e.event_date > DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 'Recent (Last 30 days)'
        WHEN e.event_date > DATE_SUB(NOW(), INTERVAL 90 DAY) THEN 'Past 90 days'
        ELSE 'Older'
    END AS event_status,
    COUNT(*) AS event_count,
    AVG((SELECT COUNT(*) FROM CheckIns c WHERE c.event_id = e.event_id)) AS avg_attendance
FROM Events e
GROUP BY event_status
ORDER BY 
    FIELD(event_status, 'Upcoming', 'Recent (Last 30 days)', 'Past 90 days', 'Older');

-- =============================================
-- 8. SET OPERATIONS: Users who are organizers but never attended events
-- =============================================
SELECT user_id, name, email, 'Organizer but never attended' AS note
FROM Users
WHERE role = 'Organizer'
  AND user_id IN (SELECT DISTINCT organizer_id FROM Events)
  AND user_id NOT IN (SELECT DISTINCT user_id FROM CheckIns)
UNION
SELECT user_id, name, email, 'Participant who never checked in' AS note
FROM Users
WHERE role = 'Participant'
  AND user_id NOT IN (SELECT DISTINCT user_id FROM CheckIns);

-- =============================================
-- 9. PIVOT-STYLE QUERY: Monthly event statistics
-- =============================================
SELECT 
    YEAR(event_date) AS year,
    SUM(CASE WHEN MONTH(event_date) = 1 THEN 1 ELSE 0 END) AS Jan,
    SUM(CASE WHEN MONTH(event_date) = 2 THEN 1 ELSE 0 END) AS Feb,
    SUM(CASE WHEN MONTH(event_date) = 3 THEN 1 ELSE 0 END) AS Mar,
    SUM(CASE WHEN MONTH(event_date) = 4 THEN 1 ELSE 0 END) AS Apr,
    SUM(CASE WHEN MONTH(event_date) = 5 THEN 1 ELSE 0 END) AS May,
    SUM(CASE WHEN MONTH(event_date) = 6 THEN 1 ELSE 0 END) AS Jun,
    SUM(CASE WHEN MONTH(event_date) = 7 THEN 1 ELSE 0 END) AS Jul,
    SUM(CASE WHEN MONTH(event_date) = 8 THEN 1 ELSE 0 END) AS Aug,
    SUM(CASE WHEN MONTH(event_date) = 9 THEN 1 ELSE 0 END) AS Sep,
    SUM(CASE WHEN MONTH(event_date) = 10 THEN 1 ELSE 0 END) AS Oct,
    SUM(CASE WHEN MONTH(event_date) = 11 THEN 1 ELSE 0 END) AS Nov,
    SUM(CASE WHEN MONTH(event_date) = 12 THEN 1 ELSE 0 END) AS Dec,
    COUNT(*) AS Total
FROM Events
GROUP BY YEAR(event_date)
ORDER BY year DESC;

-- =============================================
-- 10. RECURSIVE CTE: (MySQL 8.0+) Event hierarchy simulation
-- =============================================
WITH RECURSIVE EventHierarchy AS (
    -- Base case: Events organized by top-level organizers
    SELECT 
        e.event_id,
        e.event_name,
        e.organizer_id,
        u.name AS organizer_name,
        1 AS level
    FROM Events e
    INNER JOIN Users u ON e.organizer_id = u.user_id
    WHERE u.role = 'Organizer'
    
    UNION ALL
    
    -- Recursive case: Events where organizer attended other events
    SELECT 
        e2.event_id,
        e2.event_name,
        e2.organizer_id,
        u2.name AS organizer_name,
        eh.level + 1
    FROM Events e2
    INNER JOIN Users u2 ON e2.organizer_id = u2.user_id
    INNER JOIN CheckIns c ON u2.user_id = c.user_id
    INNER JOIN EventHierarchy eh ON c.event_id = eh.event_id
    WHERE eh.level < 3
)
SELECT DISTINCT * FROM EventHierarchy ORDER BY level, event_date;

-- =============================================
-- 11. EQUIPMENT UTILIZATION ANALYSIS
-- =============================================
SELECT 
    eq.equip_name,
    eq.category,
    eq.status,
    COUNT(b.booking_id) AS times_borrowed,
    SUM(DATEDIFF(COALESCE(b.return_date, CURDATE()), b.borrow_date)) AS total_days_borrowed,
    ROUND(
        SUM(DATEDIFF(COALESCE(b.return_date, CURDATE()), b.borrow_date)) / 
        DATEDIFF(CURDATE(), eq.purchase_date) * 100, 
        2
    ) AS utilization_percentage,
    MIN(b.borrow_date) AS first_borrowed,
    MAX(b.borrow_date) AS last_borrowed
FROM Equipment eq
LEFT JOIN Bookings b ON eq.equip_id = b.equip_id
GROUP BY eq.equip_id, eq.equip_name, eq.category, eq.status, eq.purchase_date
HAVING times_borrowed > 0
ORDER BY utilization_percentage DESC;

-- =============================================
-- 12. EVENT ROI ANALYSIS (Resource usage per attendee)
-- =============================================
SELECT 
    e.event_name,
    e.event_date,
    COUNT(DISTINCT c.user_id) AS attendees,
    COUNT(DISTINCT b.booking_id) AS equipment_used,
    CASE 
        WHEN COUNT(DISTINCT c.user_id) > 0 
        THEN ROUND(COUNT(DISTINCT b.booking_id) / COUNT(DISTINCT c.user_id), 2)
        ELSE 0 
    END AS equipment_per_attendee,
    GROUP_CONCAT(DISTINCT u.name SEPARATOR ', ') AS volunteer_list
FROM Events e
LEFT JOIN CheckIns c ON e.event_id = c.event_id
LEFT JOIN Bookings b ON e.event_id = b.event_id
LEFT JOIN Users u ON b.assigned_to = u.user_id AND u.role = 'Volunteer'
GROUP BY e.event_id, e.event_name, e.event_date
ORDER BY attendees DESC;

-- =============================================
-- 13. FIND CONFLICTS: Equipment double-booked or user conflicts
-- =============================================
-- Equipment booking conflicts
SELECT 
    b1.booking_id AS booking1_id,
    b2.booking_id AS booking2_id,
    eq.equip_name,
    b1.event_id AS event1_id,
    b2.event_id AS event2_id,
    b1.borrow_date AS borrow1,
    b1.return_date AS return1,
    b2.borrow_date AS borrow2,
    b2.return_date AS return2
FROM Bookings b1
INNER JOIN Bookings b2 ON b1.equip_id = b2.equip_id AND b1.booking_id < b2.booking_id
INNER JOIN Equipment eq ON b1.equip_id = eq.equip_id
WHERE b1.borrow_date <= COALESCE(b2.return_date, '9999-12-31')
  AND b2.borrow_date <= COALESCE(b1.return_date, '9999-12-31');

-- =============================================
-- 14. USER ENGAGEMENT SCORE
-- =============================================
SELECT 
    u.user_id,
    u.name,
    u.role,
    COALESCE(organized_count, 0) * 5 AS organizer_points,
    COALESCE(attended_count, 0) * 2 AS attendance_points,
    COALESCE(volunteer_bookings, 0) * 3 AS volunteer_points,
    (COALESCE(organized_count, 0) * 5 + 
     COALESCE(attended_count, 0) * 2 + 
     COALESCE(volunteer_bookings, 0) * 3) AS total_engagement_score
FROM Users u
LEFT JOIN (SELECT organizer_id, COUNT(*) AS organized_count FROM Events GROUP BY organizer_id) org 
    ON u.user_id = org.organizer_id
LEFT JOIN (SELECT user_id, COUNT(*) AS attended_count FROM CheckIns GROUP BY user_id) att 
    ON u.user_id = att.user_id
LEFT JOIN (SELECT assigned_to, COUNT(*) AS volunteer_bookings FROM Bookings b 
           INNER JOIN Users u2 ON b.assigned_to = u2.user_id 
           WHERE u2.role = 'Volunteer' GROUP BY assigned_to) vol 
    ON u.user_id = vol.assigned_to
ORDER BY total_engagement_score DESC;

-- =============================================
-- 15. TEMPORAL ANALYSIS: Peak event times
-- =============================================
SELECT 
    DAYNAME(event_date) AS day_of_week,
    HOUR(event_date) AS hour_of_day,
    COUNT(*) AS event_count,
    AVG(attendee_count) AS avg_attendance
FROM Events e
LEFT JOIN (SELECT event_id, COUNT(*) AS attendee_count FROM CheckIns GROUP BY event_id) c 
    ON e.event_id = c.event_id
GROUP BY DAYNAME(event_date), HOUR(event_date)
ORDER BY event_count DESC, avg_attendance DESC;
