"use client";
import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Grid } from 'lucide-react';

interface ImageData {
    file_name: string;
    public_url: string;
}

const ImageGallery: React.FC = () => {
    const [result, setResult] = useState<ImageData[]>([])
    const [inputValue, setInputValue] = useState('');

    const fetchParentImages = async () => {
        try {
            const response = await fetch('/api/get-parent-image-urls', { method: 'GET' })
            const data = await response.json()
            setResult(data.results || [])

        } catch (error) {
            setResult('An error occurred')
        }
    }

    const fetchImages = async () => {
        try {
            const response = await fetch('/api/get-image-urls', { method: 'GET' })
            const data = await response.json()
            setResult(data.results || [])

        } catch (error) {
            setResult([])
        }
    }


    const fetchSearchedImages = async (userInput: string) => {
        try {
            const response = await fetch(`/api/get-search-image?input=${encodeURIComponent(userInput)}`, { method: 'GET' })
            const data = await response.json()
            setResult(data.results || [])
        } catch (error) {
            console.log(error);

            setResult([])
        }
    }
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(e.target.value);
        },
        []);

    const handleComplete = useCallback(
        (e: React.KeyboardEvent | React.MouseEvent) => {
            if ('key' in e && e.key === 'Enter' || e.type === 'click') {
                fetchSearchedImages(inputValue)
            }
        },
        [inputValue]);

    // useEffect(() => { fetchSearchedImages(inputValue) }, [inputValue])

    return (
        <>
            <input type="text" onChange={handleChange} onKeyDown={handleComplete}
                value={inputValue} className="border-b" />
            {result?.length === 0 ? (
                <div>No result found</div>
            ) : (
                <div className="grid grid-cols-6">
                    {
                        result?.map((image, index) => (
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