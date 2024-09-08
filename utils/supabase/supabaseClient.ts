import { Database } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_PROJECT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const SUPABASE_STORAGE_BUCKET = process.env.NEXT_PUBLIC_STORAGE_BUCKET as string;
const supabase = createClient<Database>(SUPABASE_PROJECT_URL,SUPABASE_ANON_KEY);

export default supabase;
