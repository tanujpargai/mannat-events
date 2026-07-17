import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { z } from 'zod'

const MenuItemSchema = z.object({
  type:        z.enum(['veg', 'non-veg']),
  name:        z.string().min(1),
  description: z.string().optional(),
  is_active:   z.boolean().optional().default(true),
  sort_order:  z.number().int().optional().default(0),
})

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return profile?.role === 'admin' ? user : null
}

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('menus')
    .select('*')
    .order('type')
    .order('sort_order')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body   = await req.json()
  const parsed = MenuItemSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const service = createServiceClient()
  const { data, error } = await service.from('menus').insert(parsed.data).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id, ...rest } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const service = createServiceClient()
  const { data, error } = await service.from('menus').update(rest).eq('id', id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const service = createServiceClient()
  const { error } = await service.from('menus').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
