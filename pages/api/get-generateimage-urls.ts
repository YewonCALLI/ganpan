import type { NextApiRequest, NextApiResponse } from 'next'
import getImageUrl from '@/utils/supabase/storage';
import supabase from '@/utils/supabase/supabaseClient'

export const fetchImageUrls = async (): Promise<string[]> => {
    const { data, error } = await supabase
      .from('generated_image')
      .select('public_url'); 
  
    if (error) {
      console.error('Error fetching image URLs:', error);
      return [];
    }
  
    if (data) {
      return data.map((item) => item.public_url);
    }
  
    return [];
  };