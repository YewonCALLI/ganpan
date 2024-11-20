"use client";

import dynamic from 'next/dynamic';

import React from 'react';
import { useRouter } from 'next/navigation';
import '../app/app.css';
import Image from 'next/image';
import hall_icon from '@/cd_icon.png';

function Hall(){
    const navigate = useRouter();
    return (
        <div className="header3" onClick={() => {navigate.push('/page3');}} style={ {zIndex: 1000, position: 'absolute'} }>
            <Image
                src={hall_icon}
                alt="bell icon"
                quality={75}
            />
            <div style={{fontWeight:'800', fontSize:'2em', color: '#292929', fontFamily:'dongle'}}> 
                광장으로
            </div>
        </div>
        
    );
}

export default Hall;