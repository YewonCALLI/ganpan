// 최상단에 추가합니다.
"use client";

import React, { useEffect, useState, useRef } from 'react';
import '../app/app.css';
import Image from 'next/image';
import image1 from '@/background.png';
import storeImage from '@/sample.png';
import originImage from '@/sample2.png';
import storebutton from '@/Group 13.png';
import sendbutton from '@/Group 14.png';
import Header from '@/components/Header';
import html2canvas from 'html2canvas';
import GanpanImage from '@/components/GanpanImage';

interface SaveResult {
    success: boolean;
    localSave?: boolean;
    serverUpload?: boolean;
    error?: string;
}
function Page2() {
    const [ganpanResult, setGanpanResult] = useState(null);
    const [averageWidth, setAverageWidth] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedResult = sessionStorage.getItem('ganpanResult');
        const storedWidth = sessionStorage.getItem('averageWidth');
        if (storedResult) {
            setGanpanResult(JSON.parse(storedResult));
        } if (storedWidth) {
            setAverageWidth(JSON.parse(storedWidth));
        }
    }, [])

    const saveAllRowsAsOneImage = async (type: number): Promise<SaveResult | void> => {
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

            // Canvas를 blob으로 변환하는 Promise를 생성
            const getBlobFromCanvas = (): Promise<Blob> => {
                return new Promise((resolve) => {
                    canvas.toBlob((blob) => {
                        if (blob) resolve(blob);
                    }, 'image/png', 1.0);
                });
            };

            const blob = await getBlobFromCanvas();

            if (type === 1) {
                // 1. 로컬 다운로드
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.download = `ganpan-image-${Date.now()}.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                URL.revokeObjectURL(downloadLink.href); // 메모리 정리
                return {
                    success: true,
                    localSave: true,
                };
            }
            else if (type === 2) {
                // 2. 서버 업로드
                const formData = new FormData();
                formData.append('file', blob, `capture-${Date.now()}.png`);

                const response = await fetch('/api/upload-generated-image', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                return {
                    success: true,
                    serverUpload: response.ok
                };
            }

        } catch (error) {
            console.error('Error saving image:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    };


    const handleSave = async (type: number) => {
        const result = await saveAllRowsAsOneImage(type);
        if (result?.success) {
            alert(type === 1 ? '이미지가 저장되었습니다.' : '이미지가 전송되었습니다.');
        } else {
            alert('오류가 발생했습니다.');
        }
    };


    return (
        <>
            <Header />
            <div className="page2">
                <Image
                    src={image1}
                    alt="background"
                    quality={75}
                    style={{ position: 'absolute', width: '100%', height: '100%' }}
                />
                <div className='container'>
                    <div className="title">
                        <p>글자를 클릭하여 출처를 확인해 보세요.</p>
                    </div>
                    <div className="result">
                        <div id="generated-image" className='h-[full] flex items-center'>
                            {ganpanResult && <GanpanImage images={ganpanResult} averageWidth={averageWidth} ref={containerRef} />}
                        </div>
                    </div>
                    <div className="page2-buttons">
                        <img
                            src={storebutton.src}
                            alt="store"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleSave(1)}
                        />
                        <img
                            src={sendbutton.src}
                            alt="send"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleSave(2)}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Page2;
