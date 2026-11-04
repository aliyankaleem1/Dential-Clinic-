// ========================================================
// js/app.js - Master Controller for All 3 Dental Demos
// ========================================================

// Global state
let currentActiveDemo = 'demo1';
let tooth3dInitialized = false;
let explorer3dInitialized = false;

// ==========================================
// 1. DEMO SWITCHER LOGIC
// ==========================================
export function switchDemo(demoId) {
  if (!['demo1', 'demo2', 'demo3'].includes(demoId)) {
    demoId = 'demo1';
  }
  currentActiveDemo = demoId;
  try {
    window.location.hash = demoId;
  } catch (e) {}

  // Update switcher buttons UI
  document.querySelectorAll('[data-demo-btn]').forEach(btn => {
    if (btn.getAttribute('data-demo-btn') === demoId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Toggle demo view containers
  const demos = ['demo1', 'demo2', 'demo3'];
  demos.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (id === demoId) {
        el.style.display = 'block';
        el.classList.add('fade-in');
      } else {
        el.style.display = 'none';
        el.classList.remove('fade-in');
      }
    }
  });

  // Lazy-initialize 3D scenes when corresponding demo is opened
  if (demoId === 'demo1' && !tooth3dInitialized) {
    tooth3dInitialized = true;
    setTimeout(() => {
      import('./three-tooth.js')
        .then(mod => {
          if (mod && mod.initTooth3D) {
            mod.initTooth3D('tooth-canvas-container');
          }
        })
        .catch(err => console.warn('3D Tooth load warning:', err));
    }, 80);
  } else if (demoId === 'demo3' && !explorer3dInitialized) {
    explorer3dInitialized = true;
    setTimeout(() => {
      import('./three-explorer.js')
        .then(mod => {
          if (mod && mod.initExplorer3D) {
            mod.initExplorer3D('explorer-canvas-container');
          }
        })
        .catch(err => console.warn('3D Explorer load warning:', err));
    }, 80);
  }

  // Smooth scroll to top of viewport
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Make accessible globally on window immediately
window.switchDemo = switchDemo;

function setupDemoSwitcher() {
  const buttons = document.querySelectorAll('[data-demo-btn]');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetDemo = btn.getAttribute('data-demo-btn');
      switchDemo(targetDemo);
    });
  });
}

// ==========================================
// 2. DEMO 1: BENTO SPOTLIGHT EFFECT
// ==========================================
function setupBentoSpotlight() {
  const bentoCards = document.querySelectorAll('.bento-spotlight');
  bentoCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// ==========================================
// 3. DEMO 2: BEFORE/AFTER SMILE SLIDER
// ==========================================
function setupSmileSlider() {
  const container = document.getElementById('smile-comparison-box');
  const handle = document.getElementById('slider-drag-handle');
  const afterImg = document.getElementById('smile-after-img');
  if (!container || !handle || !afterImg) return;

  let isSliding = false;

  function updateSliderPosition(clientX) {
    const rect = container.getBoundingClientRect();
    let posX = clientX - rect.left;
    if (posX < 0) posX = 0;
    if (posX > rect.width) posX = rect.width;
    const percentage = (posX / rect.width) * 100;

    handle.style.left = `${percentage}%`;
    afterImg.style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;
  }

  handle.addEventListener('mousedown', () => { isSliding = true; });
  container.addEventListener('mousedown', (e) => {
    isSliding = true;
    updateSliderPosition(e.clientX);
  });
  window.addEventListener('mouseup', () => { isSliding = false; });
  window.addEventListener('mousemove', (e) => {
    if (isSliding) {
      e.preventDefault();
      updateSliderPosition(e.clientX);
    }
  });

  // Touch support for mobile devices
  handle.addEventListener('touchstart', () => { isSliding = true; }, { passive: true });
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isSliding = true;
      updateSliderPosition(e.touches[0].clientX);
    }
  }, { passive: true });
  window.addEventListener('touchend', () => { isSliding = false; });
  window.addEventListener('touchmove', (e) => {
    if (isSliding && e.touches.length === 1) {
      updateSliderPosition(e.touches[0].clientX);
    }
  }, { passive: true });
}

