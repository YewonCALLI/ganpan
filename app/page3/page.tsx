'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import '../../app/app.css';

const imageUrls = [
'https://www.yewoncalli.com/assets/image/image 4.png',
'https://newzines.vercel.app/Group 7.png',
'https://newzines.vercel.app/Group 7.png',
'https://newzines.vercel.app/Group 7.png',
'https://www.yewoncalli.com/assets/image/image 4.png',
'https://newzines.vercel.app/Group 7.png',
'https://newzines.vercel.app/Group 7.png',
'https://newzines.vercel.app/Group 7.png',
'https://www.yewoncalli.com/assets/image/image 4.png',
'https://newzines.vercel.app/Group 7.png',
'https://newzines.vercel.app/Group 7.png',
'https://newzines.vercel.app/Group 7.png',


];

interface CustomMesh extends THREE.Mesh {
  targetPosition?: {
    x: number;
    y: number;
    z: number;
  };
  reachedTarget?: boolean; // 새로운 속성 추가
}

const ThreeJSScene = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const planesRef = useRef<CustomMesh[]>([]); // planes 상태 대신 ref 사용

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.z = 30;
    camera.position.y = 10;
    camera.position.x = 10;
    controls.update();

    const generateRandomTargetPositions = () => {
      const positions = [];
      const layers = 9;
      const columns = 4;

      for (let i = 0; i < layers; i++) {
        for (let j = 0; j < columns; j++) {
          positions.push({
            x: j * (Math.random() * 1.5 + 2),
            y: i * (Math.random() * 1.5 + 2),
            z: Math.random() * 10 + 2,
          });
        }
      }
      return positions;
    };

    const targetPositions = generateRandomTargetPositions();
    const loader = new THREE.TextureLoader();

    const createPlane = (imageURL: string, targetPosition: { x: number; y: number; z: number }, direction: string) => {
      loader.load(imageURL, (texture) => {
        const image = texture.image;
        const aspectRatio = image.width / image.height;
        const width = 6;
        const height = width / aspectRatio;
        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7,
        });

        const plane: CustomMesh = new THREE.Mesh(geometry, material);

        if (direction === 'horizontal') {
          plane.position.set(
            targetPosition.x + (Math.random() * 20 - 20),
            targetPosition.y,
            targetPosition.z
          );
        } else {
          plane.position.set(
            targetPosition.x,
            targetPosition.y + (Math.random() * 20 - 30),
            targetPosition.z
          );
        }

        const randomRotation = Math.floor(Math.random() * 4) * Math.PI / 2;
        if (Math.random() > 0.5) {
          plane.rotation.x = randomRotation;
        } else {
          plane.rotation.y = randomRotation;
        }

        scene.add(plane);

        plane.targetPosition = {
          x: targetPosition.x + (Math.random() * 0.5 - 0.25),
          y: targetPosition.y + (Math.random() * 0.5 - 0.25),
          z: targetPosition.z + (Math.random() * 0.5 - 0.25),
        };

        plane.reachedTarget = false; // 처음에는 targetPosition에 도달하지 않음

        planesRef.current.push(plane); // planes 상태 대신 ref에 추가
      });
    };

    imageUrls.forEach((url, i) => {
      const direction = i % 2 === 0 ? 'horizontal' : 'vertical';
      createPlane(url, targetPositions[i], direction);
    });

    const animate = () => {
      requestAnimationFrame(animate);

      planesRef.current.forEach((plane) => {
        if (plane.targetPosition && !plane.reachedTarget) { // 목표에 도달하지 않은 경우에만 움직임
          plane.position.x += (plane.targetPosition.x - plane.position.x) * 0.05;
          plane.position.y += (plane.targetPosition.y - plane.position.y) * 0.05;
          plane.position.z += (plane.targetPosition.z - plane.position.z) * 0.05;

          const distance = Math.sqrt(
            Math.pow(plane.targetPosition.x - plane.position.x, 2) +
            Math.pow(plane.targetPosition.y - plane.position.y, 2) +
            Math.pow(plane.targetPosition.z - plane.position.z, 2)
          );

          if (distance < 0.1) {
            // 목표 지점에 도달하면 움직임을 멈추기 위해 플래그 설정
            plane.position.set(plane.targetPosition.x, plane.targetPosition.y, plane.targetPosition.z);
            plane.reachedTarget = true; // 목표 지점에 도달함
          }
        }
      });

      controls.update();
      renderer.setClearColor(0xffffff, 0);
      renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });

    return () => {
      window.removeEventListener('resize', () => {});
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default ThreeJSScene;
