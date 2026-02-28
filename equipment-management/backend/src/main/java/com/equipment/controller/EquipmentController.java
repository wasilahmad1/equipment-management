package com.equipment.controller;
import com.equipment.dto.EquipmentDTO;
import com.equipment.model.Equipment;
import com.equipment.service.EquipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/equipment")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class EquipmentController {
    private final EquipmentService service;

    @GetMapping
    public ResponseEntity<List<Equipment>> getAll(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(service.getAllEquipment(status));
    }

    @PostMapping
    public ResponseEntity<Equipment> create(@Valid @RequestBody EquipmentDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Equipment> update(@PathVariable Long id, @Valid @RequestBody EquipmentDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
