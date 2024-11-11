'use client';
import dynamic from 'next/dynamic';
var Aromanize = require("aromanize");
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../app/app.css';
import Image from 'next/image';
import image1 from '@/background.png';
import pencil from '@/Group 6.svg';
import Header from '@/components/Header';
import localFont from 'next/font/local';
import completeicon from '@/Group 12.png';
import reloadicon from '@/reload.png';
import Input from '@/components/Input';

import SampleImage from '@/sample2.png';
import GanpanImage from '@/components/GanpanImage';

function Page1() {
  const [result, setResult] = useState([]);
  const [ganpanResult, setGanpanResult] = useState<ImageData[] | []>([])
  const [enterPositions, setEnterPositions] = useState<Number[]>([])
  const [averageWidth, setAverageWidth] = useState<Number>(0);
  const [inputValue, setInputValue] = useState('');
  const [processedInputs, setProcessedInputs] = useState<string[]>([]);  // 저장할 processedInputs 추가

  const router = useRouter();
  const InputRef = useRef();

  const handleAverageWidth = (average: Number) => {
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
    console.log('Processing input:', input);

    const words = input.split(' ');
    let processedList: string[] = [];
    let newEnterPositions: number[] = [];
    let currentPosition = 0;
    let wordLengths: number[] = [];

    words.forEach((word, wordIndex) => {
      if (word.length > 0) {
        wordLengths.push(word.length);

        word.split('').forEach((char) => {
          if (/[a-zA-Z]/.test(char)) {
            processedList.push(char.toUpperCase());
          } else if (char === "닭") {
            processedList.push("dalg");
          } else {
            processedList.push(Aromanize.romanize(char));
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

    console.log('Processed list:', processedList);
    console.log('Enter positions:', newEnterPositions);
    console.log('Average width:', newAverage);

    // 상태 업데이트
    setAverageWidth(newAverage);
    setEnterPositions(newEnterPositions);
    setProcessedInputs(processedList); // processedList 상태 저장

    return processedList;
  };

  const handleGenerateButton = async (e: React.MouseEvent) => {
    if (!inputValue) return; // inputValue가 없으면 아무것도 하지 않음

    // 입력값 처리 후 processedInputs와 enterPositions 상태에 기반하여 이미지를 생성
    const processedInputs = handleInputText(inputValue);

    // 이미지 가져오기
    const allResults = await Promise.all(processedInputs.map(fetchSearchedImages));

    // 공백 위치에 빈 ImageData 객체 삽입 (위치 조정)
    const positions = [...enterPositions].sort((a: any, b: any) => a - b); // 오름차순 정렬
    positions.forEach((position, index) => {
      allResults.splice(Number(position) + index, 0, {
        file_name: '',
        public_url: ''
      });
    });

    setGanpanResult(allResults);
    console.log('Final ganpanResult:', allResults);
  };

  const handleInputChange = (input) => {
    setInputValue(input);
  };

  // useEffect를 통해 상태 변경 후 처리할 작업
  useEffect(() => {
    // enterPositions와 averageWidth가 업데이트되었을 때만 이미지 결과를 생성
    if (enterPositions.length > 0 && averageWidth > 0) {
      const generateResults = async () => {
        const allResults = await Promise.all(processedInputs.map(fetchSearchedImages));

        // 공백 위치에 빈 ImageData 객체 삽입 (위치 조정)
        const positions = [...enterPositions].sort((a: any, b: any) => a - b);
        positions.forEach((position, index) => {
          allResults.splice(Number(position) + index, 0, {
            file_name: '',
            public_url: ''
          });
        });

        setGanpanResult(allResults);
        console.log('Final ganpanResult from useEffect:', allResults);
      };

      generateResults();
    }
  }, [enterPositions, averageWidth, processedInputs]);  // processedInputs가 변경될 때만 실행

  return (
    <>
      <Header />
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
                  <button>생성 ▶️</button>
                </div>
                <div className="font1">
                </div>
                <div className="font1-1" onClick={handleGenerateButton}>
                  <button>다시 ♽️</button>
                </div>
              </div>
              <div className="top-container">
                <div className='additional-container'>
                  <Input ref={InputRef} onInputChange={handleInputChange} />
                </div>

                <GanpanImage images={ganpanResult} averageWidth={averageWidth} />
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
  );
}

export default Page1;
