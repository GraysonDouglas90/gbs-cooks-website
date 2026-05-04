import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eczrtjcrfzoqiykxxtah.supabase.co'
const supabaseKey = 'sb_publishable_o3wpq8aJZBs0US-zsteG3g_3_sex6Me'

export const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase
