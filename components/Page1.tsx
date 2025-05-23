'use client';
import dynamic from 'next/dynamic';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../app/app.css';
import Image from 'next/image';
import image1 from '@/background.png';
import pencil from '@/Group 6.svg';
import Header from '@/components/Header';
import Hall from '@/components/hallicon';
import localFont from 'next/font/local';
import completeicon from '@/Group 12.png';
import reloadicon from '@/reload.png';
import Input from '@/components/Input';

import SampleImage from '@/sample2.png';
import GanpanImage from '@/components/GanpanImage';

interface InputRef {
    handleReset: () => void;
}
interface ImageData {
    fk_parent_id?: number;
    public_url: string;
    file_name: string;
}
function Page1() {
    const [result, setResult] = useState([]);
    const [ganpanResult, setGanpanResult] = useState<(ImageData | { file_name: string; })[]>([]);
    const [enterPositions, setEnterPositions] = useState<number[]>([])
    const [averageWidth, setAverageWidth] = useState<number>(0);
    const [hanguelInput, setHanguelInput] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('아자아자 화이팅!');
    const [processedInputs, setProcessedInputs] = useState<string[]>([]);  // 저장할 processedInputs 추가
    const [isGenerating, setIsGenerating] = useState(false);
    const [aromanize, setAromanize] = useState<any>(null); // Aromanize를 상태로 관리

    const router = useRouter();
    const inputRef = useRef<InputRef>(null);

    // Aromanize 로드
    useEffect(() => {
        const loadAromanize = async () => {
            try {
                // @ts-ignore - aromanize 타입 정의가 없음
                const module = await import('aromanize');
                setAromanize(module.default || module);
            } catch (error) {
                console.error('Failed to load Aromanize:', error);
            }
        };
        loadAromanize();
    }, []);

    const handleAverageWidth = (average: number) => {
        setAverageWidth(average);
    };

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

    const handleInputText = (input: string) => {
        // Aromanize가 로드되지 않았으면 빈 배열 반환
        if (!aromanize) {
            console.warn('Aromanize not loaded yet');
            return [];
        }

        const words = input.split(' ');
        let processedList: string[] = [];
        let hanguelList: string[] = [];
        let newEnterPositions: number[] = [];
        let currentPosition = 0;
        let wordLengths: number[] = [];
        // ?63
        // : 58
        //   126 ~
        // . 46
        //   " 34
        //   !33
        words.forEach((word, wordIndex) => {
            if (word.length > 0) {
                wordLengths.push(word.length);

                word.split('').forEach((char) => {
                    if (/[a-zA-Z]/.test(char)) {
                        processedList.push(char.toUpperCase());
                        hanguelList.push(char);
                    } else if (char === "닭") {
                        processedList.push("dalg");
                        hanguelList.push('닭');
                    } else if (char === "찮") {
                        processedList.push("chanh");
                        hanguelList.push('찮');
                    } else if (char === "의") {
                        processedList.push("ui");
                        hanguelList.push('의');
                    } else if (char === "?") {
                        processedList.push("63");
                        hanguelList.push('?');
                    } else if (char === "!") {
                        processedList.push("33");
                        hanguelList.push('!');
                    } else if (char === ":") {
                        processedList.push("58");
                        hanguelList.push(':');
                    } else if (char === ".") {
                        processedList.push("46");
                        hanguelList.push('.');
                    } else if (char === "~") {
                        processedList.push("126");
                        hanguelList.push('~');
                    } else if (char === '"') {
                        processedList.push("34");
                        hanguelList.push('"');
                    } else {
                        try {
                            processedList.push(aromanize.romanize(char));
                        } catch (error) {
                            console.error('Romanize error:', error);
                            processedList.push(char); // 에러 시 원본 문자 사용
                        }
                        hanguelList.push(char);
                    }
                });

                if (wordIndex < words.length - 1 && words[wordIndex + 1].length > 0) {
                    newEnterPositions.push(processedList.length);
                }
            }
        });

        const newAverage = wordLengths.length > 0
            ? wordLengths.reduce((sum, length) => sum + length, 0) / wordLengths.length
            : 0;


        // 상태 업데이트
        setAverageWidth(newAverage);
        setEnterPositions(newEnterPositions);
        setProcessedInputs(processedList); // processedList 상태 저장
        setHanguelInput(hanguelList)
        return processedList;
    };

    const handleGenerateButton = async (e?: React.MouseEvent) => {
        if (!inputValue || !aromanize) return; // aromanize 체크 추가
        setIsGenerating(true);
        try {
            setGanpanResult([]); // 결과 초기화

            // 입력값 처리 후 processedInputs와 enterPositions 상태에 기반하여 이미지를 생성
            const processedInputs = handleInputText(inputValue);

            // 이미지 가져오기
            const allResults = await Promise.all(processedInputs.map(fetchSearchedImages));

            // undefined인 결과를 원래 입력값으로 대체
            const refinedResults = allResults.map((result, index) => {
                if (!result) {
                    return {
                        file_name: hanguelInput[index],
                        public_url: ''
                    };
                }
                return result;
            });
            // 공백 위치에 빈 ImageData 객체 삽입 (위치 조정)
            const positions = [...enterPositions].sort((a: any, b: any) => a - b); // 오름차순 정렬
            positions.forEach((position, index) => {
                refinedResults.splice(Number(position) + index, 0, {
                    file_name: '',
                    public_url: ''
                });
            });

            setGanpanResult(refinedResults);
        }
        catch (error) {
            console.error(error);

        } finally {
            setIsGenerating(false)
        }

    };

    const handleInputChange = (input: any) => {
        setInputValue(input);
    };

    // useEffect를 통해 상태 변경 후 처리할 작업
    useEffect(() => {
        if (!processedInputs || processedInputs.length === 0) return;
        
        setGanpanResult([]); // 결과 초기화

        // enterPositions와 averageWidth가 업데이트되었을 때만 이미지 결과를 생성
        if (enterPositions.length > 0 && Number(averageWidth) > 0) {
            const generateResults = async () => {

                // 이미지 가져오기
                const allResults = await Promise.all(processedInputs.map(fetchSearchedImages));
                // undefined인 결과를 원래 입력값으로 대체
                const refinedResults = allResults.map((result, index) => {
                    if (result === undefined) {
                        return {
                            file_name: hanguelInput[index],
                            public_url: ''
                        };
                    }
                    return result;
                });
                // 공백 위치에 빈 ImageData 객체 삽입 (위치 조정)
                const positions = [...enterPositions].sort((a: any, b: any) => a - b); // 오름차순 정렬
                positions.forEach((position, index) => {
                    refinedResults.splice(Number(position) + index, 0, {
                        file_name: '',
                        public_url: ''
                    });
                });

                setGanpanResult(refinedResults);
                setIsGenerating(false);
            };

            generateResults();
        }
    }, [enterPositions, averageWidth, processedInputs, hanguelInput]);  // processedInputs가 변경될 때만 실행
    
    // 초기 로드 시 aromanize가 준비되면 실행
    useEffect(() => {
        if (aromanize) {
            setIsGenerating(true);
            handleGenerateButton().finally(() => setIsGenerating(false));
        }
    }, [aromanize]); // aromanize가 로드되면 실행
    
    return (
        <>
            <Header />
            <Hall />
            <Image
                src={image1}
                alt="background"
                quality={75}
                style={{ position: 'absolute', width: '100%', height: '100%' }}
            />
            <div className="page1">
                <div className="title">
                    <p>문구를 입력하세요</p>
                </div>

                <div className="input-container">
                    <div className="Rectangle-21">
                        <div className="input-area">
                            <div className="top-container">
                                <div className="font1">
                                    <p>최대 15자까지 가능해요.</p>
                                </div>
                                <div className="font1-1" onClick={handleGenerateButton}>
                                    <button disabled={!aromanize}>생성 ▶️</button>
                                </div>
                                <div className="font1">
                                </div>
                                <div className="font1-1" onClick={handleGenerateButton}>
                                    <button disabled={!aromanize}>다른 간판 ♽️</button>
                                </div>
                            </div>
                            <div className="top-container">
                                <div className='additional-container'>
                                    <Input ref={inputRef} onInputChange={handleInputChange} />
                                    <div className='flex w-[90%] justify-start relative '>
                                        <div className='text-slate-500 mt-6 text-base'>
                                            1. 텍스트 입력   ⇒   2. <div className='border-2 border-[#00D5FF] inline'>생성 ▶️</div> 버튼 클릭   ⇒   3. <div className='border-2 border-[#00D5FF] inline'>완성했어요!</div> 클릭 <br />
                                            * 다른 디자인을 원하면 <div className='border-2 border-[#00D5FF] inline'>다른 간판 ♽️</div> 클릭
                                        </div>
                                    </div>
                                </div>
                                <div className='w-[50%] relative'>
                                    {isGenerating && (
                                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 rounded-full border-4 border-[#00D5FF] border-t-transparent animate-spin"></div>
                                                <p className="mt-4 text-[#00D5FF] font-medium">간판 생성중...</p>
                                            </div>
                                        </div>
                                    )}
                                    <GanpanImage images={ganpanResult} averageWidth={averageWidth} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="complete_icon">
                    <Image
                        src={completeicon}
                        alt="complete"
                        quality={75}
                        onClick={() => {
                            sessionStorage.setItem('ganpanResult', JSON.stringify(ganpanResult));
                            sessionStorage.setItem('averageWidth', JSON.stringify(averageWidth));
                            router.push('/page2');
                        }}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
            </div>
        </>
    )
};


export default Page1;