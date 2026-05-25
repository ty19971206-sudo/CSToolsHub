import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let frameId = 0;
    let paused = false;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
      camera.position.z = 4.2;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      const geometry = new THREE.IcosahedronGeometry(1.35, 1);
      const material = new THREE.MeshBasicMaterial({
        color: 0x5b9fd4,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const particles = new THREE.BufferGeometry();
      const count = 120;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 6;
      }
      particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const points = new THREE.Points(
        particles,
        new THREE.PointsMaterial({ color: 0x9ecfff, size: 0.03, transparent: true, opacity: 0.6 })
      );
      scene.add(points);

      const resize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (w === 0 || h === 0) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer!.setSize(w, h);
      };

      const observer = new IntersectionObserver(
        ([entry]) => {
          paused = !entry.isIntersecting;
        },
        { threshold: 0.05 }
      );
      observer.observe(container);

      const ro = new ResizeObserver(resize);
      ro.observe(container);
      resize();

      const animate = () => {
        frameId = requestAnimationFrame(animate);
        if (!paused) {
          mesh.rotation.x += 0.002;
          mesh.rotation.y += 0.0035;
          points.rotation.y -= 0.001;
        }
        renderer!.render(scene, camera);
      };
      animate();

      return () => {
        cancelAnimationFrame(frameId);
        observer.disconnect();
        ro.disconnect();
        geometry.dispose();
        material.dispose();
        particles.dispose();
        (points.material as THREE.Material).dispose();
        renderer?.dispose();
        if (renderer?.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      };
    } catch {
      container.style.display = 'none';
      return undefined;
    }
  }, []);

  return <div className="hero-canvas" ref={containerRef} aria-hidden="true" />;
}
