import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Wrench, History, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import EquipmentForm from '@/components/EquipmentForm'
import MaintenanceForm from '@/components/MaintenanceForm'
import MaintenanceHistory from '@/components/MaintenanceHistory'
import ConfirmDialog from '@/components/ConfirmDialog'
import { equipmentApi, maintenanceApi } from '@/lib/api'

const STATUS_FILTER_OPTIONS = ['All', 'Active', 'Inactive', 'Under Maintenance']

function getStatusVariant(status) {
  if (status === 'Active') return 'success'
  if (status === 'Under Maintenance') return 'warning'
  return 'inactive'
}

export default function App() {
  const [equipment, setEquipment] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('All')
  const [formOpen, setFormOpen] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState(null)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [maintenanceFormOpen, setMaintenanceFormOpen] = useState(false)
  const [maintenanceTarget, setMaintenanceTarget] = useState(null)
  const [maintenanceSubmitting, setMaintenanceSubmitting] = useState(false)
  const [maintenanceError, setMaintenanceError] = useState('')
  const [historyTarget, setHistoryTarget] = useState(null)

  const fetchEquipment = useCallback(async () => {
    setLoading(true)
    try {
      const data = await equipmentApi.getAll(statusFilter === 'All' ? '' : statusFilter)
      setEquipment(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => { fetchEquipment() }, [fetchEquipment])

  const handleFormSubmit = async (data) => {
    setFormSubmitting(true); setFormError('')
    try {
      if (editingEquipment) await equipmentApi.update(editingEquipment.id, data)
      else await equipmentApi.create(data)
      setFormOpen(false); fetchEquipment()
    } catch (err) {
      setFormError(err.message || 'Failed to save equipment.')
    } finally { setFormSubmitting(false) }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try { await equipmentApi.delete(deleteTarget.id); setDeleteTarget(null); fetchEquipment() }
    catch (err) { console.error(err) }
    finally { setDeleteLoading(false) }
  }

  const handleMaintenanceSubmit = async (data) => {
    setMaintenanceSubmitting(true); setMaintenanceError('')
    try {
      await maintenanceApi.create({ ...data, equipmentId: maintenanceTarget.id })
      setMaintenanceFormOpen(false); fetchEquipment()
    } catch (err) {
      setMaintenanceError(err.message || 'Failed to log maintenance.')
    } finally { setMaintenanceSubmitting(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Equipment Management</h1>
          </div>
          <Button onClick={() => { setEditingEquipment(null); setFormError(''); setFormOpen(true) }} className="gap-2">
            <Plus className="w-4 h-4" />Add Equipment
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="w-52">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue placeholder="Filter by status" /></SelectTrigger>
              <SelectContent>
                {STATUS_FILTER_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="icon" onClick={fetchEquipment}><RefreshCw className="w-4 h-4" /></Button>
          <span className="text-sm text-muted-foreground">{equipment.length} {equipment.length === 1 ? 'item' : 'items'}</span>
        </div>

        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Name</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Type</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Last Cleaned</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading && <tr><td colSpan={5} className="text-center py-12 text-muted-foreground">Loading...</td></tr>}
                {!loading && equipment.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-muted-foreground">No equipment found. Click "Add Equipment" to get started.</td></tr>}
                {!loading && equipment.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-gray-600">{item.type?.name}</td>
                    <td className="px-6 py-4"><Badge variant={getStatusVariant(item.status)}>{item.status}</Badge></td>
                    <td className="px-6 py-4 text-gray-600">{item.lastCleanedDate || <span className="italic text-muted-foreground">Not set</span>}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" title="History" onClick={() => setHistoryTarget(item)}><History className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" title="Log Maintenance" onClick={() => { setMaintenanceTarget(item); setMaintenanceError(''); setMaintenanceFormOpen(true) }}><Wrench className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" title="Edit" onClick={() => { setEditingEquipment(item); setFormError(''); setFormOpen(true) }}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" title="Delete" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => setDeleteTarget(item)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <EquipmentForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleFormSubmit} initialData={editingEquipment} isSubmitting={formSubmitting} error={formError} />
      <MaintenanceForm open={maintenanceFormOpen} onClose={() => setMaintenanceFormOpen(false)} onSubmit={handleMaintenanceSubmit} equipmentName={maintenanceTarget?.name} isSubmitting={maintenanceSubmitting} error={maintenanceError} />
      <MaintenanceHistory open={!!historyTarget} onClose={() => setHistoryTarget(null)} equipment={historyTarget} />
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDeleteConfirm} title="Delete Equipment" description={`Are you sure you want to delete "${deleteTarget?.name}"? This will also delete all maintenance records.`} isLoading={deleteLoading} />
    </div>
  )
}
