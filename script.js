/**
 * PRECISION DENTISTRY — Photorealistic Tooth Interactive Engine & Clinical Interactions
 * Replicating the exact functionality from the reference video:
 * - Photorealistic human dental tooth with glossy enamel and natural specular highlights
 * - Real-time 3D mouse parallax and floating physics
 * - Holographic laser scanning ring orbiting the tooth (Video 00:01 - 00:05)
 * - Anatomical X-Ray / Cross-Section reveal with Dentin, Pulp & Root Canal (Video 00:03)
 * - Interactive floating feature pills (3D SCAN, ADVANCED CARE, etc.) (Video 00:06 - 00:07)
 */

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }
  initNavigation();
  initHeaderScroll();
  initToothInteractiveStage();
  initTooth3dParallax();
  initMobileDrawer();
  initBookingDate();
  initDoctorSchedules();
});

/* ==========================================================================
   NAVIGATION CLICK & SCROLLSPY (Active Link Selection)
   ========================================================================== */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-menu .nav-link:not([onclick])');
  const mobileLinks = document.querySelectorAll('.mobile-links .mobile-link:not([onclick])');
  const sections = document.querySelectorAll('section[id]');
  const headerHeight = 85;

  // Click handler for desktop nav links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          e.preventDefault();

          // Immediately set active state on clicked link
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');

          // Smooth scroll accounting for fixed header height
          const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Click handler for mobile links
  mobileLinks.forEach(mLink => {
    mLink.addEventListener('click', (e) => {
      const targetId = mLink.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          e.preventDefault();

          // Sync active state to desktop nav
          navLinks.forEach(l => {
            if (l.getAttribute('href') === targetId) {
              l.classList.add('active');
            } else {
              l.classList.remove('active');
            }
          });

          const drawer = document.getElementById('mobileDrawer');
          if (drawer) {
            drawer.classList.remove('open');
            document.body.style.overflow = 'auto';
          }

          const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Real-time ScrollSpy to update active link as user scrolls
  let isTicking = false;
  window.addEventListener('scroll', () => {
    if (!isTicking) {
      window.requestAnimationFrame(() => {
        const scrollPosition = window.pageYOffset + headerHeight + 50;

        sections.forEach(section => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          const sectionId = section.getAttribute('id');

          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
              if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
        isTicking = false;
      });
      isTicking = true;
    }
  }, { passive: true });
}

function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;
  const updateScroll = () => {
    if (window.scrollY > 25) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();
}

let currentToothMode = 'enamel'; // 'enamel' or 'xray'
let scanAutoRevertTimer = null;

function initToothInteractiveStage() {
  // Tooth scanning is 100% automatic via synchronized laser scan line & anatomical roots reveal
}

/* ==========================================================================
   REAL-TIME 3D MOUSE PARALLAX & TILT (Natural 3D Depth)
   ========================================================================== */
function initTooth3dParallax() {
  const heroSection = document.getElementById('home');
  const toothCard = document.getElementById('toothMediaCard');
  const laserOrbit = document.getElementById('laserOrbit');

  if (!heroSection || !toothCard) return;

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const dx = (x - centerX) / centerX; // -1 to +1
    const dy = (y - centerY) / centerY; // -1 to +1

    // 3D tilt angles
    const rotateX = -dy * 14; // max 14 deg
    const rotateY = dx * 16;  // max 16 deg

    toothCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

    if (laserOrbit) {
      laserOrbit.style.transform = `translate(-50%, -50%) rotateX(${68 - dy * 8}deg) rotateZ(${-12 + dx * 10}deg)`;
    }
  });

  heroSection.addEventListener('mouseleave', () => {
    toothCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    if (laserOrbit) {
      laserOrbit.style.transform = `translate(-50%, -50%) rotateX(68deg) rotateZ(-12deg)`;
    }
  });
}

/* ==========================================================================
   INTERACTIVE TOOTH SCAN MODES (Real 3D Tooth vs Internal Roots Anatomy)
   ========================================================================== */
function setToothMode(mode, autoRevert = false) {
  currentToothMode = mode;
  const stageWrap = document.getElementById('toothStageWrap');
  const btnEnamel = document.getElementById('btnEnamelMode');
  const btnXray = document.getElementById('btnXrayMode');
  const badgeLabel = document.getElementById('badgeLabel');
  const toothTapText = document.getElementById('toothTapText');

  // Cancel any pending auto-revert timer to avoid race conditions
  if (scanAutoRevertTimer) {
    clearTimeout(scanAutoRevertTimer);
    scanAutoRevertTimer = null;
  }

  if (mode === 'xray') {
    if (stageWrap) stageWrap.classList.add('is-xray');
    if (btnXray) btnXray.classList.add('active');
    if (btnEnamel) btnEnamel.classList.remove('active');
    if (badgeLabel) badgeLabel.textContent = "INTERNAL ROOTS VIEW";
    if (toothTapText) toothTapText.textContent = "Tap Tooth to View 3D Enamel";

    showToast(
      "Internal Root Anatomy Revealed",
      "Displaying inner pulp chamber, root canal nerves, and dentin. Tap tooth again to return to 3D Enamel."
    );

    if (autoRevert) {
      scanAutoRevertTimer = setTimeout(() => {
        setToothMode('enamel', false);
        showToast(
          "3D Scan Complete",
          "Digital impression captured. Reverted back to photorealistic tooth view."
        );
      }, 3500);
    }
  } else {
    if (stageWrap) stageWrap.classList.remove('is-xray');
    if (btnEnamel) btnEnamel.classList.add('active');
    if (btnXray) btnXray.classList.remove('active');
    if (badgeLabel) badgeLabel.textContent = "PRECISION DENTISTRY";
    if (toothTapText) toothTapText.textContent = "Tap Tooth to View Roots";

    showToast(
      "3D Real Tooth View",
      "Pristine enamel exterior. Tap tooth to inspect internal roots & canals."
    );
  }
}

let lastToggleTime = 0;
function toggleToothScan() {
  const now = Date.now();
  if (now - lastToggleTime < 250) return; // Prevent double trigger from click/touch
  lastToggleTime = now;

  if (currentToothMode === 'enamel') {
    // Tap 1: Switch to internal roots view and stay there
    setToothMode('xray', false);
  } else {
    // Tap 2: Switch back to 3D tooth view and stay there
    setToothMode('enamel', false);
  }
}

/* ==========================================================================
   FLOATING FEATURE PILLS CLICKS (Video 00:06 - 00:07)
   ========================================================================== */
function triggerPillAction(pillType) {
  if (pillType === '3dscan') {
    toggleToothScan();
  } else if (pillType === 'advanced') {
    showToast("Advanced Care", "High-magnification Carl Zeiss microscopic precision.");
  } else if (pillType === 'personalized') {
    showToast("Personalized Care", "Biological care tailored for your individual dental profile.");
  } else if (pillType === 'digital') {
    showToast("Digital Smile Design", "AI facial aesthetic mapping and smile simulation.");
  }
}

/* ==========================================================================
   DOCTOR SCHEDULES & DYNAMIC AVAILABLE TIME SLOTS
   ========================================================================== */
const doctorSchedules = {
  "Any Available Specialist": {
    timing: "General Clinic Timings: Mon - Sat • 09:30 AM – 06:30 PM",
    availableSlots: ["09:30 AM", "10:15 AM", "11:00 AM", "11:45 AM", "02:00 PM", "03:15 PM", "04:30 PM", "05:45 PM"],
    bookedSlots: ["01:00 PM"]
  },
  "Dr. Sarah Al-Mansoor": {
    timing: "Dr. Sarah's Schedule: Mon - Sat • 10:00 AM – 05:00 PM (Cosmetic Veneers & Smile)",
    availableSlots: ["10:00 AM", "10:45 AM", "11:30 AM", "02:15 PM", "03:00 PM", "04:15 PM"],
    bookedSlots: ["01:15 PM", "03:45 PM"]
  },
  "Dr. Marcus Vance": {
    timing: "Dr. Marcus's Schedule: Tue - Sat • 09:30 AM – 04:30 PM (Implants & Surgery)",
    availableSlots: ["09:30 AM", "10:30 AM", "11:30 AM", "02:00 PM", "03:30 PM"],
    bookedSlots: ["12:00 PM", "04:00 PM"]
  },
  "Dr. Elena Rostova": {
    timing: "Dr. Elena's Schedule: Mon - Fri • 11:00 AM – 07:00 PM (Invisalign & Alignment)",
    availableSlots: ["11:15 AM", "12:00 PM", "02:30 PM", "03:30 PM", "05:00 PM", "06:15 PM"],
    bookedSlots: ["04:15 PM"]
  },
  "Dr. Tariq Lodhi": {
    timing: "Dr. Tariq's Schedule: Mon - Sat • 09:00 AM – 03:00 PM (Microscopic Root Canal)",
    availableSlots: ["09:00 AM", "10:15 AM", "11:30 AM", "01:00 PM", "02:15 PM"],
    bookedSlots: ["12:15 PM"]
  }
};

function initDoctorSchedules() {
  renderDoctorTimeSlots("Any Available Specialist");
}

function renderDoctorTimeSlots(doctorName) {
  const scheduleData = doctorSchedules[doctorName] || doctorSchedules["Any Available Specialist"];
  const chipsGrid = document.getElementById('slotsChipsGrid');
  const countText = document.getElementById('slotCountText');
  const timingText = document.getElementById('doctorTimingText');
  const selectedSlotInput = document.getElementById('selectedTimeSlot');

  if (timingText) {
    timingText.textContent = scheduleData.timing;
  }

  if (countText) {
    countText.textContent = `${scheduleData.availableSlots.length} Slots Available`;
  }

  if (chipsGrid) {
    chipsGrid.innerHTML = '';

    // Render available slots
    scheduleData.availableSlots.forEach((slot, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'slot-chip' + (idx === 0 ? ' active' : '');
      btn.textContent = slot;
      btn.onclick = () => selectTimeSlot(btn, slot);
      chipsGrid.appendChild(btn);

      if (idx === 0 && selectedSlotInput) {
        selectedSlotInput.value = slot;
      }
    });

    // Render booked slots (disabled)
    if (scheduleData.bookedSlots) {
      scheduleData.bookedSlots.forEach(slot => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'slot-chip booked';
        btn.disabled = true;
        btn.title = "This slot is already reserved";
        btn.textContent = slot + " (Booked)";
        chipsGrid.appendChild(btn);
      });
    }
  }
}

function selectTimeSlot(btnEl, timeVal) {
  const chips = document.querySelectorAll('.slot-chip');
  chips.forEach(c => c.classList.remove('active'));
  btnEl.classList.add('active');

  const selectedInput = document.getElementById('selectedTimeSlot');
  if (selectedInput) {
    selectedInput.value = timeVal;
  }
}

function handleModalDoctorChange(doctorVal) {
  renderDoctorTimeSlots(doctorVal);
}

function handleQuickDoctorChange(doctorVal) {
  const scheduleData = doctorSchedules[doctorVal] || doctorSchedules["Any Available Specialist"];
  const quickTimeSelect = document.getElementById('quickTimeSlot');

  if (quickTimeSelect) {
    quickTimeSelect.innerHTML = '';
    scheduleData.availableSlots.forEach(slot => {
      const opt = document.createElement('option');
      opt.value = slot;
      opt.textContent = `${slot} (Available)`;
      quickTimeSelect.appendChild(opt);
    });
  }
}

/* ==========================================================================
   BOOKING & LOGIN MODALS
   ========================================================================== */
function handleBackdropClick(e, modalType) {
  // Check if click/tap occurred directly on the backdrop container (outside modal-dialog)
  if (e && e.target && (e.target.classList.contains('modal-backdrop') || e.target.id === 'bookingModal' || e.target.id === 'loginModal')) {
    e.stopPropagation();
    if (modalType === 'booking') {
      closeBookingModal();
    } else {
      closeLoginModal();
    }
  }
}

function openBookingModal(source = 'General') {
  const modal = document.getElementById('bookingModal');
  const sub = document.getElementById('modalSub');
  const docSelect = document.getElementById('doctorSelect');

  let matchedDoctor = "Any Available Specialist";

  if (docSelect && source) {
    for (let i = 0; i < docSelect.options.length; i++) {
      if (source.includes(docSelect.options[i].value)) {
        docSelect.selectedIndex = i;
        matchedDoctor = docSelect.options[i].value;
        break;
      }
    }
  }

  renderDoctorTimeSlots(matchedDoctor);

  if (sub && source) {
    sub.textContent = `Inquiring for: ${source}. Experienced clinical consultation with our lead dental specialists.`;
  }

  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

function closeBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
  }
}

