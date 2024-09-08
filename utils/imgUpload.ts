import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/lib/database.types"; // Supabase 타입 정의
import fs from 'fs/promises';
import path from 'path';

export async function uploadImageToSupabase(imagePath: string) {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  try {
    // 파일 읽기
    const fileBuffer = await fs.readFile(imagePath);
    const fileName = path.basename(imagePath);

    // Supabase Storage에 업로드
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('images')
      .upload(`gallery/${fileName}`, fileBuffer, {
        contentType: 'image/png', // 파일 타입에 맞게 수정
      });

    if (uploadError) throw uploadError;

    // 업로드된 이미지의 공개 URL 가져오기
    const { data: { publicUrl } } = supabase
      .storage
      .from('images')
      .getPublicUrl(`gallery/${fileName}`);

    // 데이터베이스에 이미지 정보 저장
    const { data: insertData, error: insertError } = await supabase
      .from('image_gallery')
      .insert({
        file_name: fileName,
        file_path: uploadData.path,
        public_url: publicUrl,
      })
      .select();

    if (insertError) throw insertError;

    return { success: true, data: insertData };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { success: false, error };
  }
}

// 사용 예시
export async function uploadAllImagesInFolder(folderPath: string) {
  const files = await fs.readdir(folderPath);
  
  for (const file of files) {
    if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
      const fullPath = path.join(folderPath, file);
      const result = await uploadImageToSupabase(fullPath);
      console.log(`Uploaded ${file}:`, result);
    }
  }
}