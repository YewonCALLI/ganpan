import type { NextApiRequest, NextApiResponse } from 'next'
import getImageUrl from '@/utils/supabase/storage';
import supabase from '@/utils/supabase/supabaseClient'

async function getSearchedImageUrls(input:string) {
  const results:any = [];
  
  try {
    const { data: image_gallery, error } = await supabase
    .from('image_gallery')
    .select('*')
    .eq('character', input)

          
    if (error) throw error
    for (const file of image_gallery) {
        if (error) throw error
        results.push(file)
    }
    return { success: true, message: 'All image URLS donw', results }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, message: 'An error occurred while getting image URLs.', error: String(error) }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const {input} = req.query
     if (typeof input !== 'string') {
      return res.status(400).json({ success: false, message: 'Input must be a string' })
    }
    const result = await getSearchedImageUrls(input)
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