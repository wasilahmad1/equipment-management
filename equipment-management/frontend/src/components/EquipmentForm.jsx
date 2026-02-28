import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { equipmentTypeApi } from '@/lib/api'

const STATUS_OPTIONS = ['Active', 'Inactive', 'Under Maintenance']

export default function EquipmentForm({ open, onClose, onSubmit, initialData, isSubmitting, error }) {
  const [types, setTypes] = useState([])
  const [form, setForm] = useState({ name: '', typeId: '', status: '', lastCleanedDate: '' })
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    equipmentTypeApi.getAll().then(setTypes).catch(console.error)
  }, [])

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        typeId: String(initialData.type?.id || ''),
        status: initialData.status || '',
        lastCleanedDate: initialData.lastCleanedDate || '',
      })
    } else {
      setForm({ name: '', typeId: '', status: '', lastCleanedDate: '' })
    }
    setValidationErrors({})
  }, [initialData, open])

  const validate = () => {
    const errors = {}
    if (!form.name.trim()) errors.name = 'Name is required'
    if (!form.typeId) errors.typeId = 'Type is required'
    if (!form.status) errors.status = 'Status is required'
    return errors
  }

  const handleSubmit = () => {
    const errors = validate()
    if (Object.keys(errors).length > 0) { setValidationErrors(errors); return }
    onSubmit({ name: form.name, typeId: Number(form.typeId), status: form.status, lastCleanedDate: form.lastCleanedDate || null })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Equipment' : 'Add New Equipment'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Equipment name" />
            {validationErrors.name && <p className="text-xs text-red-500">{validationErrors.name}</p>}
          </div>
          <div className="grid gap-2">
            <Label>Type</Label>
            <Select value={form.typeId} onValueChange={(val) => setForm({ ...form, typeId: val })}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                {types.map((t) => <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {validationErrors.typeId && <p className="text-xs text-red-500">{validationErrors.typeId}</p>}
          </div>
          <div className="grid gap-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(val) => setForm({ ...form, status: val })}>
              <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            {validationErrors.status && <p className="text-xs text-red-500">{validationErrors.status}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastCleanedDate">Last Cleaned Date</Label>
            <Input id="lastCleanedDate" type="date" value={form.lastCleanedDate} onChange={(e) => setForm({ ...form, lastCleanedDate: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (initialData ? 'Update' : 'Create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
