import { createClient } from "@supabase/supabase-js";

const DB_URL = import.meta.env.VITE_DB_URL;
const PUBLIC_ANON = import.meta.env.VITE_PUBLIC_ANON;

export const supabaseClient = createClient(DB_URL, PUBLIC_ANON);
