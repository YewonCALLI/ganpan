import React from 'react';
import mobileImg from '@/public/dontlook.png'
import Image from 'next/image';
const Mobile = () => {
    return (
        <div className='flex flex-col h-lvh justify-center items-center'>
            <Image src={mobileImg} width={500} alt='보지마' />
            간판 웹사이트는 모바일을 지원하지 않습니다. <br />
            스미마셍.
        </div>
    );
};

export default Mobile;