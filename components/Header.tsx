import React from 'react';
import '../app/app.css';
import Image from 'next/image';
import bell_icon from '@/bell_icon.png';

function header(){
    return (
        <div className="header">
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