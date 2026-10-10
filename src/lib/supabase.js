import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://exfmtincbnxevltejgnj.supabase.co'
const supabaseKey = 'sb_publishable_yzvTZmVidedVmHzcq2JoXg_otSeFoxF'

export const supabase = createClient(supabaseUrl, supabaseKey)
