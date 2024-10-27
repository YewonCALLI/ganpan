// 최상단에 추가합니다.
"use client";

import React from 'react';
import '../../app/app.css';
import Image from 'next/image';
import image1 from '@/background.png';
import storeImage from '@/sample.png';
import originImage from '@/sample2.png';
import storebutton from '@/Group 13.png';
import sendbutton from '@/Group 14.png';
import Header from '@/components/Header';
import html2canvas from 'html2canvas';


function Page2() {
  return (
    <>
      <Header />
      <div className="page2">
        <Image
          src={image1}
          alt="background"
          quality={75}
          style={{ position:'absolute', width: '100%', height: '100%' }}
        />
        <div className='container'>
          <div className="title">
            <p>글자를 클릭하여 출처를 확인해 보세요.</p>
          </div>
          <div className="result">
            <div id="generated-image" style={{width:'fit-content'}}>
              <Image
                src={storeImage}
                alt="store"
                quality={75}
              />
            </div>
            <Image
              src={originImage}
              alt="origin"
              quality={75}
            />
          </div>
          <div className="page2-buttons">
            <img
              src={storebutton.src}
              alt="store"
              style={{ cursor: 'pointer' }}
            />
            <img
              src={sendbutton.src}
              alt="send"
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Page2;
