import React, { useRef, useState, useEffect, forwardRef, useMemo, useCallback } from 'react';
import heic2any from 'heic2any';
import { Gothic_A1 } from 'next/font/google';
import { Loader2 } from "lucide-react";

const gothicA1 = Gothic_A1({
    weight: ['400', '700'],
    subsets: ['latin'],
    display: 'swap',
});

interface ImageData {
    fk_parent_id: number;
    public_url: string;
    file_name: string;
}
type RowItem = ImageData | string;

interface GanpanImageProps {
    images: (ImageData | { file_name: string })[];
    averageWidth: number;
}

const GanpanImage = forwardRef<HTMLDivElement, GanpanImageProps>((props, ref) => {

    const { images, averageWidth } = props;
    const [tmpParentImage, setTmpParentImage] = useState<string>();
    const [parentImage, setParentImage] = useState<string | null>();
    const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [colorMap, setColorMap] = useState<{ [key: number]: { bg: string, text: string } }>({});



    const BACKGROUND_COLORS = [
        '#E71D36', '#2EC4B6', '#FF9F1C', '#4464AD', '#FFD93D',
        '#6B5B95', '#2B50AA', '#FF6B6B', '#4ECDC4',
        '#FF8427', '#1A5F7A', '#D62828', '#034748', '#119DA4'
    ];

    const TEXT_COLORS = [
        '#FFFFFF', '#FFE66D', '#F7FFF7', '#FFE5E5', '#E6E6E6',
        '#FFF9DB', '#F4F9F9', '#F8F9FA', '#FFF3BF', '#EDF2FF',
        '#FFF0F6', '#F8F0FC'
    ];

    const groupImagesByRow = useMemo(() => {
        const rows: RowItem[][] = [];
        let currentRow: RowItem[] = [];

        images.forEach((image) => {
            if ('fk_parent_id' in image) {
                currentRow.push(image);
            } else if ('file_name' in image) {
                if (image.file_name !== "") {
                    currentRow.push(image.file_name);
                } else {
                    if (currentRow.length > 0) {
                        rows.push(currentRow);
                        currentRow = [];
                    }
                }
            }
        });

        if (currentRow.length > 0) {
            rows.push(currentRow);
        }
        return rows;
    }, [images]);

    const convertHEICToJPEG = useCallback(async (url: string): Promise<string | null> => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const jpegBlob = await heic2any({
                blob: blob,
                toType: 'image/jpeg',
                quality: 0.8
            });

            if (jpegBlob instanceof Blob) {
                return URL.createObjectURL(jpegBlob);
            } else if (Array.isArray(jpegBlob) && jpegBlob.length > 0) {
                return URL.createObjectURL(jpegBlob[0]);
            }
            return null;
        } catch (error) {
            console.error('Error converting HEIC to JPEG:', error);
            return null;
        }
    }, []);

    const fetchParentImages = useCallback(async (userInput: number) => {
        try {
            const response = await fetch(`/api/get-parent-image-urls?input=${userInput}`, { method: 'GET' });
            const data = await response.json();
            setTmpParentImage(data.parent_image_gallery[0].public_url);
        } catch (error) {
            setTmpParentImage('');
        }
    }, []);

    const handleParentClick = useCallback(async (id: number) => {
        setIsLoading(true);
        setSelectedImageId(id);
        await fetchParentImages(Number(id));
    }, [fetchParentImages]);

    useEffect(() => {
        let mounted = true;

        const convertImage = async () => {
            if (!tmpParentImage || !mounted) return;

            setIsLoading(true);
            if (tmpParentImage?.toLowerCase().endsWith('.heic')) {
                const newUrl = await convertHEICToJPEG(tmpParentImage);
                if (mounted) setParentImage(newUrl);
            } else {
                if (mounted) setParentImage(tmpParentImage);
            }
            if (mounted) setIsLoading(false);
        };

        convertImage();
        return () => { mounted = false; };
    }, [tmpParentImage, convertHEICToJPEG]);

    useEffect(() => {
        const newColorMap: { [key: number]: { bg: string, text: string } } = {};
        images.forEach((_, index) => {
            newColorMap[index] = {
                bg: BACKGROUND_COLORS[Math.floor(Math.random() * BACKGROUND_COLORS.length)],
                text: TEXT_COLORS[Math.floor(Math.random() * TEXT_COLORS.length)]
            };
        });
        setColorMap(newColorMap);
    }, [images.length]);

    const renderImage = useCallback((image: RowItem, imageIndex: number, rowLength: number) => {
        if (typeof image === 'string') {
            return (
                <div
                    key={imageIndex}
                    className="h-52 relative overflow-hidden flex items-center justify-center"
                    style={{
                        width: `${100 / rowLength}%`,
                        flexGrow: 1,
                        backgroundColor: colorMap[imageIndex]?.bg || BACKGROUND_COLORS[0]
                    }}
                >
                    <span
                        className="text-center p-4 font-bold"
                        style={{
                            color: colorMap[imageIndex]?.text || TEXT_COLORS[0],
                            fontSize: `${Math.min(150, (100 / rowLength) * 8)}px`,
                            lineHeight: '1',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {image}
                    </span>
                </div>
            );
        }

        return (
            <div
                key={imageIndex}
                className="h-52 relative overflow-hidden flex items-center justify-center group cursor-pointer"
                style={{
                    width: `${100 / rowLength}%`,
                    flexGrow: 1,
                    border: selectedImageId === image?.fk_parent_id ? '10px solid #00D5FF' : 'none',
                    transition: 'border 0.3s ease'
                }}
                onClick={() => handleParentClick(image.fk_parent_id)}
            >
                <img
                    src={image?.public_url}
                    alt={image?.file_name}
                    className="h-full w-full object-fit"
                    loading="lazy"
                />
            </div>
        );
    }, [colorMap, selectedImageId, handleParentClick]);

    return (
        <div className='flex gap-3'>
            <div className="flex items-center justify-center">
                <div ref={ref} style={{
                    width: `${averageWidth * 500}px`,
                    maxWidth: '652px',
                }}>
                    {groupImagesByRow.map((row, rowIndex) => (
                        <div
                            key={rowIndex}
                            className='flex'
                            style={{
                                width: '100%',
                                marginBottom: '1px',
                            }}
                        >
                            {row.map((image, imageIndex) => renderImage(image, imageIndex, row.length))}
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-[752px] h-[600px] flex items-center justify-center">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center">
                        <Loader2 className="w-12 h-12 animate-spin text-[#00D5FF]" />
                        <span className={`mt - 2 text - [#00D5FF] ${gothicA1.className} `}>
                            이미지를 불러오는 중...
                        </span>
                    </div>
                ) : parentImage ? (
                    <img
                        className='max-w-full max-h-full object-contain border-[10px] border-[#00D5FF]'
                        src={parentImage}
                        alt="부모이미지"
                        loading="lazy"
                    />
                ) : null}
            </div>
        </div >

    )
});

export default React.memo(GanpanImage);