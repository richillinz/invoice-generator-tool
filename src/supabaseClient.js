import { createClient } from '@supabase/supabase-js';

// Double-check these match your 'Project Settings > API' screen exactly
const supabaseUrl = 'https://nfhkgqpafnbyzdcirkym.supabase.co';
const supabaseAnonKey = 'sb_publishable_41Zwm6Ny62Wozg0YCAQgfQ_rAZUVTF2'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
