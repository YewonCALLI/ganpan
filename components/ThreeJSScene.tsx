'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import '../app/app.css';
import supabase from '@/utils/supabase/supabaseClient'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader';
import { fetchImageUrls } from '../pages/api/get-generateimage-urls'; // 이미지 URL 가져오기
import BackIcon from './BackIcon';

interface CustomMesh extends THREE.Mesh {
    userData: {
        imageURL?: string;
    };
    targetPosition?: THREE.Vector3;
    reachedTarget?: boolean;
}

const ThreeJSScene = () => {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const planesRef = useRef<CustomMesh[]>([]);
    const hoveredPlaneRef = useRef<CustomMesh | null>(null);
    const [selectedImageURL, setSelectedImageURL] = useState<string | null>(null);

    const cameraTargetYRef = useRef<number>(10);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const zoomLevelRef = useRef<number>(1);

    const [imageUrls, setImageUrls] = useState<(string | null)[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const urls = await fetchImageUrls();
            setImageUrls(urls);
        };

        fetchData();

        const subscription = supabase
            .channel('realtime:generated_image')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'generated_image' }, (payload) => {
                console.log('Real-time change:', payload);

                if (payload.eventType === 'INSERT') {
                    // Add the new image URL
                    setImageUrls((prev) => [...prev, payload.new.public_url]);
                } else if (payload.eventType === 'DELETE') {
                    // Remove the deleted image URL
                    setImageUrls((prev) => prev.filter((url) => url !== payload.old.public_url));
                } else if (payload.eventType === 'UPDATE') {
                    // Update the modified image URL
                    setImageUrls((prev) =>
                        prev.map((url) => (url === payload.old.public_url ? payload.new.public_url : url))
                    );
                }
            })
            .subscribe();

        // Clean up the subscription on unmount
        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);


    // const isBrowser = typeof window !== 'undefined';

    useEffect(() => {
        // if (!isBrowser) return;

        if (imageUrls.length === 0 || !mountRef.current) return;

        const scene = new THREE.Scene();

        const buildingGroup = new THREE.Group();
        scene.add(buildingGroup);

        const camera = new THREE.PerspectiveCamera(
            75,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            1000
        );
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);

        mountRef.current.appendChild(renderer.domElement);

        camera.position.set(0, 0, 30);
        // Remove camera.lookAt() - camera will now face forward (negative Z direction)

        const loader = new THREE.TextureLoader();

        let linesDrawn = false;
        let buildingRotationStarted = false;

        const createPlane = (
            imageURL: string,
            position: { x: number; y: number; z: number }
        ) => {
            loader.load(imageURL, (texture) => {
                const image = texture.image;
                const aspectRatio = image.width / image.height;
                const width = 4;
                const height = width / aspectRatio;
                const geometry = new THREE.PlaneGeometry(width, height);
                const material = new THREE.MeshBasicMaterial({
                    map: texture,
                    side: THREE.DoubleSide,
                });

                const plane: CustomMesh = new THREE.Mesh(geometry, material);

                // Set initial random position
                plane.position.set(
                    position.x + (Math.random() * 20 - 10),
                    position.y + (Math.random() * 20 - 10),
                    position.z + (Math.random() * 20 - 10)
                );

                const randomRotation = Math.floor(Math.random() * 4) * (Math.PI / 2);
                if (Math.random() > 0.5) {
                    plane.rotation.x = randomRotation;
                } else {
                    plane.rotation.y = randomRotation;
                }

                plane.targetPosition = new THREE.Vector3(position.x, position.y, position.z);
                plane.reachedTarget = false;

                plane.userData = { imageURL };

                buildingGroup.add(plane);
                planesRef.current.push(plane);
            });
        };

        const generateTargetPositions = () => {
            const positions: { x: number; y: number; z: number }[] = [];
            const planesPerFloor = 14;
            const totalPlanes = imageUrls.length;
            const floors = Math.ceil(totalPlanes / planesPerFloor);

            const planeSpacingX = 6;
            const planeSpacingZ = 4;
            const floorHeight = 7;

            for (let floor = 0; floor < floors; floor++) {
                for (let i = 0; i < planesPerFloor; i++) {
                    const planeIndex = floor * planesPerFloor + i;
                    if (planeIndex >= totalPlanes) break;

                    const column = i % 3;
                    const row = Math.floor(i / 3);
                    const x = column * planeSpacingX - ((4 - 1) / 2) * planeSpacingX;
                    const y = floor * floorHeight;
                    const z = row * planeSpacingZ - ((3 - 1) / 2) * planeSpacingZ;

                    positions.push({ x, y, z });
                }
            }

            return positions;
        };

        const targetPositions = generateTargetPositions();

        imageUrls.forEach((url, i) => {
            if (url) { // null 체크 추가
                const position = targetPositions[i] || targetPositions[targetPositions.length - 1];
                createPlane(url, position);
            }
        });

        const onDocumentMouseMove = (event: MouseEvent) => {
            event.preventDefault();

            const mouse = new THREE.Vector2();
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);

            const intersects = raycaster.intersectObjects(planesRef.current);

            if (intersects.length > 0) {
                const intersectedPlane = intersects[0].object as CustomMesh;

                if (hoveredPlaneRef.current !== intersectedPlane) {
                    if (hoveredPlaneRef.current) {
                        (hoveredPlaneRef.current.material as THREE.MeshBasicMaterial).color.set(0xffffff);
                    }

                    hoveredPlaneRef.current = intersectedPlane;
                    (intersectedPlane.material as THREE.MeshBasicMaterial).color.set(0x00ff00);

                    document.body.style.cursor = 'pointer';
                }
            } else {
                if (hoveredPlaneRef.current) {
                    (hoveredPlaneRef.current.material as THREE.MeshBasicMaterial).color.set(0xffffff);
                    hoveredPlaneRef.current = null;

                    document.body.style.cursor = 'default';
                }
            }
        };

        const onDocumentMouseDown = (event: MouseEvent) => {
            event.preventDefault();
        
            // 디버깅을 위한 로그
            console.log("Mouse click detected");
            
            const mouse = new THREE.Vector2();
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
            console.log("Mouse coordinates:", mouse);
            
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);
            
            // 현재 plane 개수 확인
            console.log("Number of planes:", planesRef.current.length);
            
            const intersects = raycaster.intersectObjects(planesRef.current);
            console.log("Intersects:", intersects);
        
            if (intersects.length > 0) {
                const intersectedPlane = intersects[0].object as CustomMesh;
                console.log("Intersected plane:", intersectedPlane);
                console.log("Image URL:", intersectedPlane.userData.imageURL);
        
                if (intersectedPlane.userData.imageURL) {
                    setSelectedImageURL(intersectedPlane.userData.imageURL);
                    console.log("Setting selected image URL:", intersectedPlane.userData.imageURL);
                } else {
                    console.warn("No image URL found in userData");
                }
            } else {
                console.log("No intersection detected");
                setSelectedImageURL(null);
            }
        };
        
        renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
        renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);

        // 마우스 휠 이벤트 핸들러 추가
        const onDocumentMouseWheel = (event: WheelEvent) => {
            event.preventDefault();
            
            // 휠 스크롤값에 따라 줌 조정
            const delta = event.deltaY > 0 ? 1.1 : 0.9;
            zoomLevelRef.current *= delta;
            
            // 줌 레벨 제한 (너무 가깝거나 멀어지지 않도록)
            zoomLevelRef.current = Math.max(0.1, Math.min(5, zoomLevelRef.current));
            
            // FOV 조정
            if (cameraRef.current) {
                const baseFOV = 75;
                cameraRef.current.fov = baseFOV / zoomLevelRef.current;
                cameraRef.current.updateProjectionMatrix();
            }
        };

        renderer.domElement.addEventListener('wheel', onDocumentMouseWheel, { passive: false });

        const drawLines = () => {
            const positionMap = new Map<string, CustomMesh[]>();

            planesRef.current.forEach((plane) => {
                const x = plane.targetPosition!.x;
                const z = plane.targetPosition!.z;
                const key = `${Math.round(x)},${Math.round(z)}`;
                if (!positionMap.has(key)) {
                    positionMap.set(key, []);
                }
                positionMap.get(key)!.push(plane);
            });

            const verticalLinePositions: number[] = [];

            positionMap.forEach((planesGroup) => {
                if (planesGroup.length > 1) {
                    planesGroup.sort((a, b) => a.targetPosition!.y - b.targetPosition!.y);
                    for (let i = 0; i < planesGroup.length - 1; i++) {
                        const start = planesGroup[i].targetPosition!;
                        const end = planesGroup[i + 1].targetPosition!;
                        verticalLinePositions.push(start.x, start.y, start.z);
                        verticalLinePositions.push(end.x, end.y, end.z);
                    }
                }
            });

            const verticalLineGeometry = new THREE.BufferGeometry();
            verticalLineGeometry.setAttribute(
                'position',
                new THREE.Float32BufferAttribute(verticalLinePositions, 3)
            );

            const verticalLineMaterial = new THREE.LineBasicMaterial({ color: 0xff0800 });
            const verticalLines = new THREE.LineSegments(verticalLineGeometry, verticalLineMaterial);

            buildingGroup.add(verticalLines);

            const floorMap = new Map<number, CustomMesh[]>();

            planesRef.current.forEach((plane) => {
                const y = plane.targetPosition!.y;
                const key = Math.round(y);
                if (!floorMap.has(key)) {
                    floorMap.set(key, []);
                }
                floorMap.get(key)!.push(plane);
            });

            const horizontalLinePositions: number[] = [];

            floorMap.forEach((planesGroup) => {
                if (planesGroup.length > 1) {
                    planesGroup.sort((a, b) => {
                        if (a.targetPosition!.x !== b.targetPosition!.x) {
                            return a.targetPosition!.x - b.targetPosition!.x;
                        } else {
                            return a.targetPosition!.z - b.targetPosition!.z;
                        }
                    });
                    for (let i = 0; i < planesGroup.length - 1; i++) {
                        const start = planesGroup[i].targetPosition!;
                        const end = planesGroup[i + 1].targetPosition!;
                        horizontalLinePositions.push(start.x, start.y, start.z);
                        horizontalLinePositions.push(end.x, end.y, end.z);
                    }
                }
            });

            const horizontalLineGeometry = new THREE.BufferGeometry();
            horizontalLineGeometry.setAttribute(
                'position',
                new THREE.Float32BufferAttribute(horizontalLinePositions, 3)
            );

            const horizontalLineMaterial = new THREE.LineBasicMaterial({ color: 0xff0800 });
            const horizontalLines = new THREE.LineSegments(horizontalLineGeometry, horizontalLineMaterial);


            buildingGroup.add(horizontalLines);

            linesDrawn = true;
            buildingRotationStarted = true;
        };

        // Post-processing 효과를 위한 EffectComposer 설정
        const composer = new EffectComposer(renderer);
        composer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);

        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        // FilmPass 추가 (노이즈와 스캔 라인 효과)
        const filmPass = new FilmPass(0.35, false);
        composer.addPass(filmPass);

        // RGB 분리 효과를 위한 ShaderPass 추가
        const rgbShiftPass = new ShaderPass(RGBShiftShader);
        rgbShiftPass.uniforms['amount'].value = 0.0015;
        composer.addPass(rgbShiftPass);

        // GlitchPass 추가 (간헐적인 글리치 효과)
        const glitchPass = new GlitchPass(0.3);
        glitchPass.goWild = false;
        composer.addPass(glitchPass);

        let animationFrameId: number;

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            let allPlanesReachedTarget = true;

            planesRef.current.forEach((plane) => {
                if (plane.targetPosition && !plane.reachedTarget) {
                    const delta = new THREE.Vector3().subVectors(plane.targetPosition, plane.position);
                    const distance = delta.length();

                    if (distance <= 0.1) {
                        plane.position.copy(plane.targetPosition);
                        plane.reachedTarget = true;
                    } else {
                        const moveDistance = delta.normalize().multiplyScalar(0.1);
                        plane.position.add(moveDistance);
                        allPlanesReachedTarget = false;
                    }
                }
            });

            if (allPlanesReachedTarget) {
                drawLines();
            }

            if (buildingRotationStarted) {
                buildingGroup.rotation.y += 0.005;
            }

            // Y축 이동은 그대로 유지하지만, lookAt은 제거
            camera.position.y += (cameraTargetYRef.current - camera.position.y) * 0.05;
            // camera.lookAt(0, 15, 0); // 이 줄을 제거!

            renderer.setClearColor(0xffffff, 0);
            // renderer.render(scene, camera);
            composer.render();
        };

        animate();

        const handleResize = () => {
            const width = mountRef.current?.clientWidth || window.innerWidth;
            const height = mountRef.current?.clientHeight || window.innerHeight;
            renderer.setSize(width, height);
            composer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.domElement.removeEventListener('mousemove', onDocumentMouseMove, false);
            renderer.domElement.removeEventListener('click', onDocumentMouseDown, false);
            renderer.domElement.removeEventListener('wheel', onDocumentMouseWheel, false);
            cancelAnimationFrame(animationFrameId);
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    });

    const handleScrollChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newY = parseFloat(event.target.value);
        cameraTargetYRef.current = newY;
    };

    return (
        <div style={{ height: '100vh', position: 'relative' }}>
            <div
                ref={mountRef}
                style={{ position: 'absolute', width: '100vw', height: '100vh', backgroundColor: '#fff' }}
            />

            <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                <input
                    type="range"
                    min="10"
                    max="100"
                    step="0.5"
                    defaultValue="10"
                    onChange={handleScrollChange}
                    style={{
                        WebkitAppearance: 'none',
                        background: '#ddd',
                        outline: 'none',
                        opacity: 0.7,
                        WebkitTransition: '.2s',
                        transition: 'opacity .2s',
                        transform: 'rotate(-90deg)',
                        width: '200px',
                        height: '8px',
                        marginTop: '100px',
                    }}
                />
                <label style={{ marginTop: '20px', color: '#000', display: 'block', textAlign: 'center' }}></label>
            </div>

            {selectedImageURL && (
                <div
                    style={{
                        position: 'fixed',
                        width: '15vw',
                        padding: '10px',
                        bottom: '0%',
                        right:'0px',
                        backgroundColor: '#000000',
                        color: '#fff', // 텍스트 색상 추가
                        zIndex : 1000,
                    }}
                >
                    <img src={selectedImageURL} style={{ width: '100%' }} alt="Selected" />
                </div>
            )}
            <BackIcon/>

        </div>
    );
};

export default ThreeJSScene;
