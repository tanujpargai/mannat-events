import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { z } from 'zod'

const BlockSchema = z.object({
  phone:  z.string().min(6),
  reason: z.string().optional(),
})

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  return profile?.role === 'admin' ? user : null
}

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blocked_phones')
    .select('*')
    .order('blocked_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body   = await req.json()
  const parsed = BlockSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const service = createServiceClient()
  const { data, error } = await service
    .from('blocked_phones')
    .insert({ ...parsed.data, blocked_by: admin.id })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'This phone is already blocked.' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const service = createServiceClient()
  const { error } = await service.from('blocked_phones').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
