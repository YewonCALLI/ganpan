'use client';
import React, { useState, useEffect } from 'react';

const Page = () => {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // 한 번에 여러 이미지를 가져오는 함수
    const fetchAllImages = async () => {
        try {
            const promises = Array(750).fill(null).map(() =>
                fetch('/api/get-image-urls', { method: 'GET' })
                    .then(res => res.json())
                    .then(data => {
                        const randomIndex = Math.floor(Math.random() * data.results.length);
                        return data.results[randomIndex];
                    })
            );

            const results = await Promise.all(promises);
            setImages(results);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트 마운트 시 이미지 가져오기
    useEffect(() => {
        fetchAllImages();
    }, []);

    // 셀 크기 계산
    const cellWidth = 175 / 25; // mm
    const cellHeight = 243 / 30; // mm

    if (loading) {
        return (
            <div className="flex items-center justify-center w-[175mm] h-[243mm]">
                <div className="w-8 h-8 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div
                className="grid gap-px bg-gray-200"
                style={{
                    gridTemplateColumns: 'repeat(25, 1fr)',
                    width: '175mm',
                    height: '243mm'
                }}
            >
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="relative bg-white"
                        style={{
                            width: `${cellWidth}mm`,
                            height: `${cellHeight}mm`,
                        }}
                    >
                        {image && (
                            <img
                                src={image.public_url}
                                alt={`Grid item ${index}`}
                                className="absolute inset-0 w-full h-full object-fill"
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Page;