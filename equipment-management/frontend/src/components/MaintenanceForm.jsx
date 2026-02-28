import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

export default function MaintenanceForm({ open, onClose, onSubmit, equipmentName, isSubmitting, error }) {
  const [form, setForm] = useState({ maintenanceDate: '', notes: '', performedBy: '' })
  const [validationErrors, setValidationErrors] = useState({})

  const validate = () => {
    const errors = {}
    if (!form.maintenanceDate) errors.maintenanceDate = 'Maintenance date is required'
    if (!form.performedBy.trim()) errors.performedBy = 'Performed by is required'
    return errors
  }

  const handleSubmit = () => {
    const errors = validate()
    if (Object.keys(errors).length > 0) { setValidationErrors(errors); return }
    onSubmit(form)
  }

  const handleClose = () => {
    setForm({ maintenanceDate: '', notes: '', performedBy: '' })
    setValidationErrors({})
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log Maintenance — {equipmentName}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}
          <div className="grid gap-2">
            <Label htmlFor="maintenanceDate">Maintenance Date</Label>
            <Input id="maintenanceDate" type="date" value={form.maintenanceDate} onChange={(e) => setForm({ ...form, maintenanceDate: e.target.value })} />
            {validationErrors.maintenanceDate && <p className="text-xs text-red-500">{validationErrors.maintenanceDate}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="performedBy">Performed By</Label>
            <Input id="performedBy" value={form.performedBy} onChange={(e) => setForm({ ...form, performedBy: e.target.value })} placeholder="Technician name" />
            {validationErrors.performedBy && <p className="text-xs text-red-500">{validationErrors.performedBy}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional maintenance notes..." rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Log Maintenance'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
