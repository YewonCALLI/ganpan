"use client";

import dynamic from 'next/dynamic';

import React from 'react';
import { useRouter } from 'next/navigation';
import '../app/app.css';
import Image from 'next/image';
import bell_icon from '@/bell_icon.png';

function BackIcon() {
    const navigate = useRouter();
    return (
        <div className="header2" onClick={() => { navigate.push('/'); }} style={{ zIndex: 1000 }}>
            <div style={{ fontWeight: '800', fontSize: '2em', color: '#292929', fontFamily: 'dongle' }}>
                ⏎ 되돌아가기
            </div>
        </div>
    );
}

export default BackIcon;