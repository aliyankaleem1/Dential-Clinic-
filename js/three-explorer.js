// ========================================================
// js/three-explorer.js - Interactive 3D Explorer for Demo 3
// ========================================================

export function initExplorer3D(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const THREE = window.THREE;
  if (!THREE) {
    console.warn('Three.js not loaded on window');
    return;
  }

  container.innerHTML = '';

  const width = container.clientWidth || 550;
  const height = container.clientHeight || 550;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 8.5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Lighting
  const ambLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambLight);

  const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.2);
  dirLight1.position.set(5, 8, 5);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x818cf8, 1.4);
  dirLight2.position.set(-6, -4, -4);
  scene.add(dirLight2);

  const dirLight3 = new THREE.DirectionalLight(0x00f5d4, 1.2);
  dirLight3.position.set(0, -5, 4);
  scene.add(dirLight3);

  // Main container group
  const rootGroup = new THREE.Group();
  scene.add(rootGroup);

  // --- MATERIALS ---
  const crownMat = new THREE.MeshPhysicalMaterial({
    color: 0xfcfdfd,
    roughness: 0.12,
    metalness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08
  });

  const abutmentMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37, // medical gold-titanium nitride
    roughness: 0.25,
    metalness: 0.9
  });

  const screwMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8, // surgical titanium gray
    roughness: 0.3,
    metalness: 0.85
  });

  // --- 1. MONOLITHIC CROWN ---
  const crownGeo = new THREE.CylinderGeometry(0.85, 0.7, 1.2, 32);
  const crownMesh = new THREE.Mesh(crownGeo, crownMat);
  rootGroup.add(crownMesh);

  // --- 2. TITANIUM ABUTMENT ---
  const abutmentGeo = new THREE.CylinderGeometry(0.5, 0.38, 0.8, 32);
  const abutmentMesh = new THREE.Mesh(abutmentGeo, abutmentMat);
  rootGroup.add(abutmentMesh);

  // --- 3. IMPLANT FIXTURE / ROOT SCREW ---
  const screwGroup = new THREE.Group();

  const screwShaftGeo = new THREE.ConeGeometry(0.42, 2.2, 32);
  const screwShaft = new THREE.Mesh(screwShaftGeo, screwMat);
  screwShaft.rotation.x = Math.PI;
  screwGroup.add(screwShaft);

  // Screw Threads
  for (let i = 0; i < 7; i++) {
    const threadGeo = new THREE.TorusGeometry(0.38 - i * 0.035, 0.04, 12, 32);
    const thread = new THREE.Mesh(threadGeo, screwMat);
    thread.rotation.x = Math.PI / 2;
    thread.position.y = -0.7 + i * 0.22;
    screwGroup.add(thread);
  }

  rootGroup.add(screwGroup);

  // Connecting laser guide line
  const lineMat = new THREE.LineDashedMaterial({
    color: 0x38bdf8,
    dashSize: 0.15,
    gapSize: 0.1,
    transparent: true,
    opacity: 0.7
  });
  const lineGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 2.8, 0),
    new THREE.Vector3(0, -2.4, 0)
  ]);
  const guideLine = new THREE.Line(lineGeo, lineMat);
  guideLine.computeLineDistances();
  rootGroup.add(guideLine);

  // State
  let isExploded = true;
  let currentMode = 'implant';

  let targetCrownY = 2.4;
  let targetAbutmentY = 0.5;
  let targetScrewY = -1.8;

  // Window-level controllers
  window.setExplorerMode = function (mode) {
    currentMode = mode;
    if (mode === 'implant') {
      crownMesh.visible = true;
      abutmentMesh.visible = true;
      screwGroup.visible = true;
      guideLine.visible = isExploded;
      crownMat.transmission = 0;
      crownMat.color.setHex(0xfcfdfd);
    } else if (mode === 'whitening') {
      targetCrownY = 0.8;
      targetAbutmentY = -0.1;
      targetScrewY = -1.3;
      guideLine.visible = false;
      crownMat.color.setHex(0xffffff);
      crownMat.roughness = 0.05;
      crownMat.clearcoat = 1.0;
    } else if (mode === 'rootcanal') {
      targetCrownY = 0.8;
      targetAbutmentY = -0.1;
      targetScrewY = -1.3;
      guideLine.visible = false;
      crownMat.transmission = 0.85;
      crownMat.opacity = 0.6;
      crownMat.transparent = true;
      crownMat.roughness = 0.15;
    }
  };

  window.toggleImplantExplode = function () {
    isExploded = !isExploded;
    if (isExploded) {
      targetCrownY = 2.4;
      targetAbutmentY = 0.5;
      targetScrewY = -1.8;
      guideLine.visible = true;
    } else {
      targetCrownY = 0.8;
      targetAbutmentY = -0.1;
      targetScrewY = -1.3;
      guideLine.visible = false;
    }
    return isExploded;
  };

  // Drag interaction
  let isDragging = false;
  let prevMouseX = 0;
  let prevMouseY = 0;
  let targetRotY = 0.4;
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
      targetRotY += deltaX * 0.009;
      targetRotX += deltaY * 0.009;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    }
  });

  // Touch controls
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

  // Render loop
  function animate() {
    requestAnimationFrame(animate);

    crownMesh.position.y = THREE.MathUtils.lerp(crownMesh.position.y, targetCrownY, 0.08);
    abutmentMesh.position.y = THREE.MathUtils.lerp(abutmentMesh.position.y, targetAbutmentY, 0.08);
    screwGroup.position.y = THREE.MathUtils.lerp(screwGroup.position.y, targetScrewY, 0.08);

    if (!isDragging) {
      targetRotY += 0.004;
    }

    rootGroup.rotation.y = THREE.MathUtils.lerp(rootGroup.rotation.y, targetRotY, 0.08);
    rootGroup.rotation.x = THREE.MathUtils.lerp(rootGroup.rotation.x, targetRotX, 0.08);

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

if (typeof window !== 'undefined') {
  window.initExplorer3D = initExplorer3D;
}
