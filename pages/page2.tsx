"use client";

import dynamic from 'next/dynamic';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../app/app.css';
import Image from 'next/image';
import image1 from '@/background.png';
import storeImage from '@/sample.png';
import originImage from '@/sample2.png';
import storebutton from '@/store_icon.png';
import sendbutton from '@/send_icon.png';


function page2() {
  return (
    <div className="page2">
      <Image
        src={image1}
        alt="cat"
        quality={75}
        style={{width: '100%', height: '100%'}}
      />

      <div className='result'>
        <Image
        src={storeImage}
        alt="store"
        quality={75}
        style={{width: '100%', height: '100%'}}
        />
        <Image
        src={originImage}
        alt="origin"
        quality={75}
        style={{width: '100%', height: '100%'}}
        />
      </div>
      <div className='page2-buttons'>
        <Image
        src={storebutton}
        alt="store"
        quality={75}
        />
        <Image
        src={sendbutton}
        alt="send"
        quality={75}
        />

      </div>

    </div>
  );
}

export default page2;
