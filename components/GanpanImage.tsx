import React, { useRef, useState, useEffect, forwardRef } from 'react';
import heic2any from 'heic2any';
import { Gothic_A1, Dongle } from 'next/font/google'
import { Loader2 } from "lucide-react"; // lucide-react의 로딩 아이콘 사용
import localFont from 'next/font/local'
import { image } from 'html2canvas/dist/types/css/types/image';

const gothicA1 = Gothic_A1({
    weight: ['400', '700'], // 필요한 weight 추가
    subsets: ['latin'],
    display: 'swap',
});


// 컴포넌트 파일 상단에 추가
const headlineFont = localFont({
    src: [
        {
            path: "../public/fonts/HeadlineAM.ttf",
            weight: '400',
            style: 'normal',
        },
    ],
})

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
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
    const [colorMap, setColorMap] = useState<{ [key: number]: { bg: string, text: string } }>({});

    const groupImagesByRow = (images: (ImageData | { file_name: string })[]): RowItem[][] => {

        const rows: RowItem[][] = [];
        let currentRow: RowItem[] = [];

        images.forEach((image) => {
            if ('fk_parent_id' in image) {
                currentRow.push(image);
            } else if ('file_name' in image) {
                // file_name만 있는 경우
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
    };

    //================== 클릭 시 부모 사진이 뜬다. ========================
    // 클릭 시 original photo를 렌더링하는 부분
    useEffect(() => {
        const convertImage = async () => {
            if (!tmpParentImage) return;

            setIsLoading(true); // HEIC 변환 시작할 때도 로딩 표시
            if (tmpParentImage?.toLowerCase().endsWith('.heic')) {
                const newUrl = await convertHEICToJPEG(tmpParentImage);
                setParentImage(newUrl);
            } else {
                setParentImage(tmpParentImage);
            }
            setIsLoading(false); // 변환 완료 후 로딩 해제
        };

        convertImage();
    }, [tmpParentImage])

    const fetchParentImages = async (userInput: number) => {
        try {
            const response = await fetch(`/api/get-parent-image-urls?input=${userInput}`, { method: 'GET' })
            const data = await response.json()
            setTmpParentImage(data.parent_image_gallery[0].public_url)
        } catch (error) {
            setTmpParentImage('')
        }
        finally {
            // setIsLoading(false)
        }
    }

    const handleParentClick = async (id: number) => {
        setIsLoading(true); // HEIC 변환 시작할 때도 로딩 표시
        setSelectedImageId(id);
        await fetchParentImages(Number(id));
        // setIsLoading(false)
    }

    async function convertHEICToJPEG(url: string): Promise<string | null> {
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
    }

    // 컴포넌트 외부에 색상 배열 정의
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

    useEffect(() => {
        const newColorMap: { [key: number]: { bg: string, text: string } } = {};

        images.forEach((_, index) => {
            newColorMap[index] = {
                bg: BACKGROUND_COLORS[Math.floor(Math.random() * BACKGROUND_COLORS.length)],
                text: TEXT_COLORS[Math.floor(Math.random() * TEXT_COLORS.length)]
            };
            setColorMap(newColorMap)
        })
    }, [images.length])

    return (
        <div className='flex gap-3'>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}> <div ref={ref}
                style={{
                    width: `${averageWidth * 500}px`,
                    maxWidth: '652px',
                }}>
                    {groupImagesByRow(images).map((row, rowIndex) => (
                        <div
                            key={rowIndex}
                            className='flex'
                            style={{
                                width: '100%',
                                marginBottom: '1px',// 줄 간격

                            }}
                        >
                            {row.map((image, imageIndex) => {
                                // image가 string인 경우 텍스트로 표시
                                if (typeof image === 'string') {

                                    // 컴포넌트 내부 렌더링 부분
                                    return (
                                        <div
                                            key={imageIndex}
                                            className="h-52 relative overflow-hidden flex items-center justify-center"
                                            style={{
                                                width: `${100 / row.length}%`,
                                                flexGrow: 1,
                                                backgroundColor: colorMap[imageIndex]?.bg || BACKGROUND_COLORS[0]
                                            }}
                                        >
                                            <span
                                                className={`text-center p-4 text-[200px] font-bold `}
                                                style={{
                                                    color: colorMap[imageIndex]?.text || TEXT_COLORS[0],
                                                    fontWeight: 'bold',
                                                    fontSize: `${Math.min(150, (100 / row.length) * 8)}px`, // 텍스트 크기 좀 더 작은 값으로 설정
                                                    lineHeight: '1', // line-height 값을 1로 유지
                                                    textOverflow: 'ellipsis', // 텍스트가 넘치지 않도록 처리
                                                    whiteSpace: 'nowrap', // 텍스트가 줄바꿈 없이 한 줄로 처리되도록 설정
                                                }}
                                            >
                                                {image}
                                            </span>
                                        </div>
                                    );
                                }
                                // 이미지인 경우 기존 렌더링
                                return (
                                    <div
                                        key={imageIndex}
                                        className="h-52 relative overflow-hidden flex items-center justify-center group cursor-pointer"
                                        style={{
                                            width: `${100 / row.length}%`,
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
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    ))}</div>
            </div>
            <div className="w-[752px] h-[600px] flex items-center justify-center">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center">
                        <Loader2 className="w-12 h-12 animate-spin text-[#00D5FF]" />
                        <span className={`mt-2 text-[#00D5FF] ${gothicA1.className}`}>
                            이미지를 불러오는 중...
                        </span>
                    </div>
                ) : parentImage ? (
                    <img
                        className='max-w-full max-h-full object-contain border-[10px] border-[#00D5FF]'
                        src={parentImage}
                        alt="부모이미지"
                    />
                ) : null}
            </div>
        </div >
    );
});


export default GanpanImage;