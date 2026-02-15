import { createClient } from '@supabase/supabase-js';

// URL verified from your dashboard image_aaf9de.jpg
const supabaseUrl = 'https://nfhkgqpafnbyzdcirkym.supabase.co';

// USE THE "ANON KEY (LEGACY)" FROM image_ab6de4.png
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5maGtxb3BhZm5ieXpkY2l5cmttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwOTk0ODIsImV4cCI6MjA4NjY3NTQ4Mn0.1Y-5scvSmK8Cl85SjikJhB5h4aiYiVTDm2DLH_W8Jw0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
