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
import Input from '@/components/Input';
import GanpanImage from '@/components/GanpanImage';


function page1() {
  const [result, setResult] = useState<ImageData[] | []>([])
  const [averageWidth, setAverageWidth] = useState<Number>(0);

  const router = useRouter();
  const handleGanpanImage = (images: ImageData[] | []) => {
    setResult(images)
  }
  const handleAverageWidth = (average: Number) => {
    setAverageWidth(average)
  }

  return (
    <>
      <Header />
      <Image
        src={image1}
        alt="cat"
        quality={75}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      />
      <div className="page1">
        <div className='title'>
          <p>문구를 작성하세요</p>
        </div>
        <div className="input-container">
          <div className="pencil">
            {[...Array(1)].map((_, index) => (
              <Image
                key={index}
                src={pencil}
                alt="pencil icon"
                quality={75}
              />
            ))}
          </div>
          <Input onGanpanImage={handleGanpanImage} onAverageWidth={handleAverageWidth} />
          <GanpanImage images={result} averageWidth={averageWidth} />
          <div className='pencil2'>
            {[...Array(1)].map((_, index) => (
              <Image
                key={index}
                src={pencil}
                alt="pencil icon"
                quality={75}
                style={{ top: '500px' }}
              />
            ))}
          </div>
        </div>
        <div className='complete_icon'>
          <Image
            src={completeicon}
            alt="pencil icon"
            quality={75}
            onClick={() => {
              router.push('/page2');
            }}
            style={{ cursor: 'pointer' }}
          />
        </div>
        <div className='text-type1' style={{ fontWeight: '300', color: '#292929' }}>
          <p>
            최대 15자까지 가능해요.
          </p>
        </div>
      </div>
    </>
  );
}

export default page1;
