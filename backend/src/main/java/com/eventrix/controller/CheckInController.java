package com.eventrix.controller;

import com.eventrix.model.CheckIn;
import com.eventrix.repository.CheckInRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/checkins")
public class CheckInController {
    private final CheckInRepository checkInRepository;

    public CheckInController(CheckInRepository checkInRepository) {
        this.checkInRepository = checkInRepository;
    }

    @GetMapping
    public List<CheckIn> all() { return checkInRepository.findAll(); }

    @GetMapping("/{id}")
    public CheckIn get(@PathVariable Long id) { return checkInRepository.findById(id).orElse(null); }

    @PostMapping
    public CheckIn create(@RequestBody CheckIn checkIn) { return checkInRepository.save(checkIn); }

    @PutMapping("/{id}")
    public CheckIn update(@PathVariable Long id, @RequestBody CheckIn updated) {
        return checkInRepository.findById(id).map(c -> {
            c.setUserId(updated.getUserId());
            c.setEventId(updated.getEventId());
            c.setCheckinTime(updated.getCheckinTime());
            c.setCheckoutTime(updated.getCheckoutTime());
            c.setStatus(updated.getStatus());
            return checkInRepository.save(c);
        }).orElseGet(() -> {
            updated.setCheckinId(id);
            return checkInRepository.save(updated);
        });
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { checkInRepository.deleteById(id); }
}
