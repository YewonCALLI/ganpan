// 서버 (pages/api/upload.ts)
import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm,Fields, Files, File } from 'formidable';
import supabase from '@/utils/supabase/supabaseClient';

export const config = {
    api: {
        bodyParser: false,
    },
};
interface FormidableFile extends File{
    filepath:string;
    orignalFilename:string;
    newFilename:string;
}
interface ParsedFiles{
    file:FormidableFile[];
}

const parseForm = (req: NextApiRequest): Promise<ParsedFiles> => {
    return new Promise((resolve, reject) => {
        const form = new IncomingForm();
        form.parse(req, (err, fields:Fields, files:Files) => {
            if (err) reject(err);
            resolve(files as unknown as ParsedFiles);
        });
    });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const files = await parseForm(req);
        const file = files.file[0];  // 첫 번째 파일 가져오기
        

         // 파일 데이터 읽기
        const fileData = await new Promise<Buffer>((resolve, reject) => {
            const chunks: Buffer[] = [];
            const stream = require('fs').createReadStream(file.filepath);

            stream.on('data', (chunk: Buffer) => chunks.push(chunk));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
            stream.on('error', reject);
        });

         // Supabase 업로드
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('generatedImageBox2')
            .upload(`${file.originalFilename}`, fileData, {
                contentType: 'image/png',
                upsert: false // 중복 파일 처리 방식 명시
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return res.status(500).json({ 
                success: false, 
                error: uploadError 
            });
        }

        // URL 가져오기
        const { data: urlData } = supabase.storage
            .from('generatedImageBox2')
            .getPublicUrl(`${file.originalFilename}`);

        if (!urlData || !urlData.publicUrl) {
            return res.status(500).json({ 
                success: false, 
                error: 'Failed to get public URL' 
            });
        }

        // DB에 URL 저장
        const { data: insertData, error: insertError } = await supabase
            .from('generated_image')
            .insert([{ 
                public_url: urlData.publicUrl,
            }]);

        if (insertError) {
            console.error('DB insert error:', insertError);
            return res.status(500).json({ 
                success: false, 
                error: insertError 
            });
        }

        return res.status(200).json({ 
            success: true, 
            url: urlData.publicUrl,
            fileName: file.newFilename
        });

    } catch (error) {
        console.error('Error in handler:', error);
        return res.status(500).json({ 
            success: false, 
            error: String(error) 
        });
    }
}