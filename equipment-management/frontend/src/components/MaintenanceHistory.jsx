import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { maintenanceApi } from '@/lib/api'

export default function MaintenanceHistory({ open, onClose, equipment }) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && equipment) {
      setLoading(true)
      maintenanceApi.getByEquipment(equipment.id).then(setLogs).catch(console.error).finally(() => setLoading(false))
    }
  }, [open, equipment])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Maintenance History — {equipment?.name}</DialogTitle>
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto">
          {loading && <p className="text-center text-muted-foreground py-8">Loading...</p>}
          {!loading && logs.length === 0 && <p className="text-center text-muted-foreground py-8">No maintenance records found.</p>}
          {!loading && logs.length > 0 && (
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="rounded-lg border p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{log.maintenanceDate}</span>
                    <span className="text-xs text-muted-foreground">by {log.performedBy}</span>
                  </div>
                  {log.notes && <p className="text-sm text-muted-foreground">{log.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
