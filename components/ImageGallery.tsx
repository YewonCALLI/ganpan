"use client";
import React, { useEffect, useState, useCallback } from 'react';

import Image from 'next/image';
import { Grid } from 'lucide-react';
var Aromanize = require("aromanize");

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

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(e.target.value);
        },
        []);

    const handleInputText = (
        (newInput: string) => {
            let processedList: string[] = [];
            newInput.split("").forEach((input) => {
                // 영어인 경우 대문자로 처리
                if (/[a-zA-Z]/.test(input)) {
                    processedList.push(input.toUpperCase());
                }
                // 닭 -> dalg으로 처리
                else if (input === "닭") {
                    processedList.push("dalg");
                }
                else {
                    processedList.push(Aromanize.romanize(input));
                }
            })
            return processedList;
        });

    const fetchSearchedImages = async (userInput: string) => {
        try {
            const response = await fetch(`/api/get-search-image?input=${encodeURIComponent(userInput)}`, { method: 'GET' });
            const data = await response.json();
            const randomIndex = Math.floor(Math.random() * data.results.length);
            return data.results[randomIndex];
        } catch (error) {
            console.log(error);
            return [];
        }
    };


    const handleComplete = async (e: React.KeyboardEvent | React.MouseEvent) => {
        if ('key' in e && e.key === 'Enter' || e.type === 'click') {
            const processedInputs = handleInputText(inputValue);


            const allResults = await Promise.all(processedInputs.map(fetchSearchedImages));


            console.log(allResults);

            setResult(allResults);
        }
    };
    return (
        <div className="container mx-auto p-4">
            <div className="mb-4">
                <input
                    type="text"
                    onKeyDown={handleComplete}
                    onChange={handleChange}
                    value={inputValue}
                    className="border-b w-full p-2"
                    placeholder="검색어를 입력하세요"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {result.length === 0 ? (
                    <div className="col-span-full text-center">검색 결과가 없습니다.</div>
                ) : (
                    result.map((image, index) => (
                        image && (
                            <div key={index} className="aspect-square relative overflow-hidden">
                                <img
                                    src={image.public_url}
                                    alt={image.file_name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )
                    ))
                )}
            </div>
        </div>
    );
};

export default ImageGallery;