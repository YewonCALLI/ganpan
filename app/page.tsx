"use client";

import dynamic from 'next/dynamic';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Notes from './main/page';
import './app.css';
import Page1 from '@/app/page1';
import Page2 from '@/app/page2';
import About from '@/app/about';
import localFont from 'next/font/local'
import Header from '@/components/Header';

const pretendard = localFont({
  src: '../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920'
})

const page = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    <div className={pretendard.className}>
                    <Page1 />
                    <Header />
                    </div>
                } />
                <Route path="/page2" element={
                    <div className={pretendard.className}>
                    <Page2 />
                    <Header />
                    </div>
                } />
                <Route path='/about' element={
                    <div className={pretendard.className}>
                    <About />
                    <Header />
                    </div>
                } />
            </Routes>
        </Router>
        
    );
};

export default page;

