package com.equipment.service;
import com.equipment.dto.MaintenanceLogDTO;
import com.equipment.exception.ResourceNotFoundException;
import com.equipment.model.Equipment;
import com.equipment.model.MaintenanceLog;
import com.equipment.repository.EquipmentRepository;
import com.equipment.repository.MaintenanceLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MaintenanceLogService {
    private final MaintenanceLogRepository maintenanceLogRepository;
    private final EquipmentRepository equipmentRepository;

    public List<MaintenanceLog> getLogsForEquipment(Long equipmentId) {
        if (!equipmentRepository.existsById(equipmentId))
            throw new ResourceNotFoundException("Equipment not found: " + equipmentId);
        return maintenanceLogRepository.findByEquipmentIdOrderByMaintenanceDateDesc(equipmentId);
    }

    @Transactional
    public MaintenanceLog create(MaintenanceLogDTO dto) {
        Equipment equipment = equipmentRepository.findById(dto.getEquipmentId())
            .orElseThrow(() -> new ResourceNotFoundException("Equipment not found: " + dto.getEquipmentId()));
        equipment.setStatus("Active");
        equipment.setLastCleanedDate(dto.getMaintenanceDate());
        equipmentRepository.save(equipment);
        MaintenanceLog log = new MaintenanceLog();
        log.setEquipment(equipment);
        log.setMaintenanceDate(dto.getMaintenanceDate());
        log.setNotes(dto.getNotes());
        log.setPerformedBy(dto.getPerformedBy());
        return maintenanceLogRepository.save(log);
    }
}
