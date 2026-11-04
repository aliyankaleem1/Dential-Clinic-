// ========================================================
// js/master.js - Global Controller & Data Store
// ========================================================

// Default initial appointments for demo realism (Aura Dental Spa - DHA Phase 6 Karachi)
// Line-by-line sequential patient queue tokens (SPA-001 to SPA-005)
const DEFAULT_APPOINTMENTS = [
  {
    id: "SPA-001",
    queueNumber: 1,
    name: "Ayesha Tariq",
    phone: "+92 321 8492019",
    email: "ayesha.t@gmail.com",
    treatment: "Hollywood Smile Porcelain Veneers",
    doctor: "Dr. Sophia Vance",
    date: "Today",
    time: "10:30 AM (Suite 2)",
    status: "Completed", // Treatment Done
    urgency: "Normal",
    notes: "Requested Vita Shade B1 Natural White • 6 Upper Veneers Bonded",
    cost: "PKR 210,000"
  },
  {
    id: "SPA-002",
    queueNumber: 2,
    name: "Hamza Farooq",
    phone: "+92 300 4567891",
    email: "h.farooq@outlook.com",
    treatment: "Straumann® Dental Implant",
    doctor: "Dr. Ahmed Khan",
    date: "Today",
    time: "11:45 AM (Suite 1)",
    status: "In-Chair", // Currently in Treatment
    urgency: "High",
    notes: "Tooth #19 replacement with Swiss Titanium fixture in progress",
    cost: "PKR 85,000"
  },
  {
    id: "SPA-003",
    queueNumber: 3,
    name: "Zainab Noor",
    phone: "+92 333 7819203",
    email: "zainab.noor@yahoo.com",
    treatment: "Invisalign® Clear Braces",
    doctor: "Dr. Sara Malik",
    date: "Today",
    time: "02:15 PM (Suite 3)",
    status: "Confirmed", // Not Treated Yet (In Waiting Lounge)
    urgency: "Normal",
    notes: "3D Digital Scan review & tray fitting",
    cost: "PKR 280,000"
  },
  {
    id: "SPA-004",
    queueNumber: 4,
    name: "Bilal Sheikh",
    phone: "+92 345 9012345",
    email: "bilal.s@gmail.com",
    treatment: "EMS Airflow® Spa Cleaning",
    doctor: "Dr. Sophia Vance",
    date: "Today",
    time: "04:30 PM (Suite 2)",
    status: "Pending", // Not Treated Yet (Awaiting Arrival)
    urgency: "Normal",
    notes: "Tea/coffee stain removal & polish",
    cost: "PKR 6,500"
  },
  {
    id: "SPA-005",
    queueNumber: 5,
    name: "Fatima Bilal",
    phone: "+92 312 6543210",
    email: "fatima.b@live.com",
    treatment: "Laser Teeth Whitening",
    doctor: "Dr. Ahmed Khan",
    date: "Tomorrow",
    time: "10:00 AM (Suite 1)",
    status: "Confirmed", // Not Treated Yet (Scheduled)
    urgency: "Normal",
    notes: "Pre-wedding cosmetic smile preparation",
    cost: "PKR 25,000"
  }
];

