'use client'

import { useEffect, useState, useCallback } from 'react'
import { ShieldX, Loader2, Plus, Trash2 } from 'lucide-react'
import { BlockedPhone } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { cn } from '@/lib/utils/cn'

export default function AdminBlockedPhonesPage() {
  const [list,    setList]    = useState<BlockedPhone[]>([])
  const [loading, setLoading] = useState(true)
  const [adding,  setAdding]  = useState(false)
  const [form,    setForm]    = useState({ phone: '', reason: '' })
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const res  = await fetch('/api/admin/blocked-phones')
    const data = await res.json()
    setList(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleBlock(e: React.FormEvent) {
    e.preventDefault()
    if (!form.phone.trim()) return
    setSaving(true)
    setError('')
    try {
      const res  = await fetch('/api/admin/blocked-phones', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Failed to block number.')
        return
      }
      setForm({ phone: '', reason: '' })
      setAdding(false)
      load()
    } finally {
      setSaving(false)
    }
  }

  async function handleUnblock(id: string, phone: string) {
    if (!confirm(`Unblock ${phone}?`)) return
    await fetch('/api/admin/blocked-phones', {
      method:  'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ id }),
    })
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-medium text-[#1A1A1A]">Blocked Phone Numbers</h2>
          <p className="text-sm text-[#737373] mt-1">
            Numbers on this list cannot submit booking requests.
          </p>
        </div>
        <Button onClick={() => setAdding(true)}>
          <Plus size={16} className="mr-1.5" />Block Number
        </Button>
      </div>

      {/* Add form */}
      {adding && (
        <form onSubmit={handleBlock} className="bg-[#FDFCFA] border border-[#E8E2D8] rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-[#1A1A1A]">Block a Phone Number</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bp-phone" required>Phone Number</Label>
              <Input
                id="bp-phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bp-reason">Reason</Label>
              <Input
                id="bp-reason"
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="e.g. Spam submissions"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          <div className="flex gap-3">
            <Button type="submit" loading={saving}>Block Number</Button>
            <Button type="button" variant="secondary" onClick={() => { setAdding(false); setError('') }}>Cancel</Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#C5A85C]" /></div>
      ) : list.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-[#E8E2D8]">
          <ShieldX size={32} className="mx-auto text-[#D4CFC9] mb-3" strokeWidth={1.4} />
          <p className="text-sm text-[#A8A8A8]">No blocked numbers. The list is clean.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#E8E2D8] bg-white">
          <table className="luxury-table">
            <thead>
              <tr>
                <th>Phone</th>
                <th>Reason</th>
                <th>Blocked At</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((entry) => (
                <tr key={entry.id}>
                  <td>
                    <span className="font-mono text-sm font-medium text-[#1A1A1A]">{entry.phone}</span>
                  </td>
                  <td className="text-[#737373] text-sm">
                    {entry.reason ?? <span className="text-[#D4CFC9] italic">No reason given</span>}
                  </td>
                  <td className="text-sm text-[#737373]">
                    {new Date(entry.blocked_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </td>
                  <td>
                    <button
                      onClick={() => handleUnblock(entry.id, entry.phone)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold',
                        'border border-red-200 text-red-600 hover:bg-red-50 transition-all'
                      )}
                    >
                      <Trash2 size={13} />Unblock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
