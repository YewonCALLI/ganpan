import { createClient } from '@/utils/supabase/server';
import ImageUploadPage from './uploadButton';

import getImageUrl from '@/utils/supabase/storage';
export default async function Notes() {

    const supabase = createClient();
    const { data: notes } = await supabase.from("notes").select();

    return (<>
        <pre>{JSON.stringify(notes, null, 2)}</pre>
        <ImageUploadPage />
    </>)
}