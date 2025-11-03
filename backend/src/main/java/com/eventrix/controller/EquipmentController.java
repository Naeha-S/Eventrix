package com.eventrix.controller;

import com.eventrix.model.Equipment;
import com.eventrix.repository.EquipmentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {
    private final EquipmentRepository equipmentRepository;

    public EquipmentController(EquipmentRepository equipmentRepository) {
        this.equipmentRepository = equipmentRepository;
    }

    @GetMapping
    public List<Equipment> all() { return equipmentRepository.findAll(); }

    @GetMapping("/{id}")
    public Equipment get(@PathVariable Long id) { return equipmentRepository.findById(id).orElse(null); }

    @PostMapping
    public Equipment create(@RequestBody Equipment equipment) { return equipmentRepository.save(equipment); }

    @PutMapping("/{id}")
    public Equipment update(@PathVariable Long id, @RequestBody Equipment updated) {
        return equipmentRepository.findById(id).map(e -> {
            e.setEquipName(updated.getEquipName());
            e.setCategory(updated.getCategory());
            e.setStatus(updated.getStatus());
            e.setLocation(updated.getLocation());
            e.setPurchaseDate(updated.getPurchaseDate());
            return equipmentRepository.save(e);
        }).orElseGet(() -> {
            updated.setEquipId(id);
            return equipmentRepository.save(updated);
        });
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { equipmentRepository.deleteById(id); }
}
