-- =============================================
-- Eventrix Database Schema (MySQL/PL-SQL Compatible)
-- =============================================
-- DBMS Project: Event Management System
-- Created: October 2025
-- =============================================

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS CheckIns;
DROP TABLE IF EXISTS Bookings;
DROP TABLE IF EXISTS Equipment;
DROP TABLE IF EXISTS Events;
DROP TABLE IF EXISTS Users;

-- =============================================
-- TABLE: Users
-- Description: Stores user information including organizers, volunteers, and participants
-- =============================================
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    role ENUM('Organizer', 'Volunteer', 'Participant') NOT NULL DEFAULT 'Participant',
    roll_number VARCHAR(20) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_roll_number (roll_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLE: Events
-- Description: Stores event details and links to organizers
-- =============================================
CREATE TABLE Events (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    event_name VARCHAR(200) NOT NULL,
    event_date DATETIME NOT NULL,
    venue VARCHAR(200) NOT NULL,
    description TEXT,
    organizer_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES Users(user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_event_date (event_date),
    INDEX idx_organizer (organizer_id),
    INDEX idx_venue (venue)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLE: Equipment
-- Description: Stores equipment/resource inventory
-- =============================================
CREATE TABLE Equipment (
    equip_id INT PRIMARY KEY AUTO_INCREMENT,
    equip_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    status ENUM('Available', 'Borrowed', 'Damaged') NOT NULL DEFAULT 'Available',
    location VARCHAR(100),
    purchase_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_location (location)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLE: Bookings
-- Description: Tracks equipment bookings for events
-- =============================================
CREATE TABLE Bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    equip_id INT NOT NULL,
    assigned_to INT NOT NULL,
    borrow_date DATE NOT NULL,
    return_date DATE,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES Events(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (equip_id) REFERENCES Equipment(equip_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES Users(user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_event (event_id),
    INDEX idx_equipment (equip_id),
    INDEX idx_assigned_user (assigned_to),
    INDEX idx_borrow_date (borrow_date),
    INDEX idx_return_date (return_date),
    CONSTRAINT chk_return_after_borrow CHECK (return_date IS NULL OR return_date >= borrow_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLE: CheckIns
-- Description: Tracks attendee check-ins and check-outs for events
-- =============================================
CREATE TABLE CheckIns (
    checkin_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    checkin_time DATETIME NOT NULL,
    checkout_time DATETIME,
    status ENUM('Present', 'Absent') NOT NULL DEFAULT 'Present',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (event_id) REFERENCES Events(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_event (event_id),
    INDEX idx_checkin_time (checkin_time),
    INDEX idx_status (status),
    UNIQUE KEY unique_user_event (user_id, event_id),
    CONSTRAINT chk_checkout_after_checkin CHECK (checkout_time IS NULL OR checkout_time >= checkin_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- VIEWS: Useful queries for common operations
-- =============================================

-- View: Event Summary with Organizer Details
CREATE OR REPLACE VIEW vw_event_summary AS
SELECT 
    e.event_id,
    e.event_name,
    e.event_date,
    e.venue,
    e.description,
    u.name AS organizer_name,
    u.email AS organizer_email,
    COUNT(DISTINCT c.checkin_id) AS attendee_count,
    COUNT(DISTINCT b.booking_id) AS equipment_count
FROM Events e
LEFT JOIN Users u ON e.organizer_id = u.user_id
LEFT JOIN CheckIns c ON e.event_id = c.event_id
LEFT JOIN Bookings b ON e.event_id = b.event_id
GROUP BY e.event_id, e.event_name, e.event_date, e.venue, e.description, u.name, u.email;

-- View: Equipment Status Overview
CREATE OR REPLACE VIEW vw_equipment_status AS
SELECT 
    eq.equip_id,
    eq.equip_name,
    eq.category,
    eq.status,
    eq.location,
    b.event_id,
    ev.event_name,
    u.name AS assigned_to_name,
    b.borrow_date,
    b.return_date
FROM Equipment eq
LEFT JOIN Bookings b ON eq.equip_id = b.equip_id AND b.return_date IS NULL
LEFT JOIN Events ev ON b.event_id = ev.event_id
LEFT JOIN Users u ON b.assigned_to = u.user_id;

-- View: User Activity Summary
CREATE OR REPLACE VIEW vw_user_activity AS
SELECT 
    u.user_id,
    u.name,
    u.email,
    u.role,
    u.roll_number,
    COUNT(DISTINCT CASE WHEN e.organizer_id = u.user_id THEN e.event_id END) AS organized_events,
    COUNT(DISTINCT c.event_id) AS attended_events,
    COUNT(DISTINCT b.booking_id) AS equipment_bookings
FROM Users u
LEFT JOIN Events e ON u.user_id = e.organizer_id
LEFT JOIN CheckIns c ON u.user_id = c.user_id
LEFT JOIN Bookings b ON u.user_id = b.assigned_to
GROUP BY u.user_id, u.name, u.email, u.role, u.roll_number;

-- =============================================
-- STORED PROCEDURES
-- =============================================

-- Procedure: Check-in a user to an event
DELIMITER //
CREATE PROCEDURE sp_checkin_user(
    IN p_user_id INT,
    IN p_event_id INT,
    OUT p_checkin_id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error checking in user';
    END;
    
    START TRANSACTION;
    
    -- Insert or update check-in
    INSERT INTO CheckIns (user_id, event_id, checkin_time, status)
    VALUES (p_user_id, p_event_id, NOW(), 'Present')
    ON DUPLICATE KEY UPDATE 
        checkin_time = NOW(),
        status = 'Present',
        checkout_time = NULL;
    
    SET p_checkin_id = LAST_INSERT_ID();
    
    COMMIT;
END //
DELIMITER ;

-- Procedure: Book equipment for an event
DELIMITER //
CREATE PROCEDURE sp_book_equipment(
    IN p_event_id INT,
    IN p_equip_id INT,
    IN p_assigned_to INT,
    IN p_borrow_date DATE,
    IN p_remarks TEXT,
    OUT p_booking_id INT
)
BEGIN
    DECLARE v_equip_status VARCHAR(20);
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error booking equipment';
    END;
    
    START TRANSACTION;
    
    -- Check equipment availability
    SELECT status INTO v_equip_status FROM Equipment WHERE equip_id = p_equip_id;
    
    IF v_equip_status != 'Available' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Equipment is not available';
    END IF;
    
    -- Create booking
    INSERT INTO Bookings (event_id, equip_id, assigned_to, borrow_date, remarks)
    VALUES (p_event_id, p_equip_id, p_assigned_to, p_borrow_date, p_remarks);
    
    SET p_booking_id = LAST_INSERT_ID();
    
    -- Update equipment status
    UPDATE Equipment SET status = 'Borrowed' WHERE equip_id = p_equip_id;
    
    COMMIT;
END //
DELIMITER ;

-- Procedure: Return equipment
DELIMITER //
CREATE PROCEDURE sp_return_equipment(
    IN p_booking_id INT,
    IN p_return_date DATE
)
BEGIN
    DECLARE v_equip_id INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error returning equipment';
    END;
    
    START TRANSACTION;
    
    -- Get equipment ID
    SELECT equip_id INTO v_equip_id FROM Bookings WHERE booking_id = p_booking_id;
    
    -- Update booking
    UPDATE Bookings SET return_date = p_return_date WHERE booking_id = p_booking_id;
    
    -- Update equipment status
    UPDATE Equipment SET status = 'Available' WHERE equip_id = v_equip_id;
    
    COMMIT;
END //
DELIMITER ;

-- =============================================
-- TRIGGERS
-- =============================================

-- Trigger: Prevent deleting organizer if they have upcoming events
DELIMITER //
CREATE TRIGGER trg_prevent_organizer_delete
BEFORE DELETE ON Users
FOR EACH ROW
BEGIN
    DECLARE v_upcoming_events INT;
    
    IF OLD.role = 'Organizer' THEN
        SELECT COUNT(*) INTO v_upcoming_events
        FROM Events
        WHERE organizer_id = OLD.user_id AND event_date > NOW();
        
        IF v_upcoming_events > 0 THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Cannot delete organizer with upcoming events';
        END IF;
    END IF;
END //
DELIMITER ;

-- Trigger: Auto-update equipment status when booking is returned
DELIMITER //
CREATE TRIGGER trg_update_equipment_on_return
AFTER UPDATE ON Bookings
FOR EACH ROW
BEGIN
    IF NEW.return_date IS NOT NULL AND OLD.return_date IS NULL THEN
        UPDATE Equipment 
        SET status = 'Available' 
        WHERE equip_id = NEW.equip_id 
        AND status = 'Borrowed';
    END IF;
END //
DELIMITER ;

-- =============================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- =============================================
-- Additional composite indexes for complex queries

-- Index for event search with date range
CREATE INDEX idx_event_date_venue ON Events(event_date, venue);

-- Index for booking date ranges
CREATE INDEX idx_booking_dates ON Bookings(borrow_date, return_date);

-- Index for check-in queries
CREATE INDEX idx_checkin_event_time ON CheckIns(event_id, checkin_time);

-- =============================================
-- GRANT STATEMENTS (Optional - for multi-user setup)
-- =============================================
-- GRANT SELECT, INSERT, UPDATE, DELETE ON eventrix.* TO 'eventrix_user'@'localhost';
-- FLUSH PRIVILEGES;
