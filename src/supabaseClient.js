import { createClient } from '@supabase/supabase-js';

// Double-check these match your 'Project Settings > API' screen exactly
const supabaseUrl = 'https://nfhkgqpafnbyzdcirkym.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5maGtxb3BhZm5ieXpkY2l5cmttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwOTk0ODIsImV4cCI6MjA4NjY3NTQ4Mn0.1Y-5scvSmK8Cl85SjikJhB5h4aiYiVTDm2DLH_W8Jw0'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
