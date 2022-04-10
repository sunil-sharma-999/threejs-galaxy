import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
gui.hide();
gui.width = 350;

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

const parameters = {
  count: 144000,
  size: 0.003,
  radius: 10,
  branches: 6,
  spin: 1,
  randomness: 0.2,
  randomnessPower: 5,
  insideColor: 0xb33939,
  outsideColor: 0x4532ac,
};

/**
 * Galaxy
 */
let particleGeometry = null;
let particleMaterial = null;
let particle = null;
const generateGalaxy = () => {
  // destroy previous galaxy
  if (particle !== null) {
    particleGeometry.dispose();
    particleMaterial.dispose();
    scene.remove(particle);
  }

  particleGeometry = new THREE.BufferGeometry();

  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);

  const colorInside = new THREE.Color(parameters.insideColor);
  const colorOutside = new THREE.Color(parameters.outsideColor);

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;

    const radius = Math.random() * parameters.radius;
    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
    const spinAngle = radius * parameters.spin;

    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    const { r, g, b } = colorInside
      .clone()
      .lerp(colorOutside, radius / parameters.radius);
    colors[i3] = r;
    colors[i3 + 1] = g;
    colors[i3 + 2] = b;
  }

  particleGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3),
  );

  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  particleMaterial = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  particle = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particle);
};
generateGalaxy();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// fullscreen
window.addEventListener('dblclick', () => {
  if (!document.fullscreen) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.x = 2;
camera.position.y = 0.8;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();
  particle.rotation.y = elapsedTime * 0.2;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

// gui

// gui
//   .add(parameters, 'count')
//   .min(100)
//   .max(1000000)
//   .step(100)
//   .name('particle count')
//   .onFinishChange(generateGalaxy);
// gui
//   .add(parameters, 'size')
//   .min(0.001)
//   .max(0.1)
//   .step(0.001)
//   .name('particle size')
//   .onFinishChange(generateGalaxy);
// gui
//   .add(parameters, 'radius')
//   .min(0.01)
//   .max(20)
//   .step(0.01)
//   .name('particle radius')
//   .onFinishChange(generateGalaxy);
// gui
//   .add(parameters, 'branches')
//   .min(1)
//   .max(20)
//   .step(1)
//   .name('particle branches')
//   .onFinishChange(generateGalaxy);
// gui
//   .add(parameters, 'spin')
//   .min(-5)
//   .max(5)
//   .step(1)
//   .name('particle spin')
//   .onFinishChange(generateGalaxy);
// gui
//   .add(parameters, 'randomness')
//   .min(0)
//   .max(2)
//   .step(0.01)
//   .name('particle randomness')
//   .onFinishChange(generateGalaxy);
// gui
//   .add(parameters, 'randomnessPower')
//   .min(1)
//   .max(10)
//   .step(0.001)
//   .onFinishChange(generateGalaxy);
// gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);
// gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy);

// gui.add(camera.position, 'x').min(-10).max(10).step(0.1);
// gui.add(camera.position, 'y').min(-10).max(10).step(0.1);
// gui.add(camera.position, 'z').min(-10).max(10).step(0.1);
