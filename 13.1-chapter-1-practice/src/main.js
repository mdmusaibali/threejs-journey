import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

//////////// Canvas
const canvasEl = document.getElementById("webgl");
console.log(canvasEl);

//////////// Scene
const scene = new THREE.Scene();

//////////// Laaders
const textureLoader = new THREE.TextureLoader();
const fontLoader = new FontLoader();

//////////// textures
const aoTexture = textureLoader.load(
  "./textures/rock_2k/rock_wall_10_ao_2k.jpg"
);
const armTexture = textureLoader.load(
  "./textures/rock_2k/rock_wall_10_arm_2k.jpg"
);
const colorTexture = textureLoader.load(
  "./textures/rock_2k/rock_wall_10_diff_2k.jpg"
);
const dispTexture = textureLoader.load(
  "./textures/rock_2k/rock_wall_10_disp_2k.png"
);
const norGLTexture = textureLoader.load(
  "./textures/rock_2k/rock_wall_10_nor_gl_2k.jpg"
);
const roughTexture = textureLoader.load(
  "./textures/rock_2k/rock_wall_10_rough_2k.jpg"
);
const matcapTexture = textureLoader.load("./textures/matcaps/8.png");

//////////// texture configuration
colorTexture.repeat.x = 1;
colorTexture.repeat.y = 1;
colorTexture.wrapS = THREE.MirroredRepeatWrapping;
colorTexture.wrapT = THREE.MirroredRepeatWrapping;
colorTexture.colorSpace = THREE.SRGBColorSpace;
matcapTexture.colorSpace = THREE.SRGBColorSpace;

//////////// Axes Helper
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

//////////// OBJECTS
const sphereGeometry = new THREE.SphereGeometry(1, 400, 400);
const sphereMaterial = new THREE.MeshStandardMaterial({});
sphereMaterial.side = THREE.DoubleSide;
sphereMaterial.map = colorTexture;
sphereMaterial.aoMap = aoTexture;
sphereMaterial.normalMap = norGLTexture;
sphereMaterial.roughnessMap = roughTexture;
sphereMaterial.displacementMap = dispTexture;
sphereMaterial.displacementScale = 0.2;
sphereMaterial.metalnessMap = armTexture;
// sphereMaterial.roughness = 0
// sphereMaterial.metalness = 0
// sphereMaterial.ior = 6

//////////// Text
fontLoader.load("./font/helvetiker_regular.typeface.json", (font) => {
  const size = 1.2;
  const geometry = new TextGeometry("Musaib", {
    font: font,
    size: size,
    depth: size * 0.3,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: size * 0.04,
    bevelSize: size * 0.04,
    bevelOffset: 0,
    bevelSegments: size * 5,
  });
  geometry.center();
  const material = new THREE.MeshMatcapMaterial();
  material.matcap = matcapTexture;
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // boulders
  for (let i = 0; i < 50; i++) {
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

    sphereMesh.position.x = (Math.random() - 0.5) * 20;
    sphereMesh.position.y = (Math.random() - 0.5) * 20;
    sphereMesh.position.z = (Math.random() - 0.5) * 20;
    sphereMesh.rotation.x = Math.random() * Math.PI;
    sphereMesh.rotation.y = Math.random() * Math.PI;
    const scale = Math.random();
    sphereMesh.scale.set(scale, scale, scale);
    scene.add(sphereMesh);
  }
});

//////////// Light
// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

//////////// Background
const rgbeLoader = new RGBELoader();
rgbeLoader.load(
  "./textures/environmentMap/brown_photostudio_02_2k.hdr",
  (envMap) => {
    envMap.mapping = THREE.EquirectangularReflectionMapping;

    scene.background = envMap;
    scene.environment = envMap;
  }
);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", (evt) => {
  const { innerWidth, innerHeight } = evt.target;
  sizes.width = innerWidth;
  sizes.height = innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
// camera.position.x = 1;
// camera.position.y = 1;
camera.position.z = 7;
scene.add(camera);

// Orbit
const orbitControl = new OrbitControls(camera, canvasEl);
orbitControl.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas: canvasEl });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

const clock = new THREE.Clock();

const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  orbitControl.update();

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();
