import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const mountRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ─── Scene Setup ──────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x001a2e, 0.035);

    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x001a2e, 1);
    container.appendChild(renderer.domElement);

    // ─── Lighting ──────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0x4da6ff, 0.3);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00ffff, 2.5, 50);
    cyanLight.position.set(5, 5, 5);
    scene.add(cyanLight);

    const magentaLight = new THREE.PointLight(0xff006e, 2.5, 50);
    magentaLight.position.set(-5, -3, 3);
    scene.add(magentaLight);

    const blueLight = new THREE.PointLight(0x4da6ff, 1.5, 40);
    blueLight.position.set(0, 8, -5);
    scene.add(blueLight);

    // ─── Floating Cubes ────────────────────────────────────────────────
    const cubes = [];
    const cubeCount = 18;

    for (let i = 0; i < cubeCount; i++) {
      const size = Math.random() * 0.5 + 0.2;
      const geometry = new THREE.BoxGeometry(size, size, size);

      const hue = Math.random() > 0.5 ? 0x00ffff : 0xff006e;
      const material = new THREE.MeshPhysicalMaterial({
        color: hue,
        metalness: 0.3,
        roughness: 0.2,
        transparent: true,
        opacity: 0.25 + Math.random() * 0.35,
        emissive: hue,
        emissiveIntensity: 0.15,
        wireframe: Math.random() > 0.6,
      });

      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      cube.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      cube.userData = {
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        rotSpeedZ: (Math.random() - 0.5) * 0.01,
        floatSpeed: 0.3 + Math.random() * 0.5,
        floatAmp: 0.3 + Math.random() * 0.7,
        initY: cube.position.y,
      };

      scene.add(cube);
      cubes.push(cube);
    }

    // ─── Particles ─────────────────────────────────────────────────────
    const particleCount = 600;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      // cyan or magenta tint
      if (Math.random() > 0.5) {
        colors[i * 3] = 0;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
      } else {
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0;
        colors[i * 3 + 2] = 0.43;
      }
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // ─── Central Icosahedron ───────────────────────────────────────────
    const icoGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const icoMat = new THREE.MeshPhysicalMaterial({
      color: 0x00ffff,
      metalness: 0.6,
      roughness: 0.1,
      transparent: true,
      opacity: 0.12,
      wireframe: true,
      emissive: 0x00ffff,
      emissiveIntensity: 0.2,
    });
    const icosahedron = new THREE.Mesh(icoGeo, icoMat);
    icosahedron.position.set(3.5, 0, -2);
    scene.add(icosahedron);

    // ─── Mouse Interaction ─────────────────────────────────────────────
    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // ─── Resize ────────────────────────────────────────────────────────
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ─── Animation Loop ────────────────────────────────────────────────
    const clock = new THREE.Clock();

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Cubes float & rotate
      cubes.forEach((c) => {
        c.rotation.x += c.userData.rotSpeedX;
        c.rotation.y += c.userData.rotSpeedY;
        c.rotation.z += c.userData.rotSpeedZ;
        c.position.y =
          c.userData.initY +
          Math.sin(elapsed * c.userData.floatSpeed) * c.userData.floatAmp;
      });

      // Particles drift
      particles.rotation.y = elapsed * 0.03;
      particles.rotation.x = Math.sin(elapsed * 0.02) * 0.1;

      // Icosahedron slow spin
      icosahedron.rotation.x = elapsed * 0.15;
      icosahedron.rotation.y = elapsed * 0.2;
      icosahedron.scale.setScalar(1 + Math.sin(elapsed * 0.5) * 0.08);

      // Dynamic lights
      cyanLight.position.x = Math.sin(elapsed * 0.5) * 6;
      cyanLight.position.y = Math.cos(elapsed * 0.3) * 5;
      magentaLight.position.x = Math.cos(elapsed * 0.4) * 6;
      magentaLight.position.y = Math.sin(elapsed * 0.6) * 4;

      // Mouse parallax
      camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.02;
      camera.position.y += (-mouse.y * 0.3 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    // ─── Cleanup ───────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="three-bg" />;
}
