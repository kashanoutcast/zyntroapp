import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

export const uploadFile = async (file: File) => {
  const { data, error } = await supabase.storage
    .from("chat-files")
    .upload(file.name, file);

  if (error) throw error;
  const { data: url } = supabase.storage
    .from("chat-files")
    .getPublicUrl(data.path);

  return url.publicUrl;
};

export const removeFiles = async (files: string[]) => {
  const { data, error } = await supabase.storage
    .from("chat-files")
    .remove(files);

  if (error) throw error;

  return data;
};
