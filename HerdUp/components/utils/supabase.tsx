import { createClient } from '@supabase/supabase-js';

const supabaseURL = 'https://oirksypyzasqxdhmmpue.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pcmtzeXB5emFzcXhkaG1tcHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0MDQ0MzUsImV4cCI6MjA1NDk4MDQzNX0._JKk-EbJ9PaHdJd7BzpttjSr4JHQtSjF9gcJQ8a2ehY';

export const supabase = createClient(supabaseURL, supabaseAnonKey);