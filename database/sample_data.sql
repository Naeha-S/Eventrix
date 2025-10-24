-- =============================================
-- Eventrix Sample Data (MySQL/PL-SQL Compatible)
-- =============================================
-- DBMS Project: Event Management System
-- Sample data for testing and demonstration
-- =============================================

-- Clear existing data (in correct order due to foreign keys)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE CheckIns;
TRUNCATE TABLE Bookings;
TRUNCATE TABLE Equipment;
TRUNCATE TABLE Events;
TRUNCATE TABLE Users;
SET FOREIGN_KEY_CHECKS = 1;

-- Reset auto-increment counters (optional)
ALTER TABLE Users AUTO_INCREMENT = 1;
ALTER TABLE Events AUTO_INCREMENT = 101;
ALTER TABLE Equipment AUTO_INCREMENT = 201;
ALTER TABLE Bookings AUTO_INCREMENT = 301;
ALTER TABLE CheckIns AUTO_INCREMENT = 401;

-- =============================================
-- INSERT: Users
-- =============================================
INSERT INTO Users (user_id, name, email, phone, role, roll_number) VALUES
(1, 'Alice Johnson', 'alice@example.com', '123-456-7890', 'Organizer', '202100001'),
(2, 'Bob Williams', 'bob@example.com', '234-567-8901', 'Volunteer', '202100002'),
(3, 'Charlie Brown', 'charlie@example.com', '345-678-9012', 'Participant', '202100003'),
(4, 'Diana Miller', 'diana@example.com', '456-789-0123', 'Participant', '202100004'),
(5, 'Ethan Davis', 'ethan@example.com', '567-890-1234', 'Volunteer', '202100005'),
(6, 'Fiona Garcia', 'fiona@example.com', '678-901-2345', 'Participant', '202100006'),
(7, 'George Wilson', 'george@example.com', '789-012-3456', 'Volunteer', '202100007'),
(8, 'Hannah Lee', 'hannah@example.com', '890-123-4567', 'Organizer', '202100008'),
(9, 'Ian Martinez', 'ian@example.com', '901-234-5678', 'Participant', '202100009'),
(10, 'Julia Anderson', 'julia@example.com', '012-345-6789', 'Participant', '202100010');

-- =============================================
-- INSERT: Events
-- =============================================
INSERT INTO Events (event_id, event_name, event_date, venue, description, organizer_id) VALUES
(101, 'Annual Tech Conference', '2024-08-15 09:00:00', 'Main Auditorium', 'A conference about the latest trends in technology.', 1),
(102, 'Summer Music Festival', '2024-07-20 14:00:00', 'Central Park', 'An outdoor music festival featuring local bands.', 1),
(103, 'Community Hackathon', '2024-09-05 10:00:00', 'Innovation Hub', 'A 24-hour coding competition to solve local problems.', 5),
(104, 'Art Exhibition Opening', '2023-11-01 18:00:00', 'Downtown Gallery', 'Opening night for a new contemporary art exhibition.', 1),
(105, 'Startup Pitch Competition', '2024-10-12 15:00:00', 'Business Incubator', 'Entrepreneurs pitch their startup ideas to investors.', 8),
(106, 'Environmental Awareness Workshop', '2024-11-20 11:00:00', 'Community Center', 'Workshop on sustainability and environmental protection.', 8),
(107, 'Sports Day 2024', '2024-12-05 08:00:00', 'University Stadium', 'Annual inter-department sports competition.', 1);

-- =============================================
-- INSERT: Equipment
-- =============================================
INSERT INTO Equipment (equip_id, equip_name, category, status, location, purchase_date) VALUES
(201, 'Projector A', 'AV', 'Available', 'Storage Room 1', '2022-01-15'),
(202, 'Microphone Kit (2 mics)', 'Audio', 'Borrowed', 'AV Booth', '2022-03-20'),
(203, 'Laptop (Dell XPS 15)', 'IT', 'Available', 'IT Office', '2023-05-10'),
(204, 'Portable Speaker', 'Audio', 'Damaged', 'Storage Room 2', '2021-11-30'),
(205, 'VR Headset (Quest 3)', 'AV', 'Available', 'Innovation Hub', '2024-02-01'),
(206, 'Whiteboard (6x4 ft)', 'Office', 'Available', 'Conference Room A', '2020-08-12'),
(207, 'Camera (Canon EOS R5)', 'AV', 'Available', 'Media Room', '2023-09-15'),
(208, 'Folding Tables (Set of 10)', 'Furniture', 'Available', 'Storage Room 1', '2021-03-05'),
(209, 'Sound Mixer', 'Audio', 'Available', 'AV Booth', '2022-11-22'),
(210, 'LED Screen (10x8 ft)', 'AV', 'Borrowed', 'Main Auditorium', '2023-01-10');

-- =============================================
-- INSERT: Bookings
-- =============================================
INSERT INTO Bookings (booking_id, event_id, equip_id, assigned_to, borrow_date, return_date, remarks) VALUES
(301, 102, 202, 2, '2024-07-19', NULL, 'For main stage announcements.'),
(302, 101, 201, 1, '2024-08-14', '2024-08-16', 'Returned in good condition'),
(303, 103, 203, 4, '2024-09-04', '2024-09-06', 'Used for judging panel'),
(304, 105, 207, 8, '2024-10-11', '2024-10-13', 'Recording pitch presentations'),
(305, 101, 210, 1, '2024-08-14', '2024-08-16', 'Main stage backdrop'),
(306, 107, 208, 2, '2024-12-04', NULL, 'Registration and refreshment area'),
(307, 106, 206, 7, '2024-11-20', NULL, 'Workshop brainstorming sessions');

-- =============================================
-- INSERT: CheckIns
-- =============================================
INSERT INTO CheckIns (checkin_id, user_id, event_id, checkin_time, checkout_time, status) VALUES
(401, 3, 101, '2024-08-15 09:05:00', NULL, 'Present'),
(402, 4, 101, '2024-08-15 09:15:00', NULL, 'Present'),
(403, 2, 102, '2024-07-20 13:45:00', NULL, 'Present'),
(404, 3, 102, '2024-07-20 14:10:00', NULL, 'Present'),
(405, 5, 103, '2024-09-05 09:55:00', NULL, 'Present'),
(406, 6, 101, '2024-08-15 09:20:00', '2024-08-15 17:30:00', 'Present'),
(407, 7, 103, '2024-09-05 10:15:00', NULL, 'Present'),
(408, 9, 105, '2024-10-12 14:50:00', '2024-10-12 18:00:00', 'Present'),
(409, 10, 105, '2024-10-12 15:10:00', '2024-10-12 18:00:00', 'Present'),
(410, 2, 106, '2024-11-20 10:55:00', NULL, 'Present');

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Verify data insertion
SELECT 'Users' AS TableName, COUNT(*) AS RecordCount FROM Users
UNION ALL
SELECT 'Events', COUNT(*) FROM Events
UNION ALL
SELECT 'Equipment', COUNT(*) FROM Equipment
UNION ALL
SELECT 'Bookings', COUNT(*) FROM Bookings
UNION ALL
SELECT 'CheckIns', COUNT(*) FROM CheckIns;

-- Show events with attendee counts
SELECT * FROM vw_event_summary ORDER BY event_date DESC;

-- Show equipment status
SELECT * FROM vw_equipment_status;

-- Show user activity
SELECT * FROM vw_user_activity ORDER BY organized_events DESC, attended_events DESC;
