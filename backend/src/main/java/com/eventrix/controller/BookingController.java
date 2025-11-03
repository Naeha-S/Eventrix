package com.eventrix.controller;

import com.eventrix.model.Booking;
import com.eventrix.repository.BookingRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingRepository bookingRepository;

    public BookingController(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @GetMapping
    public List<Booking> all() { return bookingRepository.findAll(); }

    @GetMapping("/{id}")
    public Booking get(@PathVariable Long id) { return bookingRepository.findById(id).orElse(null); }

    @PostMapping
    public Booking create(@RequestBody Booking booking) { return bookingRepository.save(booking); }

    @PutMapping("/{id}")
    public Booking update(@PathVariable Long id, @RequestBody Booking updated) {
        return bookingRepository.findById(id).map(b -> {
            b.setEventId(updated.getEventId());
            b.setEquipId(updated.getEquipId());
            b.setAssignedTo(updated.getAssignedTo());
            b.setBorrowDate(updated.getBorrowDate());
            b.setReturnDate(updated.getReturnDate());
            b.setRemarks(updated.getRemarks());
            return bookingRepository.save(b);
        }).orElseGet(() -> {
            updated.setBookingId(id);
            return bookingRepository.save(updated);
        });
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { bookingRepository.deleteById(id); }
}
