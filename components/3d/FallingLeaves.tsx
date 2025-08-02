'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

interface Leaf {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: number;
    speed: number;
    sway: number;
    swaySpeed: number;
    swayAmount: number;
    fallSpeed: number;
    color: string;
}

const LeafGeometry = () => {
    const meshRef = useRef<THREE.Mesh>(null);

    // Create more realistic leaf shape
    const leafShape = useMemo(() => {
        const shape = new THREE.Shape();

        // Create a more realistic leaf shape with stem
        shape.moveTo(0, 0.6); // Stem top
        shape.lineTo(0, 0.4); // Stem
        shape.quadraticCurveTo(0.1, 0.3, 0.2, 0.2); // Leaf base
        shape.quadraticCurveTo(0.4, 0.1, 0.6, 0); // Leaf tip
        shape.quadraticCurveTo(0.4, -0.1, 0.2, -0.2); // Leaf edge
        shape.quadraticCurveTo(0.1, -0.3, 0, -0.4); // Leaf base
        shape.lineTo(0, -0.6); // Stem bottom

        return shape;
    }, []);

    const geometry = useMemo(() => {
        const extrudeSettings = {
            depth: 0.01,
            bevelEnabled: true,
            bevelSegments: 3,
            steps: 2,
            bevelSize: 0.005,
            bevelThickness: 0.005,
        };

        return new THREE.ExtrudeGeometry(leafShape, extrudeSettings);
    }, [leafShape]);

    return (
        <mesh ref={meshRef} geometry={geometry}>
            <meshStandardMaterial color="#228B22" side={THREE.DoubleSide} />
        </mesh>
    );
};

const FallingLeaf = ({ leaf }: { leaf: Leaf; }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (meshRef.current && groupRef.current) {
            // Update position - falling down
            leaf.position[1] -= leaf.fallSpeed * 0.008;

            // Add swaying motion
            leaf.sway += leaf.swaySpeed;
            leaf.position[0] += Math.sin(leaf.sway) * leaf.swayAmount * 0.002;

            // Reset leaf position when it goes below screen
            if (leaf.position[1] < -8) {
                leaf.position[1] = 12;
                leaf.position[0] = (Math.random() - 0.5) * 25;
                leaf.sway = Math.random() * Math.PI * 2;
            }

            // Update mesh position and rotation
            meshRef.current.position.set(...leaf.position);
            groupRef.current.rotation.set(
                leaf.rotation[0] + Math.sin(state.clock.elapsedTime * 0.3) * 0.2,
                leaf.rotation[1] + state.clock.elapsedTime * 0.2,
                leaf.rotation[2] + Math.sin(state.clock.elapsedTime * 0.5) * 0.15
            );
        }
    });

    return (
        <group ref={groupRef} scale={[leaf.scale, leaf.scale, leaf.scale]}>
            <LeafGeometry />
        </group>
    );
};

const FallingLeavesScene = () => {
    const leaves = useMemo(() => {
        const leafArray: Leaf[] = [];
        const colors = ['#228B22', '#32CD32', '#90EE90', '#98FB98', '#00FF00', '#7CFC00'];

        for (let i = 0; i < 40; i++) {
            leafArray.push({
                position: [
                    (Math.random() - 0.5) * 25, // x
                    Math.random() * 15 + 8,      // y
                    (Math.random() - 0.5) * 8    // z
                ],
                rotation: [
                    Math.random() * Math.PI * 2,
                    Math.random() * Math.PI * 2,
                    Math.random() * Math.PI * 2
                ],
                scale: Math.random() * 0.4 + 0.2, // 0.2 to 0.6
                speed: Math.random() * 0.5 + 0.5,
                sway: Math.random() * Math.PI * 2,
                swaySpeed: Math.random() * 0.015 + 0.008,
                swayAmount: Math.random() * 0.8 + 0.4,
                fallSpeed: Math.random() * 0.6 + 0.4,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        return leafArray;
    }, []);

    return (
        <>
            {leaves.map((leaf, index) => (
                <FallingLeaf key={index} leaf={leaf} />
            ))}
        </>
    );
};

export const FallingLeaves = () => {
    return (
        <div className="absolute inset-0">
            <Canvas
                camera={{ position: [0, 0, 12], fov: 60 }}
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={0.7} />
                <directionalLight position={[10, 10, 5]} intensity={0.9} />
                <pointLight position={[-10, -10, -5]} intensity={0.3} />

                <FallingLeavesScene />
            </Canvas>
        </div>
    );
}; 