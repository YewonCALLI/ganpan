import React, { useRef, useState, useEffect } from 'react';
import heic2any from 'heic2any';
interface GanpanImageProps {
    images: ImageData[];
    averageWidth: number;
}
const GanpanImage = ({ images, averageWidth }: GanpanImageProps) => {
    const containerRef = useRef<(HTMLDivElement | null)[]>([]);
    const [tmpParentImage, setTmpParentImage] = useState<string>();
    const [parentImage, setParentImage] = useState<string>();
    const [selectedImageId, setSelectedImageId] = useState<number | null>(null);


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

    const fetchParentImages = async (userInput: number) => {
        try {
            const response = await fetch(`/api/get-parent-image-urls?input=${userInput}`, { method: 'GET' })
            const data = await response.json()
            setTmpParentImage(data.parent_image_gallery[0].public_url)
        } catch (error) {
            setTmpParentImage('')
        }
    }
    const handleParentClick = async (id: number) => {
        setSelectedImageId(id);
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


    const calculateWidth = () => {
        const caculatedWidth = averageWidth * 300;
        return Math.min(caculatedWidth, 652);
    }
    const width = calculateWidth();

    return (
        <div className='flex items-start'>
            <div style={{
                width: '652px',
                height: '500px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }} ref={containerRef}><div style={{
                width: `${width}px`,
                maxWidth: '652px',
            }}>
                    {groupImagesByRow(images).map((row, rowIndex) => (
                        <div
                            key={rowIndex}
                            className='flex'
                            style={{
                                width: '100%',
                                marginBottom: '1px' // 줄 간격
                            }}
                        >
                            {row.map((image, imageIndex) => (
                                <div
                                    key={imageIndex}
                                    className="h-80 relative overflow-hidden flex items-center justify-center group cursor-pointer"
                                    style={{
                                        width: `${100 / row.length}%`,
                                        flexGrow: 1,
                                        border: selectedImageId === image.fk_parent_id ? '10px solid #00D5FF' : 'none',
                                        transition: 'border 0.3s ease'
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
            </div>
            <div className="w-[652px] h-[500px] flex items-center justify-center">
                {parentImage && (
                    <img
                        className='max-w-full max-h-full object-contain border-[10px] border-[#00D5FF]'
                        src={parentImage}
                        alt="부모이미지"
                    />
                )}
            </div>
        </div>
    );
};

export default GanpanImage;