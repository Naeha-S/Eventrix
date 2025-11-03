package com.eventrix.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;

@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;
    private Long eventId;
    private Long equipId;
    private Long assignedTo;
    private String borrowDate; // YYYY-MM-DD
    private String returnDate; // YYYY-MM-DD or null
    private String remarks;

    public Booking() {}

    public Booking(Long bookingId, Long eventId, Long equipId, Long assignedTo, String borrowDate, String returnDate, String remarks) {
        this.bookingId = bookingId;
        this.eventId = eventId;
        this.equipId = equipId;
        this.assignedTo = assignedTo;
        this.borrowDate = borrowDate;
        this.returnDate = returnDate;
        this.remarks = remarks;
    }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }
    public Long getEquipId() { return equipId; }
    public void setEquipId(Long equipId) { this.equipId = equipId; }
    public Long getAssignedTo() { return assignedTo; }
    public void setAssignedTo(Long assignedTo) { this.assignedTo = assignedTo; }
    public String getBorrowDate() { return borrowDate; }
    public void setBorrowDate(String borrowDate) { this.borrowDate = borrowDate; }
    public String getReturnDate() { return returnDate; }
    public void setReturnDate(String returnDate) { this.returnDate = returnDate; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
