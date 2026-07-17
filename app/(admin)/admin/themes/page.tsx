'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, ImageOff, Loader2, ExternalLink } from 'lucide-react'
import { DecorationTheme } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

function ThemeForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<DecorationTheme>
  onSave: (item: Partial<DecorationTheme>) => Promise<void>
  onCancel: () => void
}) {
  const [form, setForm] = useState({
    title:       initial?.title       ?? '',
    description: initial?.description ?? '',
    image_url:   initial?.image_url   ?? '',
    sort_order:  initial?.sort_order  ?? 0,
  })
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState(initial?.image_url ?? '')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave({ ...initial, ...form, image_url: form.image_url || null })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#FDFCFA] border border-[#E8E2D8] rounded-2xl p-6 space-y-4">
      <h3 className="font-semibold text-[#1A1A1A]">{initial?.id ? 'Edit Theme' : 'Add New Theme'}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="th-title" required>Title</Label>
            <Input id="th-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Floral Elegance" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="th-desc">Description</Label>
            <textarea
              id="th-desc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Describe the theme style..."
              className="w-full border border-[#E8E2D8] rounded-xl px-4 py-3 text-sm resize-none bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="th-order">Sort Order</Label>
            <Input id="th-order" type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="th-img">Image URL</Label>
            <div className="flex gap-2">
              <Input
                id="th-img"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder="https://..."
                className="flex-1"
              />
              <button type="button" onClick={() => setPreview(form.image_url)} className="px-3 rounded-xl border border-[#E8E2D8] text-xs font-medium text-[#737373] hover:border-[#C5A85C] transition-colors">
                Preview
              </button>
            </div>
          </div>

          {/* Image preview */}
          <div className="aspect-video w-full rounded-xl overflow-hidden border border-[#E8E2D8] bg-[#F5EDD6] flex items-center justify-center">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" onError={() => setPreview('')} />
            ) : (
              <div className="flex flex-col items-center gap-2 text-[#C5A85C]">
                <ImageOff size={24} strokeWidth={1.4} />
                <span className="text-xs text-[#A8A8A8]">Enter URL and click Preview</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={saving} className="flex-1">Save Theme</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}

export default function AdminThemesPage() {
  const [themes,  setThemes]  = useState<DecorationTheme[]>([])
  const [loading, setLoading] = useState(true)
  const [adding,  setAdding]  = useState(false)
  const [editId,  setEditId]  = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const res  = await fetch('/api/admin/themes')
    const data = await res.json()
    setThemes(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleSave(item: Partial<DecorationTheme>) {
    if (item.id) {
      await fetch('/api/admin/themes', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) })
    } else {
      await fetch('/api/admin/themes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) })
    }
    setAdding(false)
    setEditId(null)
    load()
  }

  async function toggleActive(theme: DecorationTheme) {
    await fetch('/api/admin/themes', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: theme.id, is_active: !theme.is_active }) })
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this decoration theme?')) return
    await fetch('/api/admin/themes', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-medium text-[#1A1A1A]">Decoration Themes</h2>
          <p className="text-sm text-[#737373] mt-1">Manage themes shown in the booking wizard. Upload image URLs from your CDN or image host.</p>
        </div>
        <Button onClick={() => { setAdding(true); setEditId(null) }}>
          <Plus size={16} className="mr-1.5" />Add Theme
        </Button>
      </div>

      {adding && (
        <ThemeForm onSave={handleSave} onCancel={() => setAdding(false)} />
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#C5A85C]" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {themes.length === 0 && (
            <div className="col-span-full text-center py-16 text-[#A8A8A8]">No themes yet. Add one above.</div>
          )}
          {themes.map((theme) =>
            editId === theme.id ? (
              <div key={theme.id} className="md:col-span-2 xl:col-span-3">
                <ThemeForm initial={theme} onSave={handleSave} onCancel={() => setEditId(null)} />
              </div>
            ) : (
              <div key={theme.id} className="rounded-2xl border border-[#E8E2D8] bg-white overflow-hidden shadow-3d">
                {/* Image */}
                <div className="aspect-video bg-[#F5EDD6] relative overflow-hidden">
                  {theme.image_url ? (
                    <img src={theme.image_url} alt={theme.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#C5A85C]">
                      <ImageOff size={24} strokeWidth={1.4} />
                      <span className="text-xs text-[#A8A8A8]">No image uploaded</span>
                    </div>
                  )}
                  {!theme.is_active && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <span className="px-3 py-1 bg-[#1A1A1A] text-white text-xs font-bold rounded-full">INACTIVE</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-[#1A1A1A]">{theme.title}</h3>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {theme.image_url && (
                        <a href={theme.image_url} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-[#F5EDD6] text-[#737373] hover:text-[#C5A85C] transition-all">
                          <ExternalLink size={14} />
                        </a>
                      )}
                      <button onClick={() => setEditId(theme.id)} className="p-1.5 rounded-lg hover:bg-[#F5EDD6] text-[#737373] hover:text-[#C5A85C] transition-all">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => toggleActive(theme)} className="p-1.5 rounded-lg hover:bg-[#F5EDD6] text-[#737373] hover:text-[#C5A85C] transition-all">
                        {theme.is_active ? <ToggleRight size={18} className="text-[#C5A85C]" /> : <ToggleLeft size={18} />}
                      </button>
                      <button onClick={() => handleDelete(theme.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#737373] hover:text-red-500 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  {theme.description && (
                    <p className="text-xs text-[#737373] leading-relaxed line-clamp-2">{theme.description}</p>
                  )}
                  <p className="mt-2 text-[11px] text-[#A8A8A8]">Sort: {theme.sort_order}</p>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}
