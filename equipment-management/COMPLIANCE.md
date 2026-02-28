# Compliance Checklist

- No inline styles used (no style={{}} anywhere)
- No raw HTML form elements (all use shadcn/ui components)
- Add and Edit reuse the same EquipmentForm component
- Equipment types are not hardcoded - stored in equipment_types table
- Business rules enforced in backend:
  - 30-day Active status rule in EquipmentService
  - Maintenance side effects (status + lastCleanedDate) in MaintenanceLogService
