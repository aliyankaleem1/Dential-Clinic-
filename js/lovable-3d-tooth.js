// ========================================================
// js/lovable-3d-tooth.js - Lovable Cinematic 3D Engine
// High-Impact Visuals • Smooth Camera Lerp • Zero Fluff
// ========================================================

export class LovableToothEngine {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.THREE = window.THREE;
    if (!this.THREE) {
      console.error('Three.js not found');
      return;
    }

    this.options = Object.assign({
      mode: 'natural',
      shade: 'OM1',
      autoRotate: true
    }, options);

    this.init();
  }

  init() {
    const THREE = this.THREE;
    this.container.innerHTML = '';

    this.width = this.container.clientWidth || 600;
    this.height = this.container.clientHeight || 580;

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(38, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 0.4, 7.5);

    // Target camera positions for smooth cinematic transitions
    this.camTargetPos = new THREE.Vector3(0, 0.4, 7.5);
    this.camTargetLook = new THREE.Vector3(0, 0, 0);
    this.camCurrentLook = new THREE.Vector3(0, 0, 0);

    // 2. High-End WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.container.appendChild(this.renderer.domElement);

    // 3. Cinematic Studio Lighting
    this.setupLighting();

    // 4. Mesh Groups
    this.mainGroup = new THREE.Group();
    this.scene.add(this.mainGroup);

    this.naturalGroup = new THREE.Group();
    this.implantGroup = new THREE.Group();
    this.mainGroup.add(this.naturalGroup);
    this.mainGroup.add(this.implantGroup);

    // 5. Build Meshes & FX
    this.buildNaturalAnatomy();
    this.buildTitaniumImplant();
    this.buildLaserGridFx();
    this.buildHoloAura();

    // 6. Interaction Variables
    this.isDragging = false;
    this.prevPointerX = 0;
    this.prevPointerY = 0;
    this.targetRotY = 0.4;
    this.targetRotX = 0.15;
    this.explodedFactor = 0;
    this.targetExploded = 0;

    this.setupInteractions();
    this.setMode(this.options.mode);
    this.setShade(this.options.shade);

    // 7. Render Loop
    this.clock = new THREE.Clock();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);

    window.addEventListener('resize', () => this.handleResize());
  }

  setupLighting() {
    const THREE = this.THREE;

    // Ambient baseline
    const ambient = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambient);

    // Neon Cyan Key Light
    this.keyLight = new THREE.DirectionalLight(0x00f2fe, 3.2);
    this.keyLight.position.set(6, 8, 6);
    this.scene.add(this.keyLight);

    // Specular Frost White Rim Light
    this.rimLight = new THREE.DirectionalLight(0xffffff, 3.0);
    this.rimLight.position.set(-6, 5, 4);
    this.scene.add(this.rimLight);

    // Mint Bottom Bounce
    const mintBounce = new THREE.PointLight(0x00f5d4, 2.0, 15);
    mintBounce.position.set(0, -4, 3);
    this.scene.add(mintBounce);

    // Deep Electric Blue Fill
    const fillLight = new THREE.DirectionalLight(0x4facfe, 1.4);
    fillLight.position.set(0, -6, -4);
    this.scene.add(fillLight);
  }

  buildNaturalAnatomy() {
    const THREE = this.THREE;

    // Swiss Enamel (Glass-ceramic high refractive material)
    this.enamelMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0x011b2b,
      emissiveIntensity: 0.15,
      roughness: 0.08,
      metalness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      reflectivity: 0.98,
      transmission: 0.12,
      thickness: 1.6,
      transparent: true,
      opacity: 1.0
    });

    // Sub-enamel Dentin
    this.dentinMat = new THREE.MeshStandardMaterial({
      color: 0xf6ecd4,
      roughness: 0.3,
      metalness: 0.05,
      transparent: true,
      opacity: 0.0
    });

    // Bioluminescent Nerve Pulp (Electric Cyan Glow)
    this.pulpMat = new THREE.MeshStandardMaterial({
      color: 0x00f5d4,
      emissive: 0x00f2fe,
      emissiveIntensity: 1.2,
      roughness: 0.15,
      metalness: 0.2,
      transparent: true,
      opacity: 0.0
    });

    // Natural Root Material
    this.rootMat = new THREE.MeshStandardMaterial({
      color: 0xeee7d1,
      roughness: 0.35,
      metalness: 0.04
    });

    // Crown Assembly
    this.crownGroup = new THREE.Group();

    // 4 Occlusal Cusps
    const cuspGeo = new THREE.SphereGeometry(0.82, 32, 24);
    cuspGeo.scale(1.02, 1.2, 0.98);
    const cuspPositions = [
      [-0.56, 0.48, -0.56],
      [0.56, 0.48, -0.56],
      [-0.56, 0.48, 0.56],
      [0.56, 0.48, 0.56]
    ];
    cuspPositions.forEach(p => {
      const cusp = new THREE.Mesh(cuspGeo, this.enamelMat);
      cusp.position.set(p[0], p[1], p[2]);
      this.crownGroup.add(cusp);
    });

    // Crown Body
    const bodyGeo = new THREE.CylinderGeometry(1.22, 1.05, 1.25, 36, 16);
    const bodyMesh = new THREE.Mesh(bodyGeo, this.enamelMat);
    bodyMesh.position.y = -0.12;
    this.crownGroup.add(bodyMesh);

    // Inner Dentin
    const dentinGeo = new THREE.CylinderGeometry(1.04, 0.86, 1.1, 32);
    this.dentinMesh = new THREE.Mesh(dentinGeo, this.dentinMat);
    this.dentinMesh.position.y = -0.12;
    this.crownGroup.add(this.dentinMesh);

    // Pulp Core + Nerve Roots
    this.pulpGroup = new THREE.Group();
    const pulpCenter = new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 20), this.pulpMat);
    pulpCenter.position.y = -0.15;
    this.pulpGroup.add(pulpCenter);

    [[-0.45, -1.2, -0.25], [0.45, -1.2, -0.25], [0.0, -1.3, 0.35]].forEach(n => {
      const nerve = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.02, 1.6, 16), this.pulpMat);
      nerve.position.set(n[0], n[1], n[2]);
      this.pulpGroup.add(nerve);
    });
    this.crownGroup.add(this.pulpGroup);
    this.naturalGroup.add(this.crownGroup);

    // Triple Anatomical Roots
    this.rootGroup = new THREE.Group();
    const roots = [
      { x: -0.52, y: -1.45, z: -0.32, rotZ: -0.14, rotX: 0.08 },
      { x: 0.52, y: -1.45, z: -0.32, rotZ: 0.14, rotX: 0.08 },
      { x: 0.0, y: -1.55, z: 0.42, rotZ: 0.0, rotX: -0.15 }
    ];
    roots.forEach(r => {
      const rMesh = new THREE.Mesh(new THREE.ConeGeometry(0.42, 2.1, 28), this.rootMat);
      rMesh.position.set(r.x, r.y, r.z);
      rMesh.rotation.set(r.rotX, 0, r.rotZ);
      this.rootGroup.add(rMesh);
    });
    this.naturalGroup.add(this.rootGroup);

    // Neon Cervical Ring
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.08, 0.04, 16, 48),
      new THREE.MeshStandardMaterial({ color: 0x00f2fe, emissive: 0x00f2fe, emissiveIntensity: 0.6 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.72;
    this.naturalGroup.add(ring);
  }

  buildTitaniumImplant() {
    const THREE = this.THREE;

    this.zirconiaMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.06,
      metalness: 0.05,
      clearcoat: 1.0,
      reflectivity: 0.99
    });

    this.goldAbutmentMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Titanium Nitride Gold
      roughness: 0.2,
      metalness: 0.95
    });

    this.titaniumScrewMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8, // Grade 5 Titanium
      roughness: 0.28,
      metalness: 0.9
    });

    // 1. Zirconia Crown
    this.implantCrown = new THREE.Group();
    const cMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 0.92, 1.3, 32), this.zirconiaMat);
    this.implantCrown.add(cMesh);
    this.implantCrown.position.y = 0.5;
    this.implantGroup.add(this.implantCrown);

    // 2. Gold Abutment
    this.implantAbutment = new THREE.Group();
    const abMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.42, 0.95, 32), this.goldAbutmentMat);
    this.implantAbutment.add(abMesh);
    const hex = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.4, 6), this.goldAbutmentMat);
    hex.position.y = 0.55;
    this.implantAbutment.add(hex);
    this.implantAbutment.position.y = -0.4;
    this.implantGroup.add(this.implantAbutment);

    // 3. Titanium Root Screw
    this.implantScrew = new THREE.Group();
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.22, 2.5, 32), this.titaniumScrewMat);
    this.implantScrew.add(shaft);

    for (let i = 0; i < 9; i++) {
      const thread = new THREE.Mesh(new THREE.TorusGeometry(0.46 - i * 0.026, 0.045, 12, 32), this.titaniumScrewMat);
      thread.rotation.x = Math.PI / 2;
      thread.position.y = 0.9 - i * 0.22;
      this.implantScrew.add(thread);
    }
    this.implantScrew.position.y = -2.1;
    this.implantGroup.add(this.implantScrew);

    this.implantGroup.visible = false;
  }

  buildLaserGridFx() {
    const THREE = this.THREE;
    this.laserScanner = new THREE.Group();

    // Laser Beam Ring
    const beamRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.68, 0.028, 16, 64),
      new THREE.MeshBasicMaterial({ color: 0x00f5d4, transparent: true, opacity: 0.9 })
    );
    beamRing.rotation.x = Math.PI / 2;
    this.laserScanner.add(beamRing);

    // Translucent Laser Disc
    const disc = new THREE.Mesh(
      new THREE.CircleGeometry(1.68, 32),
      new THREE.MeshBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.14, side: THREE.DoubleSide })
    );
    disc.rotation.x = Math.PI / 2;
    this.laserScanner.add(disc);

    this.mainGroup.add(this.laserScanner);
  }

  buildHoloAura() {
    const THREE = this.THREE;
    this.haloAura = new THREE.Group();

    const haloGeo = new THREE.TorusGeometry(2.4, 0.012, 16, 80);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.2 });

    const h1 = new THREE.Mesh(haloGeo, haloMat);
    h1.rotation.x = Math.PI / 2.2;
    this.haloAura.add(h1);

    const h2 = new THREE.Mesh(haloGeo, haloMat);
    h2.rotation.y = Math.PI / 2.5;
    this.haloAura.add(h2);

    this.mainGroup.add(this.haloAura);
  }

  setMode(mode) {
    this.options.mode = mode;

    if (mode === 'natural') {
      this.naturalGroup.visible = true;
      this.implantGroup.visible = false;
      this.enamelMat.opacity = 1.0;
      this.dentinMat.opacity = 0.0;
      this.pulpMat.opacity = 0.0;
      this.targetExploded = 0;
      this.camTargetPos.set(0, 0.4, 7.5);
      this.camTargetLook.set(0, 0, 0);
    } else if (mode === 'xray') {
      this.naturalGroup.visible = true;
      this.implantGroup.visible = false;
      this.enamelMat.opacity = 0.28;
      this.dentinMat.opacity = 0.55;
      this.pulpMat.opacity = 1.0;
      this.targetExploded = 0;
      this.camTargetPos.set(0, 0.2, 6.8);
      this.camTargetLook.set(0, -0.3, 0);
    } else if (mode === 'implant') {
      this.naturalGroup.visible = false;
      this.implantGroup.visible = true;
      this.targetExploded = 1.0;
      this.camTargetPos.set(0, -0.2, 8.8);
      this.camTargetLook.set(0, -0.5, 0);
    } else if (mode === 'whitening') {
      this.naturalGroup.visible = true;
      this.implantGroup.visible = false;
      this.enamelMat.opacity = 1.0;
      this.dentinMat.opacity = 0.0;
      this.pulpMat.opacity = 0.0;
      this.targetExploded = 0;
      this.camTargetPos.set(0, 0.8, 6.4);
      this.camTargetLook.set(0, 0.3, 0);
    }
  }

  setShade(shadeCode) {
    this.options.shade = shadeCode;
    const palette = {
      'OM1': { hex: 0xffffff, rough: 0.05, clear: 1.0, glow: 0x011b2b },
      'OM3': { hex: 0xf9fafb, rough: 0.08, clear: 0.98, glow: 0x021727 },
      'B1':  { hex: 0xf4f7fa, rough: 0.11, clear: 0.95, glow: 0x021727 },
      'A1':  { hex: 0xeff2ea, rough: 0.15, clear: 0.90, glow: 0x031522 },
      'A2':  { hex: 0xe8e3cb, rough: 0.22, clear: 0.80, glow: 0x05131d },
      'A3':  { hex: 0xdbd1ad, rough: 0.32, clear: 0.65, glow: 0x06111a }
    };
    const c = palette[shadeCode] || palette['OM1'];
    if (this.enamelMat) {
      this.enamelMat.color.setHex(c.hex);
      this.enamelMat.roughness = c.rough;
      this.enamelMat.clearcoat = c.clear;
      this.enamelMat.emissive.setHex(c.glow);
    }
    if (this.zirconiaMat) {
      this.zirconiaMat.color.setHex(c.hex);
      this.zirconiaMat.roughness = c.rough;
    }
  }

  focusPreset(preset) {
    if (preset === 'crown') {
      this.setMode('natural');
      this.targetRotX = 0.45;
      this.targetRotY = 0.2;
      this.camTargetPos.set(0, 1.0, 5.8);
      this.camTargetLook.set(0, 0.4, 0);
    } else if (preset === 'root') {
      this.setMode('natural');
      this.targetRotX = -0.3;
      this.targetRotY = 0.5;
      this.camTargetPos.set(0, -1.2, 6.2);
      this.camTargetLook.set(0, -1.2, 0);
    } else if (preset === 'implant') {
      this.setMode('implant');
    } else if (preset === 'xray') {
      this.setMode('xray');
    }
  }

  reset() {
    this.targetRotY = 0.4;
    this.targetRotX = 0.15;
    this.camTargetPos.set(0, 0.4, 7.5);
    this.camTargetLook.set(0, 0, 0);
  }

  setupInteractions() {
    const el = this.container;

    el.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.prevPointerX = e.clientX;
      this.prevPointerY = e.clientY;
      el.style.cursor = 'grabbing';
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
      el.style.cursor = 'grab';
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const dx = e.clientX - this.prevPointerX;
        const dy = e.clientY - this.prevPointerY;
        this.targetRotY += dx * 0.009;
        this.targetRotX += dy * 0.009;
        this.targetRotX = Math.max(-0.6, Math.min(0.8, this.targetRotX));
        this.prevPointerX = e.clientX;
        this.prevPointerY = e.clientY;
      }
    });

    // Touch
    el.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.prevPointerX = e.touches[0].clientX;
        this.prevPointerY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => { this.isDragging = false; });
    window.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 1) {
        const dx = e.touches[0].clientX - this.prevPointerX;
        const dy = e.touches[0].clientY - this.prevPointerY;
        this.targetRotY += dx * 0.01;
        this.targetRotX += dy * 0.01;
        this.targetRotX = Math.max(-0.6, Math.min(0.8, this.targetRotX));
        this.prevPointerX = e.touches[0].clientX;
        this.prevPointerY = e.touches[0].clientY;
      }
    }, { passive: true });
  }

  handleResize() {
    if (!this.container) return;
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  animate() {
    requestAnimationFrame(this.animate);
    const THREE = this.THREE;
    const time = this.clock.getElapsedTime();

    // Auto rotate when idle
    if (!this.isDragging && this.options.autoRotate) {
      this.targetRotY += 0.004;
    }

    // Smooth Lerp Rotations
    this.mainGroup.rotation.y = THREE.MathUtils.lerp(this.mainGroup.rotation.y, this.targetRotY, 0.08);
    this.mainGroup.rotation.x = THREE.MathUtils.lerp(this.mainGroup.rotation.x, this.targetRotX, 0.08);

    // Smooth Camera Transition Lerp
    this.camera.position.lerp(this.camTargetPos, 0.06);
    this.camCurrentLook.lerp(this.camTargetLook, 0.06);
    this.camera.lookAt(this.camCurrentLook);

    // Exploded View separation animation
    this.explodedFactor = THREE.MathUtils.lerp(this.explodedFactor, this.targetExploded, 0.07);
    if (this.implantGroup.visible) {
      this.implantCrown.position.y = 0.5 + this.explodedFactor * 1.6;
      this.implantAbutment.position.y = -0.4 + this.explodedFactor * 0.45;
      this.implantScrew.position.y = -2.1 - this.explodedFactor * 0.85;
    }

    // Laser Scan Beam Wave
    if (this.laserScanner) {
      const scanY = Math.sin(time * 2.5) * 1.9;
      this.laserScanner.position.y = scanY;
    }

    // Halo Rotation
    if (this.haloAura) {
      this.haloAura.rotation.z = time * 0.15;
    }

    // X-Ray Nerve Pulse
    if (this.options.mode === 'xray') {
      this.pulpMat.emissiveIntensity = 1.0 + Math.sin(time * 4) * 0.5;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
