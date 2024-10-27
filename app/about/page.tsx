"use client";  

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import '../../app/app.css';
import BackIcon from '@/components/BackIcon';

function About() {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null); 

  useEffect(() => {

        if (rendererRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    rendererRef.current = renderer;

    if (canvasRef.current) {
      while (canvasRef.current.firstChild) {
        canvasRef.current.removeChild(canvasRef.current.firstChild);
      }
      canvasRef.current.appendChild(renderer.domElement);
    }



    const shapes: THREE.Mesh[] = []; 
    const geometry1 = new THREE.BoxGeometry(1, 1, 1);
    const geometry2 = new THREE.CircleGeometry(0.5, 32);
    const geometry3 = new THREE.TetrahedronGeometry(0.5);

    const material = new THREE.MeshBasicMaterial({ color: 0x00D5FF });

    for (let i = 0; i < 50; i++) {
      let shape: THREE.Mesh | null = null;

      const randomShape = Math.floor(Math.random() * 3);
      if (randomShape === 0) shape = new THREE.Mesh(geometry1, material); 
      if (randomShape === 1) shape = new THREE.Mesh(geometry2, material); 
      if (randomShape === 2) shape = new THREE.Mesh(geometry3, material); 

      if (shape) {
        shape.position.set(
          (Math.random() - 0.5) * 10,
          Math.random() * 10 + 5,
          Math.random() * 10
        );

        scene.add(shape); 
        shapes.push(shape); 
      }
    }

    camera.position.z = 5;

    const animate = function () {
      requestAnimationFrame(animate);

      shapes.forEach((shape) => {
        shape.position.y -= 0.01;
        if (shape.position.y < -5) {
          shape.position.y = Math.random() * 10 + 5;
        }
      });

      renderer.render(scene, camera);
    };

    animate();
    return () => {
      shapes.forEach((shape) => scene.remove(shape));
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
    };
  }, []);

  return (
    <>
    <BackIcon/>
    <div className="page3" >
      <div className="content" style={{position: 'absolute', display:'flex', flexDirection:'column',padding: '30px', height:'100vh', width: '80%',gap: '80px', overflow:'scroll'}}>
        <div className="text-container" style={{display:'flex', position:'relative',left: '0px', flexDirection:'column', gap:'20px'}}>
          <div className="subtitle">web과 간판의 공통점을 발견하다...</div>
          <div className="line" style={{width:'100%', height:'3px', backgroundColor:'#000', opacity:'1.0'}}></div>
          <p>
            언제 한 번 이야기를 나누며 <a href="https://en.wikipedia.org/wiki/Zine">‘zine’</a>과 <a href="https://ko.wikipedia.org/wiki/%EC%9B%94%EB%93%9C_%EC%99%80%EC%9D%B4%EB%93%9C_%EC%9B%B9">‘web’</a>이라는 표현 수단을
            ‘개인의 생각으로 가상적인, 혹은 물리적인 공간을 꾸미는 행위'라고
            정의한 적이 있다. 이에 그치지 않고 우리는 위 2개의 표현 수단이
            특정 메시지를 시각적으로 재현한다는 측면에서 <a href="https://ko.wikipedia.org/wiki/%EA%B0%84%ED%8C%90">‘간판'</a>이라는 표현
            수단과 닮았다고 생각했다. 이로부터 출발해 위 3개의 표현 수단을
            직접 잇는 프로젝트를 기획하게 되었다.
          </p>
          <p>
            특히나 간판이라는 주제는 우리에게 3가지 측면에서 매력적으로
            다가왔다. 첫째, 간판은 특정 시간과 공간 속의 사회, 역사, 경제적
            의미를 담고 있고, 우리는 그 시대를 간판으로 빗대어 볼 수 있다.
            둘째, 그렇기에 간판은 단순히 그 가게를 대표하는 것을 넘어, 간판을
            창조한 자의 심정과 메시지, 철학, 인생을 담는다. 셋째, 가게의
            흥망성쇠에 따라 간판이 탄생하고 소멸하는 사이 우리는 다양한 방법으로
            목소리를 내기도, 침묵하기도 한다.
          </p>
          <p>
            NewZines(뉴진-)팀은 간판의 표현 수단 방식과 의미를 곱씹으며 이
            시사점에 대한 애정을 쌓았고, 아래와 같이 실현하고자 한다.
          </p>
        </div>

        <div className='text-container' style={{position:'relative', display:'flex', flexDirection:'column', gap:'20px', alignItems:'end'}}>
          <div className="subtitle">디지털과 아날로그의 경계를 넘나드는 시각적 기호, 간판</div>
          <div className="line" style={{width:'100%', height:'3px', backgroundColor:'#000', opacity:'1.0'}}></div>
          <p>
          간판은 한국이라는 일상적 공간에서 발견되는 시각적 기호, 특히 간판의 텍스트를 중심으로 디지털과 아날로그의 경계를 탐구하는 실험적 프로젝트이다. 이 작업은 간판이라는 상업적 목적의 매체를 예술적 맥락으로 전환함으로써, 텍스트와 이미지가 새로운 의미와 해석을 부여받는 과정을 보인다. 
          프로젝트의 핵심은 도시 간판의 개별 글자를 촬영하고 레이블링하여, 디지털 데이터베이스를 구축하는 것이다. 이를 바탕으로 개발된 웹사이트에서 사용자는 자신만의 문장을 입력할 수 있으며, 입력된 텍스트는 간판에서 추출된 글자 이미지로 자동 조합되어 디스플레이된다. 이 디지털 인터페이스는 레미디어이션과 포스트 디지털 미학 이론을 기반으로, 독립된 형태로 존재하는 매체의 경계를 허물며 텍스트와 이미지 간의 상호작용을 통해 새로운 매체에 대한 경험을 제공한다.
          </p>
          <p>
          간판은 사용자가 창조한 문장 이미지를 디지털 형태로 저장할 수 있는 기능을 제공할 뿐만 아니라, 이러한 이미지를 zine 형식의 아날로그 출판물로 재변모한다. 이는 디지털에서 출발한 예술적 과정이 다시 물리적 형태(사람의 손에 쥐어지는)로 돌아오며, 현대의 디지털 미디어가 아날로그와 어떻게 상호보완적으로 작용할 수 있는지 탐구한다. 텍스트의 시각적 재구성을 통해 관람자로 하여금 한국이라는 공간의 풍경을 새롭게 바라보게 하며, 동시에 디지털 아트(웹사이트)와 출판 미디어의 가능성을 제시한다.
          </p>
        </div>
      </div>
      
      <div ref={canvasRef} className="threejs-canvas" style={{position: 'absolute', zIndex:'-1'}}/>
    </div>
    </>
  );
}

export default About;