// Data Store API
export const ClinicStore = {
  getAppointments() {
    try {
      const data = localStorage.getItem('smilecare_appointments');
      if (!data) {
        localStorage.setItem('smilecare_appointments', JSON.stringify(DEFAULT_APPOINTMENTS));
        localStorage.setItem('smilecare_token_seq', '5');
        return DEFAULT_APPOINTMENTS;
      }
      return JSON.parse(data);
    } catch (e) {
      return DEFAULT_APPOINTMENTS;
    }
  },

  getNextToken() {
    let seq = parseInt(localStorage.getItem('smilecare_token_seq') || '0', 10);
    if (!seq || seq < 5) {
      const list = this.getAppointments();
      let maxNum = 0;
      list.forEach(a => {
        if (a.queueNumber && a.queueNumber > maxNum) maxNum = a.queueNumber;
        const match = a.id && a.id.match(/\d+/);
        if (match) {
          const n = parseInt(match[0], 10);
          if (n > maxNum && n < 9000) maxNum = n;
        }
      });
      seq = Math.max(maxNum, list.length, 5);
    }
    seq += 1;
    localStorage.setItem('smilecare_token_seq', seq.toString());
    const padded = String(seq).padStart(3, '0');
    return {
      tokenId: `SPA-${padded}`,
      queueNumber: seq
    };
  },

  addAppointment(apt) {
    const list = this.getAppointments();
    let tokenId = apt.id;
    let queueNumber = apt.queueNumber;

    if (!tokenId || !tokenId.startsWith('SPA-')) {
      const next = this.getNextToken();
      tokenId = next.tokenId;
      queueNumber = next.queueNumber;
    }

    const newApt = {
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      ...apt,
      id: tokenId,
      queueNumber: queueNumber || list.length + 1
    };
    list.unshift(newApt);
    localStorage.setItem('smilecare_appointments', JSON.stringify(list));
    window.dispatchEvent(new Event('storage'));
    return newApt;
  },

  updateStatus(id, newStatus) {
    const list = this.getAppointments();
    const item = list.find(a => a.id === id);
    if (item) {
      item.status = newStatus;
      localStorage.setItem('smilecare_appointments', JSON.stringify(list));
      window.dispatchEvent(new Event('storage'));
    }
    return list;
  },

  deleteAppointment(id) {
    let list = this.getAppointments();
    list = list.filter(a => a.id !== id);
    localStorage.setItem('smilecare_appointments', JSON.stringify(list));
    window.dispatchEvent(new Event('storage'));
    return list;
  },

  normalizeDate(d) {
    if (!d) return '';
    const str = String(d).trim().toLowerCase();
    const today = new Date().toISOString().split('T')[0];
    if (str === 'today') return today;
    if (str === 'tomorrow') {
      const t = new Date();
      t.setDate(t.getDate() + 1);
      return t.toISOString().split('T')[0];
    }
    const match = String(d).match(/\d{4}-\d{2}-\d{2}/);
    if (match) return match[0];
    return String(d).trim();
  },

  doctorMatches(a, b) {
    if (!a || !b) return false;
    const sA = a.toLowerCase();
    const sB = b.toLowerCase();
    if (sA === sB) return true;
    if (sA.includes('ahmed') && sB.includes('ahmed')) return true;
    if (sA.includes('sophia') && sB.includes('sophia')) return true;
    if (sA.includes('sara') && sB.includes('sara')) return true;
    return false;
  },

  slotMatches(timeStr, targetSlot) {
    if (!timeStr || !targetSlot) return false;
    const cleanA = timeStr.replace(/[\s\(\)]/g, '').toUpperCase();
    const cleanB = targetSlot.replace(/[\s\(\)]/g, '').toUpperCase();
    return cleanA.includes(cleanB) || cleanB.includes(cleanA);
  },

  isSlotBooked(doctorName, dateStr, slotTime) {
    try {
      const list = this.getAppointments();
      const targetDateNorm = this.normalizeDate(dateStr);
      return list.some(a => {
        if (a.status === 'Cancelled') return false;
        if (!this.doctorMatches(a.doctor, doctorName)) return false;
        const aptDateNorm = this.normalizeDate(a.date);
        if (aptDateNorm !== targetDateNorm) return false;
        return this.slotMatches(a.time, slotTime);
      });
    } catch (e) {
      return false;
    }
  },

  getBookedAppointment(doctorName, dateStr, slotTime) {
    try {
      const list = this.getAppointments();
      const targetDateNorm = this.normalizeDate(dateStr);
      return list.find(a => {
        if (a.status === 'Cancelled') return false;
        if (!this.doctorMatches(a.doctor, doctorName)) return false;
        const aptDateNorm = this.normalizeDate(a.date);
        if (aptDateNorm !== targetDateNorm) return false;
        return this.slotMatches(a.time, slotTime);
      });
    } catch (e) {
      return null;
    }
  },

  resetDefaults() {
    localStorage.setItem('smilecare_appointments', JSON.stringify(DEFAULT_APPOINTMENTS));
    localStorage.setItem('smilecare_token_seq', '5');
    window.dispatchEvent(new Event('storage'));
    return DEFAULT_APPOINTMENTS;
  }
};
window.ClinicStore = ClinicStore;

// ==========================================
// Theme (Dark / Light Mode Controller)
// ==========================================
export function initTheme() {
  const currentTheme = localStorage.getItem('smilecare_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  const toggleBtns = document.querySelectorAll('[data-theme-toggle]');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const nowTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const targetTheme = nowTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', targetTheme);
      localStorage.setItem('smilecare_theme', targetTheme);
      updateThemeIcon(targetTheme);
    });
  });
}

function updateThemeIcon(theme) {
  const icons = document.querySelectorAll('[data-theme-icon]');
  icons.forEach(ic => {
    if (theme === 'dark') {
      ic.className = 'fa fa-sun';
      ic.title = 'Switch to Light Mode';
    } else {
      ic.className = 'fa fa-moon';
      ic.title = 'Switch to Dark Mode';
    }
  });
}

// ==========================================
// Mobile Navigation Drawer
// ==========================================
export function initNav() {
  const hamburger = document.querySelector('.nav-hamburger');
  const drawer = document.querySelector('.mobile-nav-drawer');
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      drawer.classList.toggle('open');
      hamburger.classList.toggle('active');
    });
  }

  // Highlight active page link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// Auto-run on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
});
