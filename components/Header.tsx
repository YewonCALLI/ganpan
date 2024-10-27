"use client";

import dynamic from 'next/dynamic';

import React from 'react';
import { useRouter } from 'next/navigation';
import '../app/app.css';
import Image from 'next/image';
import bell_icon from '@/bell_icon.png';

function Header(){
    const navigate = useRouter();
    return (
        <div className="header" onClick={() => {navigate.push('/about');}} style={ {zIndex: 1000, position: 'absolute'} }>
            <Image
                src={bell_icon}
                alt="bell icon"
                quality={75}
            />
            <div style={{fontWeight:'800', fontSize:'2em', color: '#292929', fontFamily:'dongle'}}> 
                프로젝트 소개
            </div>
        </div>
    );
}

export default Header;