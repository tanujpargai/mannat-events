import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('wedding_functions')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[GET /api/wedding-functions]', error)
    return NextResponse.json({ error: 'Failed to fetch functions' }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}
