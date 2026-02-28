package com.equipment.controller;
import com.equipment.model.EquipmentType;
import com.equipment.service.EquipmentTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/equipment-types")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class EquipmentTypeController {
    private final EquipmentTypeService service;

    @GetMapping
    public ResponseEntity<List<EquipmentType>> getAll() {
        return ResponseEntity.ok(service.getAllTypes());
    }
}
