import { createClient } from '@/utils/supabase/server';
import ImageUploadButton from '../../components/uploadButton';
import ImageGallery from '../../components/ImageGallery';

export default async function Main() {


    return (<>
        {/* <ImageUploadButton /> */}
        <ImageGallery />
    </>)
}