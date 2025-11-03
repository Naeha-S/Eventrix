package com.eventrix.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;

@Entity
@Table(name = "checkins")
public class CheckIn {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long checkinId;
    private Long userId;
    private Long eventId;
    private String checkinTime; // ISO
    private String checkoutTime; // ISO or null
    private String status;

    public CheckIn() {}

    public CheckIn(Long checkinId, Long userId, Long eventId, String checkinTime, String checkoutTime, String status) {
        this.checkinId = checkinId;
        this.userId = userId;
        this.eventId = eventId;
        this.checkinTime = checkinTime;
        this.checkoutTime = checkoutTime;
        this.status = status;
    }

    public Long getCheckinId() { return checkinId; }
    public void setCheckinId(Long checkinId) { this.checkinId = checkinId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }
    public String getCheckinTime() { return checkinTime; }
    public void setCheckinTime(String checkinTime) { this.checkinTime = checkinTime; }
    public String getCheckoutTime() { return checkoutTime; }
    public void setCheckoutTime(String checkoutTime) { this.checkoutTime = checkoutTime; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
