package com.equipment.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class EquipmentDTO {
    @NotBlank(message = "Equipment name is required")
    private String name;

    @NotNull(message = "Equipment type is required")
    private Long typeId;

    @NotBlank(message = "Status is required")
    private String status;

    private LocalDate lastCleanedDate;
}
