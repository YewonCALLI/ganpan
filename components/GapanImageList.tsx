'use client';
import React, { useState, useEffect } from 'react';
import { fetchImageUrls } from '../pages/api/get-generateimage-urls'; // 이미지 URL 가져오기


const GapanImageList = () => {
    const [imageUrls, setImageUrls] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const urls = await fetchImageUrls();
            setImageUrls(urls);
        };
        fetchData();
    }, []);
    return (
        <div className='mt-10 w-full flex flex-col justify-center items-center'>
            {imageUrls.map(url =>
                <div className='w-[40%] p-10'>
                    <img src={url} alt="생성된 간판" />
                </div>
            )}
        </div>
    );
};

export default GapanImageList;