import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('decoration_themes')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[GET /api/decoration-themes]', error)
    return NextResponse.json({ error: 'Failed to fetch themes' }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}
