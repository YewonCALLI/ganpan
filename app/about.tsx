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


function about() {
  const navigate = useNavigate();

  const handleImageClick = () => {
    navigate('/page2');
  };

  return (
    <div className="page1">
     언제 한 번 이야기를 나누며 ‘zine’과 ‘web’이라는 표현 수단을 ‘개인의 생각으로 가상적인, 혹은 물리적인 공간을 꾸미는 행위'라고 정의한 적이 있다. 이에 그치지 않고 우리는 위 2개의 표현 수단이 특정 메시지를 시각적으로 재현한다는 측면에서 ‘간판'이라는 표현 수단과 닮았다고 생각했다. 이로부터 출발해 위 3개의 표현 수단을 직접 잇는 프로젝트를 기획하게 되었다. 

특히나 간판이라는 주제는 우리에게 3가지 측면에서 매력적으로 다가왔다. 첫째, 간판은 특정 시간과 공간 속의 사회, 역사, 경제적 의미를 담고 있고, 우리는 그 시대를 간판으로 빗대어 볼 수 있다. 둘째, 그렇기에 간판은 단순히 그 가게를 대표하는 것을 넘어, 간판을 창조한 자의 심정과 메시지, 철학, 인생을 담는다. 셋째, 가게의 흥망성쇠에 따라 간판이 탄생하고 소멸하는 사이 우리는 다양한 방법으로 목소리를 내기도, 침묵하기도 한다.

NewZines(뉴진-)팀은 간판의 표현 수단 방식과 의미를 곱씹으며 이 시사점에 대한 애정을 쌓았고, 아래와 같이 실현하고자 한다.
    </div>
  );
}

export default about;
