'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react'
import { MenuItem } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { cn } from '@/lib/utils/cn'

function MenuItemForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<MenuItem>
  onSave: (item: Partial<MenuItem>) => Promise<void>
  onCancel: () => void
}) {
  const [form, setForm] = useState({
    type:        initial?.type        ?? 'veg',
    name:        initial?.name        ?? '',
    description: initial?.description ?? '',
    sort_order:  initial?.sort_order  ?? 0,
  })
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave({ ...initial, ...form })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#FDFCFA] border border-[#E8E2D8] rounded-2xl p-6 space-y-4">
      <h3 className="font-semibold text-[#1A1A1A]">{initial?.id ? 'Edit Item' : 'Add New Item'}</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type" required>Type</Label>
          <select
            id="type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as 'veg' | 'non-veg' })}
            className="w-full border border-[#E8E2D8] rounded-xl px-4 py-2.5 text-sm bg-white"
          >
            <option value="veg">🌿 Vegetarian</option>
            <option value="non-veg">🍗 Non-Vegetarian</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort_order">Sort Order</Label>
          <Input
            id="sort_order"
            type="number"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name" required>Item Name</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Paneer Butter Masala"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Brief description of the dish"
          rows={2}
          className="w-full border border-[#E8E2D8] rounded-xl px-4 py-3 text-sm resize-none bg-white"
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={saving} className="flex-1">Save Item</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}

export default function AdminMenusPage() {
  const [items,     setItems]     = useState<MenuItem[]>([])
  const [loading,   setLoading]   = useState(true)
  const [adding,    setAdding]    = useState(false)
  const [editId,    setEditId]    = useState<string | null>(null)
  const [filterType, setFilter]   = useState<'all' | 'veg' | 'non-veg'>('all')

  const load = useCallback(async () => {
    setLoading(true)
    const res  = await fetch('/api/admin/menus')
    const data = await res.json()
    setItems(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleSave(item: Partial<MenuItem>) {
    if (item.id) {
      await fetch('/api/admin/menus', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) })
    } else {
      await fetch('/api/admin/menus', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) })
    }
    setAdding(false)
    setEditId(null)
    load()
  }

  async function toggleActive(item: MenuItem) {
    await fetch('/api/admin/menus', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id, is_active: !item.is_active }) })
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this menu item?')) return
    await fetch('/api/admin/menus', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  const visible = items.filter((i) => filterType === 'all' || i.type === filterType)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-medium text-[#1A1A1A]">Menu Items</h2>
          <p className="text-sm text-[#737373] mt-1">Manage Veg &amp; Non-Veg menu items available for booking selection.</p>
        </div>
        <Button onClick={() => { setAdding(true); setEditId(null) }}>
          <Plus size={16} className="mr-1.5" />Add Item
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all', 'veg', 'non-veg'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-semibold border transition-all',
              filterType === t
                ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                : 'bg-white border-[#E8E2D8] text-[#737373] hover:border-[#C5A85C]'
            )}
          >
            {t === 'all' ? 'All' : t === 'veg' ? '🌿 Veg' : '🍗 Non-Veg'}
          </button>
        ))}
      </div>

      {/* Add form */}
      {adding && (
        <MenuItemForm onSave={handleSave} onCancel={() => setAdding(false)} />
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#C5A85C]" /></div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#E8E2D8] bg-white">
          <table className="luxury-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Description</th>
                <th>Order</th>
                <th>Active</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 && (
                <tr><td colSpan={6} className="text-center text-[#A8A8A8] py-8">No items found.</td></tr>
              )}
              {visible.map((item) =>
                editId === item.id ? (
                  <tr key={item.id}>
                    <td colSpan={6} className="p-4">
                      <MenuItemForm initial={item} onSave={handleSave} onCancel={() => setEditId(null)} />
                    </td>
                  </tr>
                ) : (
                  <tr key={item.id}>
                    <td className="font-medium">{item.name}</td>
                    <td>
                      <span className={cn(
                        'px-2 py-0.5 rounded-full text-xs font-semibold',
                        item.type === 'veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      )}>
                        {item.type === 'veg' ? '🌿 Veg' : '🍗 Non-Veg'}
                      </span>
                    </td>
                    <td className="text-[#737373] text-sm max-w-xs truncate">{item.description ?? '—'}</td>
                    <td className="text-[#737373]">{item.sort_order}</td>
                    <td>
                      <button onClick={() => toggleActive(item)} className="text-[#737373] hover:text-[#C5A85C] transition-colors">
                        {item.is_active
                          ? <ToggleRight size={22} className="text-[#C5A85C]" />
                          : <ToggleLeft size={22} />}
                      </button>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => setEditId(item.id)} className="p-1.5 rounded-lg hover:bg-[#F5EDD6] text-[#737373] hover:text-[#C5A85C] transition-all">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#737373] hover:text-red-500 transition-all">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
