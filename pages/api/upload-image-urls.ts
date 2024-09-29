import type { NextApiRequest, NextApiResponse } from 'next'
import getImageUrl from '@/utils/supabase/storage';
import supabase from '@/utils/supabase/supabaseClient'

async function uploadImageUrlsToTable() {
  const results = [];
  
  try {
    const { data: files, error } = await supabase
      .storage
      .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET as string)
      .list()
    console.log('storage',files);

    if (error) throw error
    for (const file of files) {
      
      if (file.name.match(/\.(jpg|jpeg|png|gif|HEIC|JPG)$/i)) {
        console.log(file);
        
        // Generate public URL for the file
        const { data } = supabase
          .storage
          .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET as string)
          .getPublicUrl(file.name)
        
        const publicUrl = data.publicUrl
        
        // Insert the public URL into the database
        const { data: insertData, error: insertError } = await supabase
          .from('image_gallery')
          .insert([
            { 
              file_name: file.name, 
              public_url: publicUrl,
            }
          ])
        
        if (error) throw error
        results.push(`Uploaded URL for ${file.name}`)
      }
    }

    return { success: true, message: 'All image URLs have been uploaded to the table.', results }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, message: 'An error occurred while uploading image URLs.', error: String(error) }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const result = await uploadImageUrlsToTable()
    if (result.success) {
      res.status(200).json(result)
    } else {
      res.status(500).json(result)
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}