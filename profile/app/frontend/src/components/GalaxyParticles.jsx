import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const GalaxyParticles = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const particlesRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const shapeStateRef = useRef({
    currentShape: 0,
    lerpSpeed: 0.025,
    isExploding: false,
    explodeTimer: 0,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06060f, 0.0015);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.z = 200;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x06060f, 0);
    containerRef.current.appendChild(renderer.domElement);

    const N = 15000;

    // Shape generators
    const makeGalaxy = (arr) => {
      for (let i = 0; i < N; i++) {
        const i3 = i * 3;
        const arm = Math.floor(Math.random() * 5);
        const armAngle = (arm / 5) * Math.PI * 2;
        const dist = 5 + Math.random() * 180;
        const spiral = dist * 0.04;
        const angle = armAngle + spiral + (Math.random() - 0.5) * 0.5;
        const scatter = (1 - dist / 200) * 18 + 2;
        arr[i3] = Math.cos(angle) * dist + (Math.random() - 0.5) * scatter;
        arr[i3 + 1] = (Math.random() - 0.5) * scatter * 0.4;
        arr[i3 + 2] = Math.sin(angle) * dist + (Math.random() - 0.5) * scatter;
      }
    };

    const makeVortex = (arr) => {
      for (let i = 0; i < N; i++) {
        const i3 = i * 3;
        const a = i * 0.12;
        const r = 10 + (i / N) * 120;
        arr[i3] = Math.cos(a) * r;
        arr[i3 + 1] = (Math.random() - 0.5) * 12;
        arr[i3 + 2] = Math.sin(a) * r;
      }
    };

    const makeSphere = (arr) => {
      for (let i = 0; i < N; i++) {
        const i3 = i * 3;
        const r = 60;
        const phi = Math.acos(-1 + (2 * i) / N);
        const theta = Math.sqrt(N * Math.PI) * phi;
        arr[i3] = r * Math.cos(theta) * Math.sin(phi) * (1 + Math.random() * 0.08);
        arr[i3 + 1] = r * Math.sin(theta) * Math.sin(phi) * (1 + Math.random() * 0.08);
        arr[i3 + 2] = r * Math.cos(phi) * (1 + Math.random() * 0.08);
      }
    };

    const makeHelix = (arr) => {
      for (let i = 0; i < N; i++) {
        const i3 = i * 3;
        const t = (i / N) * 28 * Math.PI;
        const off = i % 2 === 0 ? 0 : Math.PI;
        arr[i3] = 28 * Math.cos(t + off);
        arr[i3 + 1] = (i / N) * 250 - 125;
        arr[i3 + 2] = 28 * Math.sin(t + off);
      }
    };

    const shapes = [];
    for (let s = 0; s < 4; s++) shapes.push(new Float32Array(N * 3));
    makeGalaxy(shapes[0]);
    makeVortex(shapes[1]);
    makeSphere(shapes[2]);
    makeHelix(shapes[3]);

    const posCurrent = new Float32Array(N * 3);
    const colors = new Float32Array(N * 3);
    const colorObj = new THREE.Color();
    const velocity = new Float32Array(N * 3);

    for (let i = 0; i < N; i++) {
      const i3 = i * 3;
      posCurrent[i3] = (Math.random() - 0.5) * 800;
      posCurrent[i3 + 1] = (Math.random() - 0.5) * 800;
      posCurrent[i3 + 2] = (Math.random() - 0.5) * 800;

      const t = i / N;
      colorObj.setHSL(
        0.72 + t * 0.15 + Math.random() * 0.05,
        0.6 + Math.random() * 0.4,
        0.5 + Math.random() * 0.4
      );
      colors[i3] = colorObj.r;
      colors[i3 + 1] = colorObj.g;
      colors[i3 + 2] = colorObj.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(posCurrent, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Glow sprite
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.1, 'rgba(200,180,255,0.9)');
    gradient.addColorStop(0.4, 'rgba(120,100,255,0.3)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    const sprite = new THREE.Texture(canvas);
    sprite.needsUpdate = true;

    const mat = new THREE.PointsMaterial({
      size: 2.5,
      map: sprite,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      opacity: 0.9,
    });

    const particles = new THREE.Points(geo, mat);
    scene.add(particles);
    particlesRef.current = { particles, geo, mat, shapes, posCurrent, velocity, N };

    // Mouse tracking
    document.addEventListener('mousemove', (e) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Scroll-based shape morphing
    let scrollProgress = 0;
    window.addEventListener('scroll', () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = window.scrollY / totalHeight;
      shapeStateRef.current.currentShape = Math.floor(scrollProgress * 4) % 4;
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      const { currentShape } = shapeStateRef.current;
      const targetShape = shapes[currentShape];

      // Lerp to target shape
      for (let i = 0; i < N * 3; i++) {
        posCurrent[i] += (targetShape[i] - posCurrent[i]) * shapeStateRef.current.lerpSpeed;
      }

      // Hover repulsion effect
      const EXPLODE_RADIUS = 60;
      const EXPLODE_FORCE = 0.8;
      const VELOCITY_DECAY = 0.95;

      for (let i = 0; i < N; i++) {
        const i3 = i * 3;
        const px = posCurrent[i3];
        const py = posCurrent[i3 + 1];
        const pz = posCurrent[i3 + 2];

        const dx = pointerRef.current.x * 300 - px;
        const dy = pointerRef.current.y * 200 - py;
        const dz = -pz;

        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < EXPLODE_RADIUS) {
          const force = (1 - dist / EXPLODE_RADIUS) * EXPLODE_FORCE;
          const normalX = dx / (dist || 1);
          const normalY = dy / (dist || 1);
          const normalZ = dz / (dist || 1);

          velocity[i3] -= normalX * force * 0.5;
          velocity[i3 + 1] -= normalY * force * 0.5;
          velocity[i3 + 2] -= normalZ * force * 0.5;
        }

        // Apply velocity
        posCurrent[i3] += velocity[i3];
        posCurrent[i3 + 1] += velocity[i3 + 1];
        posCurrent[i3 + 2] += velocity[i3 + 2];

        // Decay velocity
        velocity[i3] *= VELOCITY_DECAY;
        velocity[i3 + 1] *= VELOCITY_DECAY;
        velocity[i3 + 2] *= VELOCITY_DECAY;
      }

      geo.attributes.position.needsUpdate = true;
      particles.rotation.y += 0.0005;

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', () => {});
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
};

export default GalaxyParticles;
