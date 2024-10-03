"use client";

import dynamic from 'next/dynamic';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../app/app.css';
import Image from 'next/image';
import image1 from '@/background1.png';
import pencil from '@/Group 6.svg';
import completeicon from '@/Group 5 1.svg';


function page1() {
  const navigate = useNavigate();

  const handleImageClick = () => {
    navigate('/page2');
  };

  return (
    <div className="page1">
      <div className="pencil">
        {/* 연필 이미지 아이콘 추가 */}
        {[...Array(1)].map((_, index) => (
          <Image 
          key={index} 
          src={pencil} 
          alt="pencil icon" 
          quality={75}
          />
        ))}
      </div>
      <div className='pencil2'>
      {[...Array(1)].map((_, index) => (
          <Image 
          key={index} 
          src={pencil} 
          alt="pencil icon" 
          quality={75}
          style={{top: '500px'}}
          />
        ))}
      </div>
      <div className='complete_icon'>
        <Image 
        src={completeicon} 
        alt="pencil icon" 
        quality={75} 
        onClick={handleImageClick}
        />
      </div>
      <div className='text-type1' style={{fontWeight:'300', color: '#292929'}}>
        <p>
          최대 15자까지 가능해요.
        </p>
      </div>
      <Image
        src={image1}
        alt="cat"
        quality={75}
        style={{width: '100%', height: '100%'}}
      />
    </div>
  );
}

export default page1;
