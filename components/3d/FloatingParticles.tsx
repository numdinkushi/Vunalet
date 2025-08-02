'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function FloatingParticles() {
    const meshRef = useRef<THREE.Group>(null);
    const particlesRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
        }

        if (particlesRef.current) {
            particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
        }
    });

    const particles = [];
    for (let i = 0; i < 30; i++) {
        particles.push({
            position: [
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8
            ],
            scale: Math.random() * 0.3 + 0.1
        });
    }

    return (
        <group ref={particlesRef}>
            {particles.map((particle, i) => (
                <mesh key={i} position={particle.position as [number, number, number]} scale={particle.scale}>
                    <sphereGeometry args={[0.03, 6, 6]} />
                    <meshBasicMaterial color="#147A4E" opacity={0.4} transparent />
                </mesh>
            ))}
        </group>
    );
} 