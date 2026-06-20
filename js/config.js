// ─────────────────────────────────────────────
//  SISINENE HUB — Supabase Configuration
//  Replace the two values below with yours from:
//  https://supabase.com → Project Settings → API
// ─────────────────────────────────────────────

const SUPABASE_URL = 'https://zsfkvjycztnrfenrakas.supabase.co';         // e.g. https://xyzabc.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZmt2anljenRucmZlbnJha2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzOTk3NzcsImV4cCI6MjA5Njk3NTc3N30.LZboPj8lq9Ugy5GCl9JlK0m3xmgbhiS1vJephQzxvK4'; // long string starting with "eyJ..."

// WhatsApp number (include country code, no + or spaces)
// Nigeria example: 2348012345678
const WHATSAPP_NUMBER = '2348145666052';

// ─────────────────────────────────────────────
// DO NOT EDIT BELOW THIS LINE
// ─────────────────────────────────────────────
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
