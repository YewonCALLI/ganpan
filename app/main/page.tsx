import { createClient } from '@/utils/supabase/server';
import ImageUploadButton from '../../components/uploadButton';
import ImageSearch from '@/components/ImageSearch';

export default async function Main() {


    return (<>
        {/* <ImageUploadButton /> */}
        <ImageSearch />
    </>)
}