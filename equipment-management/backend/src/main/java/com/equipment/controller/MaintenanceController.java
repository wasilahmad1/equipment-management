package com.equipment.controller;
import com.equipment.dto.MaintenanceLogDTO;
import com.equipment.model.MaintenanceLog;
import com.equipment.service.MaintenanceLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class MaintenanceController {
    private final MaintenanceLogService service;

    @PostMapping("/api/maintenance")
    public ResponseEntity<MaintenanceLog> create(@Valid @RequestBody MaintenanceLogDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @GetMapping("/api/equipment/{id}/maintenance")
    public ResponseEntity<List<MaintenanceLog>> getLogs(@PathVariable Long id) {
        return ResponseEntity.ok(service.getLogsForEquipment(id));
    }
}