function openLoginModal(e) {
  if (e) e.preventDefault();
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
  }
}

function handleBookingSubmit(e) {
  e.preventDefault();
  const doc = document.getElementById('doctorSelect')?.value || 'Assigned Specialist';
  const time = document.getElementById('selectedTimeSlot')?.value || 'Selected Slot';
  const date = document.getElementById('bookDate')?.value || 'Upcoming Date';

  closeBookingModal();
  showToast(
    `Visit Scheduled with ${doc}`,
    `Appointment reserved for ${date} at ${time}. Our clinic desk will send WhatsApp confirmation.`
  );
  e.target.reset();
  renderDoctorTimeSlots("Any Available Specialist");
}

function handleQuickBooking(e) {
  e.preventDefault();
  const name = document.getElementById('quickName')?.value || 'Valued Patient';
  const doc = document.getElementById('quickDoctor')?.value || 'Specialist';
  const time = document.getElementById('quickTimeSlot')?.value || 'Preferred Time';

  showToast(
    `Appointment Requested with ${doc}`,
    `Thank you ${name}! Time slot reserved: ${time}. We will contact you within 15 minutes.`
  );
  e.target.reset();
}

function handleLoginSubmit(e) {
  e.preventDefault();
  closeLoginModal();
  showToast(
    "Welcome to Patient Portal",
    "Loading your 3D digital smile designs and radiograph history..."
  );
}

