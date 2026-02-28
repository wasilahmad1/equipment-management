package com.equipment.service;
import com.equipment.dto.EquipmentDTO;
import com.equipment.exception.BusinessRuleViolationException;
import com.equipment.exception.ResourceNotFoundException;
import com.equipment.model.Equipment;
import com.equipment.model.EquipmentType;
import com.equipment.repository.EquipmentRepository;
import com.equipment.repository.EquipmentTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EquipmentService {
    private final EquipmentRepository equipmentRepository;
    private final EquipmentTypeRepository equipmentTypeRepository;

    public List<Equipment> getAllEquipment(String status) {
        if (status != null && !status.isEmpty()) return equipmentRepository.findAllByStatus(status);
        return equipmentRepository.findAll();
    }

    public Equipment getById(Long id) {
        return equipmentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Equipment not found: " + id));
    }

    @Transactional
    public Equipment create(EquipmentDTO dto) {
        EquipmentType type = equipmentTypeRepository.findById(dto.getTypeId())
            .orElseThrow(() -> new ResourceNotFoundException("Type not found: " + dto.getTypeId()));
        validateActiveRule(dto.getStatus(), dto.getLastCleanedDate());
        Equipment e = new Equipment();
        e.setName(dto.getName()); e.setType(type);
        e.setStatus(dto.getStatus()); e.setLastCleanedDate(dto.getLastCleanedDate());
        return equipmentRepository.save(e);
    }

    @Transactional
    public Equipment update(Long id, EquipmentDTO dto) {
        Equipment e = getById(id);
        EquipmentType type = equipmentTypeRepository.findById(dto.getTypeId())
            .orElseThrow(() -> new ResourceNotFoundException("Type not found: " + dto.getTypeId()));
        validateActiveRule(dto.getStatus(), dto.getLastCleanedDate());
        e.setName(dto.getName()); e.setType(type);
        e.setStatus(dto.getStatus()); e.setLastCleanedDate(dto.getLastCleanedDate());
        return equipmentRepository.save(e);
    }

    @Transactional
    public void delete(Long id) {
        if (!equipmentRepository.existsById(id)) throw new ResourceNotFoundException("Equipment not found: " + id);
        equipmentRepository.deleteById(id);
    }

    private void validateActiveRule(String status, LocalDate lastCleanedDate) {
        if ("Active".equals(status)) {
            if (lastCleanedDate == null)
                throw new BusinessRuleViolationException("Equipment cannot be Active without a Last Cleaned Date.");
            if (lastCleanedDate.isBefore(LocalDate.now().minusDays(30)))
                throw new BusinessRuleViolationException(
                    "Equipment cannot be Active because the Last Cleaned Date is older than 30 days. Log a maintenance event first.");
        }
    }
}