// ==========================================
// 4. DEMO 2: TREATMENT COST CALCULATOR
// ==========================================
function setupCostCalculator() {
  const serviceChips = document.querySelectorAll('.calc-service-chip');
  const teethSlider = document.getElementById('calc-teeth-slider');
  const teethCountDisplay = document.getElementById('calc-teeth-count');
  const costDisplay = document.getElementById('calc-cost-display');
  const visitsDisplay = document.getElementById('calc-visits-display');
  const timeDisplay = document.getElementById('calc-time-display');

  if (!serviceChips.length || !teethSlider) return;

  let baseRate = 120; // Default Whitening
  let currentService = 'Laser Whitening';

  function recalculate() {
    const teeth = parseInt(teethSlider.value, 10);
    if (teethCountDisplay) {
      teethCountDisplay.textContent = teeth === 1 ? '1 Tooth / Zone' : `${teeth} Teeth / Full Arch`;
    }

    let total = baseRate * teeth;
    let visits = '1 Visit (60 mins)';
    let recovery = 'Instant Results';

    if (currentService === 'Dental Implants') {
      total = teeth * 650;
      visits = '2 - 3 Visits';
      recovery = 'Lifetime Warranty';
    } else if (currentService === 'Clear Aligners') {
      total = 1400 + teeth * 40;
      visits = 'Monthly Checkup';
      recovery = '4 - 6 Months';
    } else if (currentService === 'Porcelain Veneers') {
      total = teeth * 350;
      visits = '2 Visits (Custom shade)';
      recovery = 'Same-Day Preview';
    } else if (currentService === 'Painless Root Canal') {
      total = teeth * 180;
      visits = '1 - 2 Visits';
      recovery = 'Immediate Pain Relief';
    }

    if (costDisplay) costDisplay.textContent = `$${total.toLocaleString()}`;
    if (visitsDisplay) visitsDisplay.textContent = visits;
    if (timeDisplay) timeDisplay.textContent = recovery;
  }

  serviceChips.forEach(chip => {
    chip.addEventListener('click', () => {
      serviceChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      baseRate = parseInt(chip.getAttribute('data-rate'), 10);
      currentService = chip.getAttribute('data-name');
      recalculate();
    });
  });

  teethSlider.addEventListener('input', recalculate);
  recalculate();
}

// ==========================================
// 5. DEMO 2: INTERACTIVE TIME-SLOT BOOKING
// ==========================================
function setupSlotBooking() {
  const doctorChips = document.querySelectorAll('.slot-doctor-chip');
  const dayChips = document.querySelectorAll('.slot-day-chip');
  const timeChips = document.querySelectorAll('.slot-time-chip');
  const bookBtn = document.getElementById('slot-confirm-btn');
  const modal = document.getElementById('booking-success-modal');
  const modalClose = document.getElementById('modal-close-btn');

  doctorChips.forEach(chip => {
    chip.addEventListener('click', () => {
      doctorChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  dayChips.forEach(chip => {
    chip.addEventListener('click', () => {
      dayChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  timeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      timeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  if (bookBtn && modal) {
    bookBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const activeDoc = document.querySelector('.slot-doctor-chip.active')?.textContent.trim() || 'Dr. Ahmed Khan';
      const activeDay = document.querySelector('.slot-day-chip.active')?.textContent.trim() || 'Today';
      const activeTime = document.querySelector('.slot-time-chip.active')?.textContent.trim() || '10:30 AM';

      const docSummary = document.getElementById('modal-doc-summary');
      const timeSummary = document.getElementById('modal-time-summary');
      const bookingId = document.getElementById('modal-booking-id');

      if (docSummary) docSummary.textContent = activeDoc;
      if (timeSummary) timeSummary.textContent = `${activeDay} at ${activeTime}`;
      if (bookingId) bookingId.textContent = 'SC-' + Math.floor(100000 + Math.random() * 900000);

      modal.classList.add('open');
    });
  }

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }
}

// ==========================================
// 6. DEMO 3: 3D EXPLORER CONTROLS
// ==========================================
function setupExplorerControls() {
  const tabs = document.querySelectorAll('.explorer-tab-btn');
  const explodeBtn = document.getElementById('explode-toggle-btn');
  const infoBox = document.getElementById('explorer-info-text');

  const descriptions = {
    implant: 'Titanium grade-5 implant fixture with osseointegrated screw threads, custom gold-nitride abutment, and monolithic zirconia crown.',
    whitening: 'Advanced Zoom 32% hydrogen peroxide activation simulated with high-luster pearlescent ceramic enamel coating.',
    rootcanal: 'Biocompatible gutta-percha apex canal seal with illuminated pulp cavity chamber, saving your natural tooth with 0 pain.'
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const mode = tab.getAttribute('data-mode');
      if (window.setExplorerMode) {
        window.setExplorerMode(mode);
      }
      if (infoBox && descriptions[mode]) {
        infoBox.textContent = descriptions[mode];
      }
      if (explodeBtn) {
        explodeBtn.style.display = mode === 'implant' ? 'inline-flex' : 'none';
      }
    });
  });

  if (explodeBtn) {
    explodeBtn.addEventListener('click', () => {
      if (window.toggleImplantExplode) {
        const state = window.toggleImplantExplode();
        explodeBtn.textContent = state ? '⚡ Assemble 3D Model' : '🔬 Explode 3D Anatomy';
      }
    });
  }
}

// ==========================================
// MASTER INITIALIZER
// ==========================================
function initApp() {
  try {
    setupDemoSwitcher();
    setupBentoSpotlight();
    setupSmileSlider();
    setupCostCalculator();
    setupSlotBooking();
    setupExplorerControls();

    const hash = window.location.hash.replace('#', '') || 'demo1';
    switchDemo(hash);
  } catch (err) {
    console.error('App init error:', err);
    // Fallback: force show demo1
    const d1 = document.getElementById('demo1');
    if (d1) d1.style.display = 'block';
  }
}

// Check document ready state immediately
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
