import { supabase } from "./supabaseClient";

export const createFile = async (
  name: string,
  passwordHash: string,
  content: string
) => {
  const { data, error } = await supabase
    .from("files")
    .insert([{ name, password: passwordHash, content }])
    .select()
    .single();

  if (error) {
    throw new Error(`Could not create file: ${error.message}`);
  }

  return data;
};

export const getFileById = async (id: string) => {
  const { data, error } = await supabase
    .from("files")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Could not get file: ${error.message}`);
  }

  return data;
};

export const authenticateFile = async (name: string, password: string) => {
  const { data, error } = await supabase
    .from("files")
    .select("*")
    .eq("name", name);

  if (error) {
    throw new Error(`Could not authenticate file: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error("File not found");
  }

  const file = data[0];

  const { data: authData, error: authError } = await supabase.auth.verifyPassword(
    password,
    file.password
  );

  if (authError) {
    throw new Error("Incorrect password");
  }

  return file;
};

export const updateFileContent = async (id: string, content: string) => {
  const { data, error } = await supabase
    .from("files")
    .update({ content })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Could not update file content: ${error.message}`);
  }

  return data;
};

export const uploadImage = async (fileId: string, image: string) => {
  const { data, error } = await supabase
    .from("file_images")
    .insert([{ file_id: fileId, image_data: image }])
    .select()
    .single();

  if (error) {
    throw new Error(`Could not upload image: ${error.message}`);
  }

  return data;
};

export const getImagesByFileId = async (fileId: string) => {
  const { data, error } = await supabase
    .from("file_images")
    .select("*")
    .eq("file_id", fileId);

  if (error) {
    throw new Error(`Could not get images: ${error.message}`);
  }

  return data;
};

// Export the types required by FileContent.tsx
export interface FileData {
  id: string;
  name: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface FileImage {
  id: string;
  file_id: string;
  image_data: string;
  created_at: string;
}

export interface FileContentType {
  text: string;
  images: string[];
}
