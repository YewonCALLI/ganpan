"use client";
import React, { useEffect, useState, useCallback, useRef } from 'react';

import Image from 'next/image';
import { Grid, LogIn } from 'lucide-react';
import { log } from 'console';
import heic2any from 'heic2any';
import html2canvas from 'html2canvas';
var Aromanize = require("aromanize");

interface ImageData {
    file_name: string;
    public_url: string;
}

const ImageSearch: React.FC = () => {
    const [result, setResult] = useState<ImageData[] | []>([])
    const [tmpParentImage, setTmpParentImage] = useState<string>();
    const [parentImage, setParentImage] = useState<string>();
    const [inputValue, setInputValue] = useState('');
    const [enterPositions, setEnterPositions] = useState<Number[]>([])
    const [averageWidth, setAverageWidth] = useState<Number>(0);
    const containerRef = useRef<(HTMLDivElement | null)[]>([]);


    const fetchParentImages = async (userInput: number) => {
        try {
            const response = await fetch(`/api/get-parent-image-urls?input=${userInput}`, { method: 'GET' })
            const data = await response.json()
            setTmpParentImage(data.parent_image_gallery[0].public_url)
        } catch (error) {
            setTmpParentImage('')
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
            const response = await fetch(`/api/get-search-image?input=${encodeURIComponent(userInput)}`, { method: 'GET' });
            const data = await response.json();
            const randomIndex = Math.floor(Math.random() * data.results.length);
            return data.results[randomIndex];
        } catch (error) {
            console.log(error);
            return [];
        }
    };


    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(e.target.value);
        },
        []);

    const handleInputText = (
        (newInput: string) => {

            let processedList: string[] = [];
            let newEnterPositions: number[] = [];
            let currentWordLength = 0;
            let wordLengths: number[] = [];

            newInput.split("").forEach((input, index) => {
                if (input === ' ') {
                    newEnterPositions.push(index);
                    // 현재 단어의 길이를 배열에 저장
                    wordLengths.push(currentWordLength);
                    // 단어 길이 리셋
                    currentWordLength = 0;
                } else {
                    currentWordLength++;

                    if (/[a-zA-Z]/.test(input)) {
                        processedList.push(input.toUpperCase());
                    } else if (input === "닭") {
                        processedList.push("dalg");
                    } else {
                        processedList.push(Aromanize.romanize(input));
                    }
                }
                // 마지막 단어의 길이도 추가
                if (currentWordLength > 0) {
                    wordLengths.push(currentWordLength);
                }
            });


            // 모든 단어 길이의 평균 계산
            const newAverage = wordLengths.length > 0
                ? wordLengths.reduce((sum, length) => sum + length, 0) / wordLengths.length
                : 0;

            setAverageWidth(newAverage);
            setEnterPositions(prevPositions => [...prevPositions, ...newEnterPositions]);

            return processedList;
        }
    );



    const handleComplete = async (e: React.KeyboardEvent | React.MouseEvent) => {
        if ('key' in e && e.key === 'Enter' || e.type === 'click') {
            const processedInputs = handleInputText(inputValue);
            const allResults = await Promise.all(processedInputs.map(fetchSearchedImages));
            // 각 위치에 빈 ImageData 객체 삽입
            enterPositions.forEach(position => {
                allResults.splice(Number(position), 0, {
                    file_name: '',
                    public_url: ''
                });
            });
            await setResult(allResults)
        }
    };


    // 클릭 시 original photo를 렌더링하는 부분
    useEffect(() => {
        if (tmpParentImage?.toLowerCase().endsWith('.heic')) {
            convertHEICToJPEG(tmpParentImage).then(newUrl => {
                setParentImage(newUrl);
            });
        }
        else {
            setParentImage(tmpParentImage);
        }
    }, [tmpParentImage])

    const handleParentClick = async (id: number) => {
        await fetchParentImages(Number(id));
    }

    async function convertHEICToJPEG(url: string) {
        try {
            // HEIC 파일을 fetch
            const response = await fetch(url);
            const blob = await response.blob();

            // HEIC를 JPEG로 변환
            const jpegBlob = await heic2any({
                blob: blob,
                toType: 'image/jpeg',
                quality: 0.8
            });

            // 변환된 이미지의 URL 생성
            return URL.createObjectURL(jpegBlob);
        } catch (error) {
            console.error('Error converting HEIC to JPEG:', error);
            return null;
        }
    }

    const groupImagesByRow = (images: ImageData[]) => {
        const rows: ImageData[][] = [];
        let currentRow: ImageData[] = [];

        images.forEach((image) => {
            if (image?.public_url) {
                currentRow.push(image);
            } else {
                if (currentRow.length > 0) {
                    rows.push(currentRow);
                    currentRow = [];
                }
            }
        });

        if (currentRow.length > 0) {
            rows.push(currentRow);
        }

        return rows;
    };

    const saveAllRowsAsOneImage = async () => {
        try {
            const container = containerRef.current;
            if (!container) return;

            // DOM을 canvas로 변환
            const canvas = await html2canvas(container, {
                useCORS: true,
                scale: 2,
                logging: false,
                allowTaint: true,
            });
            // Canvas를 blob으로 직접 변환
            canvas.toBlob(async (blob) => {
                if (!blob) return;

                const formData = new FormData();
                formData.append('file', blob, `capture-${Date.now()}.png`);

                const response = await fetch('/api/upload-generated-image', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                console.log('Upload result:', result);
            }, 'image/png', 1.0);
        } catch (error) {
            console.error('Error saving image:', error);
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
            <div className='flex flex-col'>
                <div style={{
                    width: `${averageWidth * 300}px`
                }} ref={containerRef}>
                    {groupImagesByRow(result).map((row, rowIndex) => (
                        <div
                            key={rowIndex}
                            className='flex'
                            style={{
                                width: `${averageWidth * 300}px`,
                                marginBottom: '1px' // 줄 간격
                            }}
                        >
                            {row.map((image, imageIndex) => (
                                <div
                                    key={imageIndex}
                                    className="h-80 relative overflow-hidden flex items-center justify-center group "
                                    style={{
                                        width: `${100 / row.length}%`, // 각 이미지가 동일한 너비를 가지도록
                                        flexGrow: 1
                                    }}
                                    onClick={() => handleParentClick(image.fk_parent_id)}
                                >
                                    <img
                                        src={image.public_url}
                                        alt={image.file_name}
                                        className="h-full w-full object-fit"
                                    />
                                </div>
                            ))}
                        </div>
                    ))}</div>
            </div>   <button
                onClick={() => saveAllRowsAsOneImage()}
                className="absolute right-0 top-0 bg-blue-500 text-white px-2 py-1 rounded"
            >
                Save as Image
            </button>
        </div >
    );
};
export default ImageSearch;