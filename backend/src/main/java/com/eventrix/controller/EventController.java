package com.eventrix.controller;

import com.eventrix.model.Event;
import com.eventrix.repository.EventRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {
    private final EventRepository eventRepository;

    public EventController(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @GetMapping
    public List<Event> all() { return eventRepository.findAll(); }

    @GetMapping("/{id}")
    public Event get(@PathVariable Long id) { return eventRepository.findById(id).orElse(null); }

    @PostMapping
    public Event create(@RequestBody Event event) { return eventRepository.save(event); }

    @PutMapping("/{id}")
    public Event update(@PathVariable Long id, @RequestBody Event updated) {
        return eventRepository.findById(id).map(e -> {
            e.setEventName(updated.getEventName());
            e.setEventDate(updated.getEventDate());
            e.setVenue(updated.getVenue());
            e.setDescription(updated.getDescription());
            e.setOrganizerId(updated.getOrganizerId());
            return eventRepository.save(e);
        }).orElseGet(() -> {
            updated.setEventId(id);
            return eventRepository.save(updated);
        });
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { eventRepository.deleteById(id); }
}
