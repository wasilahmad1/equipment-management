package com.equipment.service;
import com.equipment.model.EquipmentType;
import com.equipment.repository.EquipmentTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EquipmentTypeService {
    private final EquipmentTypeRepository repo;
    public List<EquipmentType> getAllTypes() { return repo.findAll(); }
}
