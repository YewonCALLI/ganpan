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

  const router = useRouter();
  const InputRef = useRef();

  const handleAverageWidth = (average: Number) => {
    setAverageWidth(average)
  }
  const handleResetButton = () => {
    InputRef.current.handleReset();
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
  const handleGenerateButton = async (e: React.MouseEvent) => {
    const processedInputs = handleInputText(inputValue);
    const allResults = await Promise.all(processedInputs.map(fetchSearchedImages));
    // 각 위치에 빈 ImageData 객체 삽입
    enterPositions.forEach(position => {
      allResults.splice(Number(position), 0, {
        file_name: '',
        public_url: ''
      });
    });
    await setGanpanResult(allResults)
  };
  const handleInputChange = (input) => {
    setInputValue(input);
  }
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
                <div className="font1-1" onClick={handleResetButton}>
                  <button>다시 ♽️</button>
                </div>
              </div>
              <div className="top-container">
                <div className='additional-container'>
                  <Input ref={InputRef} onInputChange={handleInputChange} />
                </div>

                <GanpanImage images={ganpanResult} averageWidth={averageWidth} />
                {/* <Input onGanpanImage={handleGanpanImage} onAverageWidth={handleAverageWidth} />
                <GanpanImage images={result} averageWidth={averageWidth} ></GanpanImage> */}
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
