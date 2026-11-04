// ===================================================
// js/three-tooth.js - Interactive 3D Tooth for Demo 1
// ===================================================

export function initTooth3D(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const THREE = window.THREE;
  if (!THREE) {
    console.warn('Three.js not loaded on window');
    return;
  }

  container.innerHTML = '';

  const width = container.clientWidth || 450;
  const height = container.clientHeight || 500;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 7.5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const toothGroup = new THREE.Group();
  scene.add(toothGroup);

  // Materials
  const enamelMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf8fcff,
    emissive: 0x051a2e,
    emissiveIntensity: 0.15,
    roughness: 0.12,
    metalness: 0.08,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    reflectivity: 0.9,
    transmission: 0.08,
    thickness: 1.2
  });

  const rootMaterial = new THREE.MeshStandardMaterial({
    color: 0xf0edd4,
    roughness: 0.45,
    metalness: 0.04
  });

  // Crown (Molar Anatomy)
  const crownGroup = new THREE.Group();

  const cuspGeo = new THREE.SphereGeometry(0.85, 32, 24);
  cuspGeo.scale(1.0, 1.2, 0.95);

  const cuspPositions = [
    [-0.58, 0.45, -0.58],
    [0.58, 0.45, -0.58],
    [-0.58, 0.45, 0.58],
    [0.58, 0.45, 0.58]
  ];

  cuspPositions.forEach(pos => {
    const cusp = new THREE.Mesh(cuspGeo, enamelMaterial);
    cusp.position.set(pos[0], pos[1], pos[2]);
    crownGroup.add(cusp);
  });

  const bodyGeo = new THREE.CylinderGeometry(1.2, 1.05, 1.1, 32);
  const crownBody = new THREE.Mesh(bodyGeo, enamelMaterial);
  crownBody.position.y = -0.15;
  crownGroup.add(crownBody);

  toothGroup.add(crownGroup);

  // Roots
  const rootGroup = new THREE.Group();
  const rootPositions = [
    [-0.55, -1.35, -0.35, 0.09, 0, -0.12],
    [0.55, -1.35, -0.35, 0.09, 0, 0.12],
    [0.0, -1.45, 0.45, -0.12, 0, 0.0]
  ];

  rootPositions.forEach(r => {
    const rGeo = new THREE.ConeGeometry(0.42, 1.9, 24);
    rGeo.scale(1, 1, 0.85);
    const rootMesh = new THREE.Mesh(rGeo, rootMaterial);
    rootMesh.position.set(r[0], r[1], r[2]);
    rootMesh.rotation.set(r[3], r[4], r[5]);
    rootGroup.add(rootMesh);
  });

  toothGroup.add(rootGroup);

  // Futuristic Holo-Rings
  const ringGeo1 = new THREE.TorusGeometry(1.9, 0.018, 16, 100);
  const ringMat1 = new THREE.MeshBasicMaterial({
    color: 0x00f5d4,
    transparent: true,
    opacity: 0.55
  });
  const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
  ring1.rotation.x = Math.PI / 2.3;
  toothGroup.add(ring1);

  const ringGeo2 = new THREE.TorusGeometry(2.2, 0.012, 16, 100);
  const ringMat2 = new THREE.MeshBasicMaterial({
    color: 0x00b4d8,
    transparent: true,
    opacity: 0.35
  });
  const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
  ring2.rotation.x = Math.PI / 1.8;
  ring2.rotation.y = 0.3;
  toothGroup.add(ring2);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const cyanKeyLight = new THREE.DirectionalLight(0x00f5d4, 2.2);
  cyanKeyLight.position.set(4, 5, 4);
  scene.add(cyanKeyLight);

  const blueFillLight = new THREE.DirectionalLight(0x00b4d8, 1.6);
  blueFillLight.position.set(-4, -2, -3);
  scene.add(blueFillLight);

  const warmRimLight = new THREE.DirectionalLight(0xfff7ed, 1.2);
  warmRimLight.position.set(0, -6, 2);
  scene.add(warmRimLight);

  const pointGlow = new THREE.PointLight(0x00f5d4, 1.5, 6);
  pointGlow.position.set(0, 0.5, 1.5);
  scene.add(pointGlow);

  toothGroup.position.y = 0.15;

  // Mouse interaction
  let isDragging = false;
  let prevMouseX = 0;
  let prevMouseY = 0;
  let targetRotY = 0.3;
  let targetRotX = 0.1;

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      targetRotY += deltaX * 0.008;
      targetRotX += deltaY * 0.008;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    }
  });

  // Touch
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => { isDragging = false; });

  window.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      targetRotY += deltaX * 0.01;
      targetRotX += deltaY * 0.01;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    if (!isDragging) {
      targetRotY += 0.006;
    }

    toothGroup.rotation.y = THREE.MathUtils.lerp(toothGroup.rotation.y, targetRotY, 0.07);
    toothGroup.rotation.x = THREE.MathUtils.lerp(toothGroup.rotation.x, targetRotX, 0.07);

    ring1.rotation.z += 0.008;
    ring2.rotation.z -= 0.005;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

// Attach to window so it is accessible from both modules and non-modules
if (typeof window !== 'undefined') {
  window.initTooth3D = initTooth3D;
}
