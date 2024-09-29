"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Grid } from 'lucide-react';

interface ImageData {
    file_name: string;
    public_url: string;
}

const ImageGallery: React.FC = () => {
    const [result, setResult] = useState<ImageData[]>([])

    const fetchImages = async () => {
        try {
            const response = await fetch('/api/get-image-urls', { method: 'GET' })
            const data = await response.json()
            setResult(data.results || [])

        } catch (error) {
            setResult('An error occurred')
        }
    }
    useEffect(() => {
        fetchImages()
    }, [])

    return (
        <>
            {result.length === 0 ? (
                <div>No result found</div>
            ) : (
                <div class="grid grid-cols-6">
                    {
                        result.map((image, index) => (
                            <img
                                src={image.public_url}
                                alt={image.file_name}
                            />
                        ))
                    }</div>
            )}
        </>
    );
};

export default ImageGallery;