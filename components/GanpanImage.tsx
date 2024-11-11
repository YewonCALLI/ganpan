import React, { useRef, useState } from 'react';
interface GanpanImageProps {
    images: ImageData[];
    averageWidth: number;
}
const GanpanImage = ({ images, averageWidth }: GanpanImageProps) => {
    const containerRef = useRef<(HTMLDivElement | null)[]>([]);
    const [tmpParentImage, setTmpParentImage] = useState<string>();

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
        await fetchParentImages(Number(id));
    }
    const calculateWidth = () => {
        const caculatedWidth = averageWidth * 300;
        return Math.min(caculatedWidth, 652);
    }
    const width = calculateWidth();
    return (
        <div className='flex flex-col'>
            <div style={{
                width: `${width}px`,
                maxWidth: '652px'
            }} ref={containerRef}>
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
        </div>
    );
};

export default GanpanImage;