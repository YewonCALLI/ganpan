'use client';
import dynamic from 'next/dynamic';

import React, { useState } from 'react';
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
  const [inputText, setInputText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const maxChars = 15; 

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (value.length <= maxChars) {
      setInputText(value);
      setErrorMessage('');
    } else {
      setErrorMessage(`최대 ${maxChars}자까지만 입력할 수 있습니다.`);
    }
  };

  const handleReset = () => {
    setInputText('');
    setResult([]);
    setErrorMessage('');
  };

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
                <div className="font1-1">
                  <button>생성 ▶️</button>
                </div>
                <div className="font1">
                </div>
                <div className="font1-1">
                  <button>다시 ♽️</button>
                </div>
              </div>
              <div className="top-container">
                <div className='additional-container'>
                <input
                  type="text"
                  value={inputText}
                  placeholder='여기에 입력하세요'
                  onChange={handleInputChange}
                />
                <div className="char-count">
                  {inputText.length}/{maxChars}자
                  {errorMessage && (
                    <div className="error-message">{errorMessage}</div>
                  )}
                </div>
                </div>
                <Image src={SampleImage}>
                  {/* 이곳에 결과 이미지 */}
                </Image>
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