function initBookingDate() {
  const dateInput = document.getElementById('bookDate');
  if (dateInput) {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    dateInput.min = today.toISOString().split('T')[0];
    dateInput.value = today.toISOString().split('T')[0];
  }
}

/* ==========================================================================
   TOAST NOTIFICATION
   ========================================================================== */
let toastTimer;
function showToast(title, desc) {
  const toast = document.getElementById('toastNotice');
  const titleEl = document.getElementById('toastTitle');
  const descEl = document.getElementById('toastDesc');

  if (titleEl) titleEl.textContent = title;
  if (descEl) descEl.textContent = desc;

  if (toast) {
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }
}

/* ==========================================================================
   MOBILE DRAWER & BACKDROP CLICKS
   ========================================================================== */
function initMobileDrawer() {
  const toggle = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');
  const close = document.getElementById('drawerClose');
  const links = document.querySelectorAll('.mobile-link');

  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    if (close) {
      close.addEventListener('click', () => {
        drawer.classList.remove('open');
        document.body.style.overflow = 'auto';
      });
    }

    links.forEach(l => {
      l.addEventListener('click', () => {
        drawer.classList.remove('open');
        document.body.style.overflow = 'auto';
      });
    });
  }

  window.addEventListener('click', (e) => {
    const bookingModal = document.getElementById('bookingModal');
    const loginModal = document.getElementById('loginModal');
    if (e.target === bookingModal) closeBookingModal();
    if (e.target === loginModal) closeLoginModal();
  });
}
