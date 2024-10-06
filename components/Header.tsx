"use client";

import dynamic from 'next/dynamic';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../app/app.css';
import Image from 'next/image';
import bell_icon from '@/bell_icon.png';

function header(){
    const navigate = useNavigate();

    const handleImageClick = () => {
        navigate('/about');
    };
    return (
        <div className="header" onClick={handleImageClick}>
            <Image
                src={bell_icon}
                alt="bell icon"
                quality={75}
            />
            <div style={{fontWeight:'800', fontSize:'1.3rem', color: '#292929'}}> 
                프로젝트 소개
            </div>
        </div>
    );
}

export default header;