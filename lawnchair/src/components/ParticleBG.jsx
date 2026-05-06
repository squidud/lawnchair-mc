// particles component :O

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";
import { EffectComposer, DepthOfField, Bloom } from "@react-three/postprocessing";

function createEmberTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");

    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, "rgba(255, 250, 220, 1)");
    gradient.addColorStop(0.3, "rgba(255, 120, 20, 1)");
    gradient.addColorStop(0.35, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    return new THREE.CanvasTexture(canvas);
}

function Embers() {
    const mesh = useRef();
    const noise3D = useMemo(() => createNoise3D(), []);
    const count = 50;
    const texture = useMemo(() => createEmberTexture(), []);

    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = 2 + Math.random() * 6;
            positions[i * 3 + 1] = -3 - Math.random() * 4;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
            sizes[i] = Math.random() * 3;
        }
        return { positions, sizes };
    }, []);

    useFrame((state, delta) => {
        const positions = mesh.current.geometry.attributes.position.array;
        const t = state.clock.elapsedTime;

        for (let i = 0; i < count; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            const iz = i * 3 + 2;

            // base upward rise, increased for quicker dispersion
            positions[iy] += delta * (0.4 + noise3D(i, t * 0.1, 0) * 0.3);

            // swirly horizontal movement from noise, increased for more spread
            positions[ix] += noise3D(i * 0.5, t * 0.2, 1) * delta * 0.7;

            // gradual drift leftward, increased for quicker spread
            positions[ix] -= delta * 0.2;

            // heat shimmer — rapid small vertical jitter
            positions[iy] += noise3D(i * 2, t * 0.8, 2) * delta * 0.08;

            // mouse interaction - subtle repulsion turbulence
            const mouseX = state.mouse.x * 5;
            const mouseY = state.mouse.y * 5;
            const dist = Math.sqrt((positions[ix] - mouseX) ** 2 + (positions[iy] - mouseY) ** 2);
            if (dist < 3 && dist > 0.1) {
                const force = 0.5 / dist;
                positions[ix] += (positions[ix] - mouseX) / dist * force * delta;
                positions[iy] += (positions[iy] - mouseY) / dist * force * delta;
            }

            // reset to bottom when off screen
            if (positions[iy] > 5) {
                positions[iy] = -3 - Math.random() * 4;
                positions[ix] = 2 + Math.random() * 6;
            }
        }

        mesh.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[particles.positions, 3]} />
                <bufferAttribute attach="attributes-size" args={[particles.sizes, 1]} />
            </bufferGeometry>
            <pointsMaterial
                map={texture}
                size={0.1}
                sizeAttenuation
                transparent
                opacity={0.9}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

function ParticleBG() {
    return (
        <div className="absolute inset-0">
            <Canvas camera={{ position: [0, 0, 5], fov: 75, near: 0.1, far: 50 }}>
                <Embers />
                <EffectComposer>
                    <DepthOfField
                        target={[0, 0, 0]}
                        focalLength={0.02}
                        bokehScale={8}
                    />
                    <Bloom
                        intensity={0.5}
                        luminanceThreshold={0.1}
                        luminanceSmoothing={0.9}
                    />
                </EffectComposer>
            </Canvas>
        </div>
    );
}

export default ParticleBG;