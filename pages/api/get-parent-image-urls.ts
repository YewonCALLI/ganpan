import type { NextApiRequest, NextApiResponse } from 'next'
import getImageUrl from '@/utils/supabase/storage';
import supabase from '@/utils/supabase/supabaseClient'

async function getImageUrls(parentId : number) {
  try {
    const { data: parent_image_gallery, error } = await supabase
    .from('parent_image_gallery')
    .select('*')
    .filter('file_name', 'ilike', `${parentId}.%`)
    
    

          
    if (error) throw error
    return { success: true, message: 'All image URLS down', parent_image_gallery }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, message: 'An error occurred while getting image URLs.', error: String(error) }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const {input} = req.query
    // console.log(input, typeof(input));
    
    const result = await getImageUrls(Number(input));
    if (result.success) {
      res.status(200).json(result)
    } else {
      res.status(500).json(result)
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}