"use client";
import { useState } from 'react'

function ImageUploadPage() {
    const [isUploading, setIsUploading] = useState(false)
    const [result, setResult] = useState<string | null>(null)

    const handleUpload = async () => {
        setIsUploading(true)
        try {
            const response = await fetch('/api/upload-image-urls', { method: 'POST' })
            const data = await response.json()
            setResult(data.message)
        } catch (error) {
            setResult('An error occurred')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div>
            <button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Upload Image URLs'}
            </button>
            {result && <p>{result}</p>}
        </div>
    )
}


const page = () => {
    return (
        <div>
            <ImageUploadPage />
        </div>
    );
};

export default page;