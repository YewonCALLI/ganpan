
'use client';
import dynamic from 'next/dynamic'
import GapanImageList from '@/components/GapanImageList';
import Toggle from '@/components/Toggle';
import { useState } from 'react';

const ThreeJSScene = dynamic(() => import('../../components/ThreeJSScene'), {
  ssr: false // 서버사이드 렌더링 비활성화
});

export default function Page() {
  const [isOn, setIsOn] = useState(false);

  return (
    <>
      <Toggle
        leftLabel="3D 광장"
        rightLabel="2D 광장"
        isToggled={isOn}
        onToggle={setIsOn}
      />
      {
        isOn ? <GapanImageList /> : <ThreeJSScene />
      }
    </>);
}