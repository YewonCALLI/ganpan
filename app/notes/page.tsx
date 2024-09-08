import { createClient } from '@/utils/supabase/server';
import ImageUploadPage from './uploadButton';
import ImageGallery from './ImageGallery';

export default async function Notes() {


    return (<>
        <ImageUploadPage />
        <ImageGallery />
    </>)
}