import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

// Minimalist SVG Icons (Lucide-Style)
const Icons = {
  Star: ({ className = "w-4 h-4 fill-amber-400 text-amber-400" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  ArrowRight: ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Sparkles: ({ className = "w-5 h-5 text-teal-medical" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
    </svg>
  ),
  ShieldCheck: ({ className = "w-5 h-5 text-teal-medical" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  HeartPulse: ({ className = "w-5 h-5 text-teal-medical" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
    </svg>
  ),
  Check: ({ className = "w-4 h-4 text-teal-medical" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  WhatsApp: ({ className = "w-4 h-4 text-emerald-500" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  ),
  ChevronDown: ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  MapPin: ({ className = "w-4 h-4 text-teal-medical" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Clock: ({ className = "w-4 h-4 text-teal-medical" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Car: ({ className = "w-4 h-4 text-teal-medical" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  ),
  CreditCard: ({ className = "w-4 h-4 text-teal-medical" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  ),
  Close: ({ className = "w-5 h-5 text-slate-muted" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Calendar: ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Download: ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  ),
  Bell: ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
};

// ========================================================
// Normalization & Calendar Reminder Helpers
// ========================================================
function doctorMatches(a, b) {
  if (!a || !b) return false;
  const sA = a.toLowerCase();
  const sB = b.toLowerCase();
  if (sA === sB) return true;
  if (sA.includes('ahmed') && sB.includes('ahmed')) return true;
  if (sA.includes('sophia') && sB.includes('sophia')) return true;
  if (sA.includes('sara') && sB.includes('sara')) return true;
  return false;
}

function normalizeDate(d) {
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
}

function slotMatches(timeStr, targetSlot) {
  if (!timeStr || !targetSlot) return false;
  const cleanA = timeStr.replace(/[\s\(\)]/g, '').toUpperCase();
  const cleanB = targetSlot.replace(/[\s\(\)]/g, '').toUpperCase();
  return cleanA.includes(cleanB) || cleanB.includes(cleanA);
}

// Generate Google Calendar Link with auto 24h & 2h alerts
function getGoogleCalendarUrl(booking) {
  if (!booking) return '#';
  const title = encodeURIComponent(`🦷 Aura Dental Spa: ${booking.treatment || 'Consultation'} (${booking.doctor || 'Specialist'})`);
  const details = encodeURIComponent(
    `Official Patient Voucher: ${booking.ref} (Turn #${booking.queueNum})\n\n` +
    `• Patient Name: ${booking.name}\n` +
    `• Mobile: ${booking.phone}\n` +
    `• Email: ${booking.email}\n` +
    `• Specialist: ${booking.doctor} (${booking.suite || 'Private Suite'})\n` +
    `• Treatment: ${booking.treatment}\n` +
    `• Confirmed Slot: ${booking.date} at ${booking.time}\n` +
    `• Clinic Location: Main Shahbaz Commercial, DHA Phase 6, Karachi\n` +
    `• WhatsApp Clinic: +92 300 1234567\n\n` +
    `Please arrive 10 minutes prior to your scheduled time. Valet parking is available at the entrance.`
  );
  const location = encodeURIComponent('Aura Dental Spa, Main Shahbaz Commercial, DHA Phase 6, Karachi, Pakistan');

  let startStr = '';
  let endStr = '';
  try {
    const rawDate = booking.date && booking.date.match(/\d{4}-\d{2}-\d{2}/) ? booking.date.match(/\d{4}-\d{2}-\d{2}/)[0] : new Date().toISOString().split('T')[0];
    const [y, m, d] = rawDate.split('-');
    let [tPart, meridiem] = (booking.time || '10:00 AM').split(' ');
    let [h, min] = (tPart || '10:00').split(':');
    let hours = parseInt(h, 10) || 10;
    let mins = parseInt(min, 10) || 0;
    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;

    const pad = (n) => String(n).padStart(2, '0');
    startStr = `${y}${pad(m)}${pad(d)}T${pad(hours)}${pad(mins)}00`;
    let endHours = hours + 1;
    endStr = `${y}${pad(m)}${pad(d)}T${pad(endHours)}${pad(mins)}00`;
  } catch (err) {
    const today = new Date().toISOString().replace(/-|:|\.\d\d\d/g, '').slice(0, 15);
    startStr = today;
    endStr = today;
  }

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}`;
}

// Download .ics file for Apple Calendar, Outlook, Android
function downloadIcsReminder(booking) {
  if (!booking) return;
  try {
    const rawDate = booking.date && booking.date.match(/\d{4}-\d{2}-\d{2}/) ? booking.date.match(/\d{4}-\d{2}-\d{2}/)[0] : new Date().toISOString().split('T')[0];
    const [y, m, d] = rawDate.split('-');
    let [tPart, meridiem] = (booking.time || '10:00 AM').split(' ');
    let [h, min] = (tPart || '10:00').split(':');
    let hours = parseInt(h, 10) || 10;
    let mins = parseInt(min, 10) || 0;
    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;

    const pad = (n) => String(n).padStart(2, '0');
    const dtStart = `${y}${pad(m)}${pad(d)}T${pad(hours)}${pad(mins)}00`;
    const dtEnd = `${y}${pad(m)}${pad(d)}T${pad(hours + 1)}${pad(mins)}00`;

    const summary = `Aura Dental Spa: ${booking.treatment} (${booking.doctor})`;
    const description = `Voucher ${booking.ref} (Turn #${booking.queueNum})\\nPatient: ${booking.name}\\nDoctor: ${booking.doctor} (${booking.suite})\\nConfirmed Slot: ${booking.date} at ${booking.time}\\nClinic WhatsApp: +92 300 1234567`;
    const loc = `Aura Dental Spa, Main Shahbaz Commercial, DHA Phase 6, Karachi`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Aura Dental Spa Karachi//Appointment System//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:aura-spa-${booking.ref}-${Date.now()}@auradentalspa.pk`,
      `DTSTAMP:${dtStart}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${loc}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT24H',
      'ACTION:DISPLAY',
      'DESCRIPTION:Reminder: Aura Dental Spa appointment tomorrow',
      'END:VALARM',
      'BEGIN:VALARM',
      'TRIGGER:-PT2H',
      'ACTION:DISPLAY',
      'DESCRIPTION:Reminder: Aura Dental Spa appointment in 2 hours',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `AuraDentalSpa-Voucher-${booking.ref}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    console.error("Error creating .ics calendar file", e);
  }
}

// Hero Alternating Images
const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=85",
    caption: "Aesthetic Porcelain Smile",
    tag: "Natural & Bright"
  },
  {
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=85",
    caption: "Private Acoustic Suite",
    tag: "Zero Clinic Smell or Fear"
  },
  {
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=85",
    caption: "3D Digital Guided Scan",
    tag: "100% Painless Technology"
  }
];

// Specialists
const SPECIALISTS = [
  {
    id: "dr-ahmed",
    name: "Dr. Ahmed Khan",
    degrees: "BDS, RDS, FICOI (USA)",
    title: "Chief Implant & Maxillofacial Surgeon",
    suite: "Suite 1",
    availableDays: [1, 3, 5, 6], // Mon, Wed, Fri, Sat
    dayNames: "Mon, Wed, Fri, Sat",
    slots: ["10:00 AM", "11:30 AM", "02:00 PM", "03:30 PM", "05:00 PM"],
    bio: "Over 16 years of experience placing guided dental implants without cuts or stitches. Certified by the American Dental Implant Board.",
    highlight: "Over 4,500 Successful Implants • Pain-Free Technique",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "dr-sophia",
    name: "Dr. Sophia Vance",
    degrees: "DDS, MSc (Zurich)",
    title: "Swiss Aesthetic Smile Specialist",
    suite: "Suite 2",
    availableDays: [2, 4, 5, 0], // Tue, Thu, Fri, Sun
    dayNames: "Tue, Thu, Fri, Sun",
    slots: ["11:00 AM", "12:30 PM", "02:30 PM", "04:00 PM", "06:00 PM"],
    bio: "Visiting specialist from Zurich. Crafts ultra-thin porcelain veneers that look completely natural and last for decades.",
    highlight: "Hollywood Smile Expert • 0.3mm No-Grinding Veneers",
    image: "https://images.unsplash.com/photo-1594824813571-638f0263441f?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "dr-sara",
    name: "Dr. Sara Malik",
    degrees: "BDS, MOrth (UK)",
    title: "Invisalign® Clear Braces Specialist",
    suite: "Suite 3",
    availableDays: [1, 2, 4, 6], // Mon, Tue, Thu, Sat
    dayNames: "Mon, Tue, Thu, Sat",
    slots: ["10:30 AM", "12:00 PM", "03:00 PM", "04:30 PM", "06:30 PM"],
    bio: "Straightens crowded and uneven teeth with invisible trays. No metal wires, no food restrictions, completely discreet.",
    highlight: "Top 1% Invisalign Provider in Pakistan",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=85"
  }
];

// Helper: Get Next Active Consultation Days for a doctor (including Today if on duty)
function getNextDoctorDays(availableDays, count = 3) {
  const days = [];
  const curr = new Date();
  let loops = 0;
  while (days.length < count && loops < 14) {
    if (availableDays.includes(curr.getDay())) {
      const isToday = loops === 0;
      days.push({
        dateStr: curr.toISOString().split('T')[0],
        display: (isToday ? 'Today, ' : '') + curr.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      });
    }
    curr.setDate(curr.getDate() + 1);
    loops++;
  }
  return days;
}

// Transparent Starting Price Guide (PKR)
const PRICING_PLANS = [
  {
    name: "EMS Airflow® Spa Cleaning",
    price: "PKR 6,500",
    frequency: "per session",
    desc: "Gentle warm water & soft powder cleansing. Completely painless.",
    features: ["Warm 37°C water spray", "Zero sharp scraping", "Deep stain removal (Tea/Coffee)", "Fluoride protective coat"],
    popular: false
  },
  {
    name: "Laser Teeth Whitening",
    price: "PKR 25,000",
    frequency: "single visit",
    desc: "Up to 8 shades lighter in 45 minutes with zero sensitivity.",
    features: ["45-minute single session", "Cold diode gentle laser", "Desensitizing serum included", "Lasts 12–18 months"],
    popular: true
  },
  {
    name: "Hollywood Smile Veneers",
    price: "PKR 35,000",
    frequency: "per tooth",
    desc: "Handcrafted 0.3mm Swiss E.max porcelain with natural translucency.",
    features: ["Custom VITA shade matching", "Minimal to zero grinding", "High stain resistance", "Completed in just 2 visits"],
    popular: false
  },
  {
    name: "Straumann® Dental Implant",
    price: "PKR 85,000",
    frequency: "complete fixture",
    desc: "3D keyhole guided titanium implant placed with zero stitches.",
    features: ["Swiss Grade-5 Titanium", "15-Year official warranty", "3D CBCT digital guide", "Same-week eating comfort"],
    popular: false
  }
];

// FAQs for Patient Peace of Mind
const FAQS = [
  {
    q: "Will the dental treatment actually be 100% painless?",
    a: "Yes, absolutely. We use computer-controlled gentle local numbing and non-invasive methods. Most patients listen to soothing music on noise-cancelling headphones or even doze off during their treatment."
  },
  {
    q: "How many visits does a Hollywood Smile or Veneers take?",
    a: "Only 2 appointments! In the first visit, we take 3D digital scans of your teeth without messy impression trays. In the second visit (usually 5 to 7 days later), your handcrafted Swiss veneers are bonded permanently."
  },
  {
    q: "Do you offer 0% installment plans for payments?",
    a: "Yes! We offer 0% markup monthly installment plans for 3, 6, and 12 months with all major credit cards in Pakistan (Bank Alfalah, HBL, Standard Chartered, Silkbank, etc.)."
  },
  {
    q: "How strict are your sterilization and hygiene protocols?",
    a: "We follow strict European ISO 13485 cleanroom standards. Every single instrument is sterilized using medical-grade Class-B autoclaves and sealed in individual pouches opened directly in front of you."
  },
  {
    q: "Where is Aura Dental Spa located and is there parking?",
    a: "We are located on Main Shahbaz Commercial, DHA Phase 6, Karachi. We have complimentary valet parking for all our patients so you never have to worry about finding a spot."
  }
];

// Main Dental Spa React Application
function DentalSpaApp() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [activeDoctor, setActiveDoctor] = useState(SPECIALISTS[0]);
  const [openFaq, setOpenFaq] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [storeVersion, setStoreVersion] = useState(0);

  // Before / After Slider State
  const [sliderPos, setSliderPos] = useState(50);
  const sliderRef = useRef(null);
  const isDraggingRef = useRef(false);

  // Real-time cross-tab sync with ClinicStore / LocalStorage
  useEffect(() => {
    const handleSync = () => setStoreVersion(v => v + 1);
    window.addEventListener('storage', handleSync);
    const interval = setInterval(handleSync, 1500);
    return () => {
      window.removeEventListener('storage', handleSync);
      clearInterval(interval);
    };
  }, []);

  // Keyboard Escape listener to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isBookingOpen) {
        closeBooking();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBookingOpen]);

  // Auto-advance hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    specialist: 'Dr. Ahmed Khan',
    treatment: 'Hollywood Smile Porcelain Veneers',
    date: '',
    timeSlot: '10:00 AM'
  });
  const [formErrors, setFormErrors] = useState({});

  const currentDoctor = SPECIALISTS.find(s => s.name === formData.specialist) || SPECIALISTS[0];
  const nextActiveDays = getNextDoctorDays(currentDoctor.availableDays, 3);
  const todayStr = new Date().toISOString().split('T')[0];

  // Auto-set initial date to doctor's next active day
  useEffect(() => {
    const days = getNextDoctorDays(currentDoctor.availableDays, 1);
    if (days.length > 0) {
      setFormData(prev => ({
        ...prev,
        date: prev.date || days[0].dateStr
      }));
    }
  }, [formData.specialist]);

  // Check if chosen date is an on-duty day for the selected doctor
  const isDateOnDuty = formData.date ? currentDoctor.availableDays.includes(new Date(formData.date + 'T00:00:00').getDay()) : true;

  // Real-time conflict-free slot calculation from ClinicStore / localStorage
  const computedSlots = useMemo(() => {
    let bookedTimes = [];
    try {
      const list = window.ClinicStore ? window.ClinicStore.getAppointments() : JSON.parse(localStorage.getItem('smilecare_appointments') || '[]');
      const targetDateNorm = normalizeDate(formData.date);
      bookedTimes = list
        .filter(a => {
          if (a.status === 'Cancelled') return false;
          if (!doctorMatches(a.doctor, currentDoctor.name)) return false;
          const aDateNorm = normalizeDate(a.date);
          return aDateNorm && aDateNorm === targetDateNorm;
        })
        .map(a => a.time || '');
    } catch(e) {}

    return currentDoctor.slots.map(slot => {
      const isBooked = bookedTimes.some(t => slotMatches(t, slot));
      return { slot, isBooked };
    });
  }, [currentDoctor, formData.date, isBookingOpen, storeVersion]);

  // Set default slot to first available slot if current is booked
  useEffect(() => {
    if (!computedSlots || computedSlots.length === 0) return;
    const currentValid = computedSlots.some(s => s.slot === formData.timeSlot && !s.isBooked);
    if (!currentValid) {
      const firstFree = computedSlots.find(s => !s.isBooked);
      if (firstFree) {
        setFormData(prev => ({ ...prev, timeSlot: firstFree.slot }));
      }
    }
  }, [computedSlots, formData.timeSlot]);

  // Enforce numbers only and Pakistani phone formats
  const handlePhoneInput = (e) => {
    let raw = e.target.value;
    let clean = '';
    for (let i = 0; i < raw.length; i++) {
      if (i === 0 && raw[i] === '+') clean += '+';
      else if (/\d/.test(raw[i])) clean += raw[i];
    }
    if (clean.startsWith('+92')) {
      clean = clean.slice(0, 13);
    } else if (clean.startsWith('03')) {
      clean = clean.slice(0, 11);
    } else if (clean.startsWith('92')) {
      clean = clean.slice(0, 12);
    } else {
      clean = clean.slice(0, 13);
    }
    setFormData(prev => ({ ...prev, phone: clean }));
    if (formErrors.phone) {
      setFormErrors(prev => ({ ...prev, phone: null }));
    }
  };

  // Handle Before & After Slider Dragging
  const handleSliderMove = (clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    let pos = ((clientX - rect.left) / rect.width) * 100;
    pos = Math.max(5, Math.min(95, pos));
    setSliderPos(pos);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    }

    // Phone validation (strictly 11 digits 03XXXXXXXXX or +923XXXXXXXXX)
    const cleanPhone = formData.phone.replace(/[\s-]/g, '');
    const isPak03 = /^03\d{9}$/.test(cleanPhone);
    const isPakPlus92 = /^\+923\d{9}$/.test(cleanPhone);
    const isPak92 = /^923\d{9}$/.test(cleanPhone);
    if (!cleanPhone) {
      errors.phone = 'Mobile number is required';
    } else if (!isPak03 && !isPakPlus92 && !isPak92) {
      errors.phone = 'Please enter an 11-digit mobile (e.g. 0300 1234567) or +92 300 1234567';
    }

    // Email validation (compulsory)
    const emailTrim = formData.email.trim();
    if (!emailTrim) {
      errors.email = 'Email address is compulsory for appointment confirmation';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailTrim)) {
      errors.email = 'Please enter a valid email address (e.g. name@gmail.com)';
    }

    // Day on duty check
    const pickedDay = new Date(formData.date + 'T00:00:00').getDay();
    if (!currentDoctor.availableDays.includes(pickedDay)) {
      errors.date = `${currentDoctor.name} only consults on ${currentDoctor.dayNames}. Please select an active day.`;
    }

    // Slot validation & conflict protection
    if (!formData.timeSlot) {
      errors.timeSlot = 'Please select a time slot';
    } else {
      const isBooked = computedSlots.find(s => s.slot === formData.timeSlot)?.isBooked;
      if (isBooked) {
        errors.timeSlot = 'This slot has already been reserved. Please pick another slot.';
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    let refCode = '';
    let queueNum = 1;

    // Check if ClinicStore has getNextToken
    if (window.ClinicStore && typeof window.ClinicStore.getNextToken === 'function') {
      const next = window.ClinicStore.getNextToken();
      refCode = next.tokenId;
      queueNum = next.queueNumber;
    } else {
      let seq = parseInt(localStorage.getItem('smilecare_token_seq') || '0', 10);
      if (!seq || seq < 5) seq = 5;
      seq += 1;
      localStorage.setItem('smilecare_token_seq', seq.toString());
      refCode = 'SPA-' + String(seq).padStart(3, '0');
      queueNum = seq;
    }

    const getTreatmentCost = (tName) => {
      if (!tName) return 'PKR 25,000';
      if (tName.includes('Airflow')) return 'PKR 6,500';
      if (tName.includes('Whitening')) return 'PKR 25,000';
      if (tName.includes('Veneer')) return 'PKR 35,000';
      if (tName.includes('Implant')) return 'PKR 85,000';
      if (tName.includes('Invisalign')) return 'PKR 280,000';
      const match = tName.match(/PKR\s*[\d,]+/i);
      if (match) return match[0];
      return 'PKR 25,000';
    };

    const aptRecord = {
      id: refCode,
      queueNumber: queueNum,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      doctor: formData.specialist,
      treatment: formData.treatment,
      date: formData.date,
      time: `${formData.timeSlot} (${currentDoctor.suite})`,
      status: 'Confirmed', // Awaiting Treatment
      urgency: 'Normal',
      notes: `Online Patient Voucher • Queue #${queueNum}`,
      cost: getTreatmentCost(formData.treatment)
    };

    // 1. Primary Store API
    if (window.ClinicStore && typeof window.ClinicStore.addAppointment === 'function') {
      window.ClinicStore.addAppointment(aptRecord);
    } else {
      // 2. Direct bulletproof LocalStorage fallback
      try {
        let existing = [];
        const raw = localStorage.getItem('smilecare_appointments');
        if (raw) {
          existing = JSON.parse(raw);
        }
        existing.unshift({
          ...aptRecord,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('smilecare_appointments', JSON.stringify(existing));
        window.dispatchEvent(new Event('storage'));
      } catch (err) {
        console.warn('Booking fallback save error:', err);
      }
    }

    setBookingSuccess({
      ref: refCode,
      queueNum: queueNum,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      doctor: formData.specialist,
      treatment: formData.treatment,
      date: formData.date,
      time: formData.timeSlot,
      suite: currentDoctor.suite
    });
  };

  const openBookingForPlan = (planName) => {
    setFormData(prev => ({ ...prev, treatment: planName }));
    setIsBookingOpen(true);
  };

  const closeBooking = () => {
    setIsBookingOpen(false);
    setBookingSuccess(null);
    setFormData(prev => ({ ...prev, name: '', phone: '' }));
  };

  return (
    <div className="min-h-screen bg-white text-slate-body font-sans">

      {/* Top Bar: Karachi Locations & Quick WhatsApp */}
      <div className="border-b border-slate-100 bg-slate-alabaster py-2 px-6 text-xs text-slate-muted flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-medical animate-pulse"></span>
          <strong className="text-slate-heading tracking-wide uppercase font-semibold">Aura Dental Spa</strong>
          <span className="hidden sm:inline">• DHA Phase 6 &amp; Clifton, Karachi</span>
        </div>
        <div className="flex items-center gap-4 font-medium">
          <a
            href="https://wa.me/923001234567?text=Hi%20Aura%20Dental%20Spa,%20I%20would%20like%20to%20book%20a%20consultation"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
          >
            <Icons.WhatsApp className="w-3.5 h-3.5" />
            <span>WhatsApp Clinic</span>
          </a>
          <span className="text-slate-300">|</span>
          <a href="/spa-admin" className="hover:text-teal-medical transition-colors font-semibold text-teal-medical">Reception Desk (Admin)</a>
        </div>
      </div>

      {/* Clean Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
          
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-teal-surface border border-teal-subtle flex items-center justify-center text-teal-medical transition-transform duration-300 group-hover:scale-105">
              <Icons.Sparkles className="w-5 h-5 text-teal-medical" />
            </div>
            <div>
              <span className="font-display font-extrabold text-xl tracking-tight text-slate-heading block leading-none">
                AURA
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-teal-medical block mt-1">
                Dental Spa Karachi
              </span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-muted">
            <a href="#services" className="hover:text-slate-heading transition-colors">Treatments</a>
            <a href="#transformation" className="hover:text-slate-heading transition-colors">Before &amp; After</a>
            <a href="#pricing" className="hover:text-slate-heading transition-colors">Pricing</a>
            <a href="#specialists" className="hover:text-slate-heading transition-colors">Doctors</a>
            <a href="#faq" className="hover:text-slate-heading transition-colors">FAQs</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/923001234567?text=Hi%20Aura%20Dental%20Spa"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-heading bg-slate-alabaster hover:bg-slate-100 border border-slate-200 px-4 py-2.5 rounded-full transition-colors"
            >
              <Icons.WhatsApp className="w-4 h-4 text-emerald-500" />
              <span>WhatsApp</span>
            </a>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="bg-teal-medical hover:bg-teal-hover text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
            >
              Book Visit
            </button>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left: Clear, Non-Intimidating English */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-alabaster border border-slate-200/60 text-xs font-semibold text-slate-muted w-fit mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-medical"></span>
                <span>PAINLESS DENTAL CARE • CLIFTON &amp; DHA</span>
              </div>

              <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl tracking-[-0.035em] text-slate-heading leading-[1.04] mb-6">
                The Art &amp; Science <br className="hidden sm:inline" />
                <span className="text-teal-medical font-extrabold">of Your Smile.</span>
              </h1>

              <p className="text-lg text-slate-body leading-relaxed max-w-lg font-normal mb-8">
                Premium dental treatments in a peaceful spa setting. No scary sounds, no painful scraping — just gentle, expert care.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 mb-12">
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="bg-teal-medical hover:bg-teal-hover text-white text-base font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-teal-medical/15 hover:-translate-y-1 text-center"
                >
                  Book Your Appointment
                </button>
                <a
                  href="#services"
                  className="inline-flex items-center justify-center gap-2 text-slate-heading hover:text-teal-medical text-base font-semibold px-4 py-4 transition-colors group"
                >
                  <span>See Treatments</span>
                  <Icons.ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-100 max-w-lg">
                <div>
                  <div className="font-display font-extrabold text-2xl text-slate-heading">0% <span className="text-teal-medical text-lg">Pain</span></div>
                  <div className="text-xs text-slate-muted mt-1 font-medium">Gentle &amp; Fully Numbed</div>
                </div>
                <div>
                  <div className="font-display font-extrabold text-2xl text-slate-heading">1:1 <span className="text-teal-medical text-lg">Private</span></div>
                  <div className="text-xs text-slate-muted mt-1 font-medium">Quiet VIP Suites</div>
                </div>
                <div>
                  <div className="font-display font-extrabold text-2xl text-slate-heading">15 <span className="text-teal-medical text-lg">Years</span></div>
                  <div className="text-xs text-slate-muted mt-1 font-medium">Warranty on Implants</div>
                </div>
              </div>

            </div>

            {/* Right: Smooth Alternating Images Frame */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-diffuse border border-slate-100 bg-slate-alabaster aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5] group">
                
                {HERO_SLIDES.map((slide, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                      idx === slideIndex
                        ? 'opacity-100 scale-100 z-10'
                        : 'opacity-0 scale-105 z-0 pointer-events-none'
                    }`}
                  >
                    <img
                      src={slide.image}
                      alt={slide.caption}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                ))}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-heading/35 via-transparent to-transparent pointer-events-none z-20"></div>

                {/* Micro Indicator Dots */}
                <div className="absolute top-5 right-5 z-30 flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                  {HERO_SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSlideIndex(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === slideIndex ? 'w-5 bg-teal-medical' : 'w-1.5 bg-white/60'
                      }`}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Floating Glassmorphism Rating Badge */}
                <div className="absolute bottom-6 left-6 right-6 glass-frosted rounded-2xl p-5 shadow-glass border border-white/80 z-30 transition-all duration-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Icons.Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-display font-bold text-slate-heading text-sm">4.9 / 5</span>
                    </div>
                    <span className="text-[11px] font-semibold text-teal-medical px-2.5 py-0.5 rounded-full bg-teal-surface border border-teal-subtle">
                      {HERO_SLIDES[slideIndex].tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-body font-normal leading-relaxed">
                    "Felt like a luxury spa instead of a clinic. Absolutely zero pain, soft music, and my smile looks so natural!"
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px] text-slate-muted">
                    <span>{HERO_SLIDES[slideIndex].caption}</span>
                    <span className="font-semibold text-slate-heading">DHA Phase 6 Clinic</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Marquee: Clean Certifications */}
      <section className="py-10 border-y border-slate-100 bg-slate-alabaster overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 mb-3">
          <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-slate-muted block text-center">
            Certified Dental Technology &amp; International Standards
          </span>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee flex items-center gap-16 text-sm font-semibold tracking-wider text-slate-muted uppercase">
            <span className="flex items-center gap-2 whitespace-nowrap"><Icons.ShieldCheck className="w-4 h-4 text-teal-medical" /> Straumann® Swiss Implants</span>
            <span className="flex items-center gap-2 whitespace-nowrap"><Icons.Sparkles className="w-4 h-4 text-teal-medical" /> Invisalign® Clear Aligners</span>
            <span className="flex items-center gap-2 whitespace-nowrap"><Icons.ShieldCheck className="w-4 h-4 text-teal-medical" /> American Dental Association (ADA)</span>
            <span className="flex items-center gap-2 whitespace-nowrap"><Icons.Sparkles className="w-4 h-4 text-teal-medical" /> 3D Guided Keyhole Surgery</span>
            <span className="flex items-center gap-2 whitespace-nowrap"><Icons.ShieldCheck className="w-4 h-4 text-teal-medical" /> Swiss Dental Society Standards</span>
            <span className="flex items-center gap-2 whitespace-nowrap"><Icons.Sparkles className="w-4 h-4 text-teal-medical" /> EMS Warm Water Airflow</span>

            <span className="flex items-center gap-2 whitespace-nowrap"><Icons.ShieldCheck className="w-4 h-4 text-teal-medical" /> Straumann® Swiss Implants</span>
            <span className="flex items-center gap-2 whitespace-nowrap"><Icons.Sparkles className="w-4 h-4 text-teal-medical" /> Invisalign® Clear Aligners</span>
            <span className="flex items-center gap-2 whitespace-nowrap"><Icons.ShieldCheck className="w-4 h-4 text-teal-medical" /> American Dental Association (ADA)</span>
            <span className="flex items-center gap-2 whitespace-nowrap"><Icons.Sparkles className="w-4 h-4 text-teal-medical" /> 3D Guided Keyhole Surgery</span>
            <span className="flex items-center gap-2 whitespace-nowrap"><Icons.ShieldCheck className="w-4 h-4 text-teal-medical" /> Swiss Dental Society Standards</span>
            <span className="flex items-center gap-2 whitespace-nowrap"><Icons.Sparkles className="w-4 h-4 text-teal-medical" /> EMS Warm Water Airflow</span>
          </div>
        </div>
      </section>

      {/* Services Section: Easy-to-Understand Bento Grid */}
      <section id="services" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          <div className="max-w-2xl mb-14">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-teal-medical block mb-2">
              Our Signature Treatments
            </span>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-slate-heading tracking-tight leading-tight">
              Gentle Treatments. <br />
              Natural, Long-Lasting Results.
            </h2>
            <p className="text-base text-slate-body mt-3 font-normal">
              Designed for patients who want the best dental results without pain, stress, or heavy scraping.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Bento Block 1: Spa Teeth Cleaning */}
            <div className="md:col-span-2 rounded-3xl bg-teal-surface border border-teal-subtle/80 p-8 sm:p-10 shadow-diffuse relative overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:shadow-diffuse-lg">
              <div className="max-w-md z-10">
                <div className="w-11 h-11 rounded-2xl bg-white border border-teal-subtle flex items-center justify-center text-teal-medical mb-6 shadow-sm">
                  <Icons.Sparkles className="w-5 h-5 text-teal-medical" />
                </div>
                <span className="text-xs uppercase tracking-widest font-bold text-teal-medical block mb-1">01 / Spa Deep Clean</span>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-heading mb-3">
                  EMS Airflow® Spa Teeth Cleaning
                </h3>
                <p className="text-slate-body text-sm sm:text-base leading-relaxed mb-6 font-normal">
                  Gentle warm water and soft powder remove all stains and plaque. No sharp metal tools, no vibrating drills, 100% painless.
                </p>
                <div className="flex flex-wrap gap-2.5">
                  <span className="px-3 py-1 rounded-full bg-white text-xs font-semibold text-slate-heading shadow-sm">
                    Warm 37°C Water
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white text-xs font-semibold text-slate-heading shadow-sm">
                    Zero Scraping
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white text-xs font-semibold text-teal-medical shadow-sm">
                    Tea &amp; Coffee Stains Gone
                  </span>
                </div>
              </div>

              <div className="mt-6 md:mt-0 md:absolute md:bottom-8 md:right-8 w-full md:w-64 h-40 md:h-56 rounded-2xl overflow-hidden border border-white/80 shadow-sm bg-white">
                <img
                  src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=700&q=80"
                  alt="Spa Teeth Cleaning"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Bento Block 2: Hollywood Veneers */}
            <div className="rounded-3xl bg-slate-alabaster border border-slate-100 p-8 shadow-diffuse flex flex-col justify-between transition-all duration-300 hover:shadow-diffuse-lg group hover:-translate-y-1">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200/60 flex items-center justify-center text-teal-medical mb-6 shadow-sm">
                  <Icons.ShieldCheck className="w-5 h-5 text-teal-medical" />
                </div>
                <span className="text-xs uppercase tracking-widest font-bold text-slate-muted block mb-1">02 / Cosmetic Smile</span>
                <h3 className="font-display font-extrabold text-2xl text-slate-heading mb-2">
                  Hollywood Smile Veneers
                </h3>
                <p className="text-slate-body text-sm leading-relaxed font-normal">
                  Custom ultra-thin porcelain covers to fix gaps, chips, and yellowish teeth in just 2 visits. Completely natural shine.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-200/50 mt-6 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-muted">Swiss E.max Ceramic</span>
                <span className="text-xs font-bold text-teal-medical">2 Visits Only</span>
              </div>
            </div>

            {/* Bento Block 3: Painless Implants */}
            <div className="rounded-3xl bg-white border border-slate-100 p-8 shadow-diffuse flex flex-col justify-between transition-all duration-300 hover:shadow-diffuse-lg group hover:-translate-y-1">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-slate-alabaster border border-slate-200/60 flex items-center justify-center text-teal-medical mb-6 shadow-sm">
                  <Icons.HeartPulse className="w-5 h-5 text-teal-medical" />
                </div>
                <span className="text-xs uppercase tracking-widest font-bold text-slate-muted block mb-1">03 / Missing Tooth</span>
                <h3 className="font-display font-extrabold text-2xl text-slate-heading mb-2">
                  Painless 3D Dental Implants
                </h3>
                <p className="text-slate-body text-sm leading-relaxed font-normal">
                  Replace missing teeth permanently in 20 minutes. Uses 3D computer guidance so there are no cuts and no stitches.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-muted">15-Year Warranty</span>
                <span className="text-xs font-bold text-teal-medical">Zero Stitches</span>
              </div>
            </div>

            {/* Bento Block 4: Twilight Sleep Dentistry */}
            <div className="md:col-span-2 rounded-3xl bg-slate-alabaster border border-slate-100 p-8 sm:p-10 shadow-diffuse flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 transition-all duration-300 hover:shadow-diffuse-lg">
              <div className="max-w-md">
                <span className="text-xs uppercase tracking-widest font-bold text-teal-medical block mb-1">04 / For Anxious Patients</span>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-heading mb-2">
                  Sleep Dentistry (Twilight Sedation)
                </h3>
                <p className="text-slate-body text-sm sm:text-base leading-relaxed font-normal">
                  Scared of the dentist? Sleep peacefully while our experts finish your treatment. Wake up refreshed with all your dental work done.
                </p>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-3 flex-shrink-0">
                <div className="text-right">
                  <span className="font-display font-extrabold text-3xl text-slate-heading block">100%</span>
                  <span className="text-xs text-slate-muted font-medium">Anxiety-Free Protocol</span>
                </div>
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="bg-white hover:bg-teal-surface text-slate-heading hover:text-teal-medical border border-slate-200 text-xs font-bold px-5 py-2.5 rounded-full transition-colors shadow-sm"
                >
                  Ask Doctor About Sleep
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* NEW SECTION 1: TASTEFUL BEFORE & AFTER SLIDER */}
      <section id="transformation" className="py-20 md:py-28 bg-slate-alabaster border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          <div className="max-w-2xl mb-12 text-center mx-auto">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-teal-medical block mb-2">
              Visual Smile Transformations
            </span>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-slate-heading tracking-tight leading-tight">
              See the Difference in Real Patients.
            </h2>
            <p className="text-base text-slate-body mt-2 font-normal">
              Slide horizontally to compare pre-treatment stains with our handcrafted Swiss veneers.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Comparison Slider Frame */}
            <div
              ref={sliderRef}
              onMouseDown={() => { isDraggingRef.current = true; }}
              onMouseUp={() => { isDraggingRef.current = false; }}
              onMouseMove={(e) => { if (isDraggingRef.current) handleSliderMove(e.clientX); }}
              onTouchMove={(e) => { if (e.touches[0]) handleSliderMove(e.touches[0].clientX); }}
              className="relative rounded-3xl overflow-hidden shadow-diffuse border border-slate-200 bg-white aspect-[16/9] sm:aspect-[21/9] select-none cursor-ew-resize"
            >
              {/* After Image */}
              <img
                src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=85"
                alt="After Veneer Smile"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Before Image (Cropped Layer) */}
              <div
                style={{ width: `${sliderPos}%` }}
                className="absolute inset-0 h-full overflow-hidden border-r-2 border-white shadow-xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=85"
                  alt="Before Dental Treatment"
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: sliderRef.current ? `${sliderRef.current.clientWidth}px` : '100%' }}
                />
              </div>

              {/* Slider Knob */}
              <div
                style={{ left: `${sliderPos}%` }}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-teal-medical shadow-lg flex items-center justify-center font-bold text-xs pointer-events-none border border-slate-200"
              >
                ⟷
              </div>

              {/* Badges */}
              <div className="absolute bottom-4 left-4 z-10 text-[11px] font-bold px-3 py-1 rounded-full bg-black/60 text-white backdrop-blur-sm">
                Before Treatment (Aged Enamel)
              </div>
              <div className="absolute bottom-4 right-4 z-10 text-[11px] font-bold px-3 py-1 rounded-full bg-teal-medical text-white shadow-sm">
                After (Swiss E.max Veneers)
              </div>
            </div>

            {/* Quick Metrics Underneath */}
            <div className="grid grid-cols-3 gap-4 mt-6 text-center">
              <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <span className="font-display font-extrabold text-xl text-slate-heading block">+7 Shades</span>
                <span className="text-xs text-slate-muted">Natural Brightness Lift</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <span className="font-display font-extrabold text-xl text-slate-heading block">2 Visits</span>
                <span className="text-xs text-slate-muted">Completed in 1 Week</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <span className="font-display font-extrabold text-xl text-teal-medical block">0% Pain</span>
                <span className="text-xs text-slate-muted">Comfortable Spa Experience</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* NEW SECTION 2: TRANSPARENT STARTING PRICE GUIDE (PKR) */}
      <section id="pricing" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          <div className="max-w-2xl mb-14 text-center mx-auto">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-teal-medical block mb-2">
              Transparent Pricing
            </span>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-slate-heading tracking-tight leading-tight">
              Honest Rates. No Hidden Charges.
            </h2>
            <p className="text-base text-slate-body mt-2 font-normal">
              Clear treatment investments with 0% markup bank installment options.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-alabaster border border-slate-200 text-xs font-semibold text-slate-heading">
              <Icons.CreditCard className="w-4 h-4 text-teal-medical" />
              <span>Easy 0% Credit Card Installments (3 to 12 Months)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRICING_PLANS.map((plan, i) => (
              <div
                key={i}
                className={`rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-diffuse-lg hover:-translate-y-1 ${
                  plan.popular
                    ? 'bg-teal-surface border-2 border-teal-medical shadow-diffuse'
                    : 'bg-slate-alabaster border border-slate-100 shadow-diffuse'
                }`}
              >
                <div>
                  {plan.popular && (
                    <span className="text-[10px] uppercase tracking-widest font-extrabold text-white bg-teal-medical px-2.5 py-1 rounded-full inline-block mb-3">
                      Most Requested
                    </span>
                  )}
                  <h3 className="font-display font-extrabold text-xl text-slate-heading mb-1">
                    {plan.name}
                  </h3>
                  <div className="my-3">
                    <span className="font-display font-black text-3xl text-slate-heading">{plan.price}</span>
                    <span className="text-xs text-slate-muted block mt-0.5">{plan.frequency}</span>
                  </div>
                  <p className="text-xs text-slate-body leading-relaxed mb-6 font-normal">
                    {plan.desc}
                  </p>

                  <ul className="space-y-2.5 pt-4 border-t border-slate-200/50 mb-6 text-xs text-slate-heading">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <Icons.Check className="w-3.5 h-3.5 text-teal-medical flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => openBookingForPlan(plan.name)}
                  className={`w-full py-3 rounded-full text-xs font-bold transition-colors text-center ${
                    plan.popular
                      ? 'bg-teal-medical hover:bg-teal-hover text-white shadow-sm'
                      : 'bg-white hover:bg-slate-100 text-slate-heading border border-slate-200'
                  }`}
                >
                  Book This Treatment
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Our Specialists */}
      <section id="specialists" className="py-20 md:py-28 bg-slate-alabaster border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          <div className="max-w-2xl mb-12">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-teal-medical block mb-2">
              Our Dental Specialists
            </span>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-slate-heading tracking-tight leading-tight">
              Trained In Pakistan &amp; Abroad.
            </h2>
            <p className="text-base text-slate-body mt-2 font-normal">
              Hover over any doctor to see their degrees and expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            <div className="lg:col-span-7 flex flex-col divide-y divide-slate-200/70">
              {SPECIALISTS.map((doc) => {
                const isActive = activeDoctor.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onMouseEnter={() => setActiveDoctor(doc)}
                    onClick={() => setActiveDoctor(doc)}
                    className={`py-6 sm:py-8 cursor-pointer transition-all duration-300 group flex items-start justify-between ${
                      isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          isActive ? 'bg-teal-medical scale-125' : 'bg-transparent'
                        }`}></span>
                        <h3 className={`font-display font-extrabold text-2xl sm:text-3xl tracking-tight transition-colors ${
                          isActive ? 'text-teal-medical' : 'text-slate-heading'
                        }`}>
                          {doc.name}
                        </h3>
                        <span className="text-xs font-semibold text-slate-muted">
                          {doc.degrees}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-body pl-5">
                        {doc.title}
                      </p>
                    </div>

                    <div className={`p-2 rounded-full transition-all ${
                      isActive ? 'bg-teal-surface text-teal-medical' : 'text-slate-muted group-hover:text-slate-heading'
                    }`}>
                      <Icons.ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-diffuse border border-slate-200/70 bg-white aspect-[4/5] p-3">
                
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    key={activeDoctor.id}
                    src={activeDoctor.image}
                    alt={activeDoctor.name}
                    className="w-full h-full object-cover object-top transition-all duration-500 ease-out transform scale-100"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-heading/85 via-slate-heading/20 to-transparent flex flex-col justify-end p-6 text-white">
                    <div className="text-xs uppercase tracking-widest font-bold text-teal-subtle mb-1">
                      {activeDoctor.title}
                    </div>
                    <h4 className="font-display font-extrabold text-2xl mb-1.5">
                      {activeDoctor.name}
                    </h4>
                    <p className="text-xs text-slate-200 leading-relaxed font-normal mb-3">
                      {activeDoctor.bio}
                    </p>
                    <div className="pt-2.5 border-t border-white/20 text-[11px] font-semibold text-white/90 flex items-center gap-2">
                      <Icons.Check className="w-4 h-4 text-teal-subtle" />
                      <span>{activeDoctor.highlight}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* NEW SECTION 3: INTERACTIVE FAQ ACCORDION */}
      <section id="faq" className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          
          <div className="max-w-2xl mb-14 text-center mx-auto">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-teal-medical block mb-2">
              Common Questions
            </span>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-slate-heading tracking-tight leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-base text-slate-body mt-2 font-normal">
              Quick answers to help you feel completely confident before your appointment.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-100 bg-slate-alabaster overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 group"
                  >
                    <span className="font-display font-bold text-base sm:text-lg text-slate-heading group-hover:text-teal-medical transition-colors">
                      {faq.q}
                    </span>
                    <div className={`p-1.5 rounded-full transition-transform duration-300 ${isOpen ? 'rotate-180 bg-teal-surface text-teal-medical' : 'text-slate-muted'}`}>
                      <Icons.ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm text-slate-body leading-relaxed border-t border-slate-200/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Trust & Reviews: Karachi Patient Stories */}
      <section id="reviews" className="py-20 md:py-28 bg-slate-alabaster border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          <div className="max-w-2xl mb-14 text-center mx-auto">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-teal-medical block mb-2">
              Patient Experiences
            </span>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-slate-heading tracking-tight leading-tight">
              Real Reviews from Karachi Patients.
            </h2>
            <p className="text-base text-slate-body mt-2 font-normal">
              Trusted by families across DHA, Clifton, and overseas Pakistanis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            <div className="flex flex-col gap-8">
              <div className="rounded-3xl bg-white border border-slate-100 p-8 shadow-diffuse hover:shadow-diffuse-lg transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Icons.Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="text-base sm:text-lg text-slate-heading font-medium leading-relaxed mb-6">
                  "I had a huge phobia of dental pain and avoided dentists for 5 years. Dr. Ahmed and his team made me feel completely relaxed. The clinic doesn't smell like a hospital, there was zero pain, and my porcelain veneers look stunning!"
                </blockquote>
                <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-display font-bold text-sm text-slate-heading">Ayesha Siddiqui</div>
                    <div className="text-xs text-slate-muted">DHA Phase 5 • Karachi</div>
                  </div>
                  <span className="text-xs font-semibold text-teal-medical px-3 py-1 rounded-full bg-teal-surface border border-teal-subtle">
                    Porcelain Veneers
                  </span>
                </div>
              </div>

              <div className="rounded-3xl bg-white border border-slate-100 p-8 shadow-diffuse hover:shadow-diffuse-lg transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Icons.Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="text-base text-slate-heading font-medium leading-relaxed mb-6">
                  "The Airflow teeth cleaning was unbelievable. Warm water and soft powder — no scraping sound or sensitivity. My teeth felt super smooth and bright within 30 minutes."
                </blockquote>
                <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-display font-bold text-sm text-slate-heading">Hamza Tariq</div>
                    <div className="text-xs text-slate-muted">Clifton Block 4 • Karachi</div>
                  </div>
                  <span className="text-xs font-semibold text-teal-medical px-3 py-1 rounded-full bg-teal-surface border border-teal-subtle">
                    Spa Teeth Cleaning
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="rounded-3xl bg-white border border-slate-100 p-8 shadow-diffuse hover:shadow-diffuse-lg transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Icons.Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="text-base text-slate-heading font-medium leading-relaxed mb-6">
                  "I lost two molars in an accident. Dr. Ahmed placed Straumann titanium implants using 3D guidance. No cuts, no stitches, and I had zero swelling the next day. Highly recommended!"
                </blockquote>
                <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-display font-bold text-sm text-slate-heading">Zainab Farooq</div>
                    <div className="text-xs text-slate-muted">DHA Phase 6 • Karachi</div>
                  </div>
                  <span className="text-xs font-semibold text-teal-medical px-3 py-1 rounded-full bg-teal-surface border border-teal-subtle">
                    Painless Dental Implants
                  </span>
                </div>
              </div>

              <div className="rounded-3xl bg-teal-surface border border-teal-subtle p-8 shadow-diffuse hover:shadow-diffuse-lg transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Icons.Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="text-base sm:text-lg text-slate-heading font-medium leading-relaxed mb-6">
                  "Every detail is top tier. Private suite, noise-cancelling headphones, and completely honest advice. They don't push unnecessary treatments."
                </blockquote>
                <div className="pt-5 border-t border-teal-subtle flex items-center justify-between">
                  <div>
                    <div className="font-display font-bold text-sm text-slate-heading">Mustafa Qureshi</div>
                    <div className="text-xs text-slate-muted">KDA Scheme 1 • Karachi</div>
                  </div>
                  <span className="text-xs font-semibold text-teal-medical px-3 py-1 rounded-full bg-white shadow-sm">
                    Invisalign Aligners
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* NEW SECTION 4: LOCATION, VALET PARKING & TIMINGS BAR */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-alabaster border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                <Icons.MapPin className="w-6 h-6 text-teal-medical" />
              </div>
              <div>
                <strong className="text-xs uppercase tracking-wider text-slate-muted block">Clinic Location</strong>
                <span className="font-display font-bold text-slate-heading text-sm block">Main Shahbaz Commercial, DHA Phase 6</span>
                <span className="text-xs text-slate-body">Second branch: Clifton Block 4</span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-alabaster border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                <Icons.Clock className="w-6 h-6 text-teal-medical" />
              </div>
              <div>
                <strong className="text-xs uppercase tracking-wider text-slate-muted block">Working Hours</strong>
                <span className="font-display font-bold text-slate-heading text-sm block">Mon – Sat: 11:00 AM – 9:00 PM</span>
                <span className="text-xs text-slate-body">Late evening slots available</span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-alabaster border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                <Icons.Car className="w-6 h-6 text-teal-medical" />
              </div>
              <div>
                <strong className="text-xs uppercase tracking-wider text-slate-muted block">Valet Parking</strong>
                <span className="font-display font-bold text-slate-heading text-sm block">Complimentary Valet Service</span>
                <span className="text-xs text-slate-body">Hassle-free parking at clinic door</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 md:py-28 bg-slate-alabaster border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 text-center">
          
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-teal-medical block mb-3">
            Easy Online Booking
          </span>

          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-slate-heading tracking-tight leading-tight mb-4">
            Ready to Smile with Confidence?
          </h2>

          <p className="text-base text-slate-body max-w-lg mx-auto mb-8 font-normal leading-relaxed">
            Book a 1-on-1 private consultation at our DHA Phase 6 or Clifton clinic. We'll take digital 3D scans and explain every option clearly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setIsBookingOpen(true)}
              className="w-full sm:w-auto bg-teal-medical hover:bg-teal-hover text-white text-base font-semibold px-9 py-4 rounded-full transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-teal-medical/20 hover:-translate-y-1"
            >
              Book Consultation Online
            </button>
            <a
              href="https://wa.me/923001234567?text=Hi%20Aura%20Dental%20Spa,%20I%20want%20to%20book%20an%20appointment"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-emerald-50 text-slate-heading border border-slate-200 hover:border-emerald-300 text-base font-semibold px-7 py-4 rounded-full transition-all duration-300"
            >
              <Icons.WhatsApp className="w-5 h-5 text-emerald-500" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

        </div>
      </section>

      {/* Clean Footer */}
      <footer className="bg-white border-t border-slate-100 py-12 text-sm text-slate-muted">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-surface border border-teal-subtle flex items-center justify-center text-teal-medical">
              <Icons.Sparkles className="w-4 h-4 text-teal-medical" />
            </div>
            <div>
              <span className="font-display font-bold text-slate-heading text-base block leading-none">AURA DENTAL SPA</span>
              <span className="text-[10px] tracking-wider uppercase text-slate-muted font-medium">Main Shahbaz Commercial, DHA Phase 6 &bull; Clifton, Karachi</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-medium text-slate-body">
            <a href="#services" className="hover:text-teal-medical transition-colors">Treatments</a>
            <a href="#transformation" className="hover:text-teal-medical transition-colors">Before &amp; After</a>
            <a href="#pricing" className="hover:text-teal-medical transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-teal-medical transition-colors">FAQs</a>
            <a href="/spa-admin" className="text-teal-medical font-semibold hover:underline">Reception Admin</a>
            <a href="tel:+923001234567" className="hover:text-teal-medical transition-colors">+92 300 1234567</a>
          </div>

          <div className="text-xs text-slate-muted">
            &copy; 2026 Aura Dental Spa Karachi. All rights reserved.
          </div>

        </div>
      </footer>

      {/* Easy Booking Modal */}
      {isBookingOpen && (
        <div 
          onClick={closeBooking}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 relative my-auto max-h-[92vh] overflow-y-auto"
          >
            
            {/* Top Prominent Close Button */}
            <button
              type="button"
              onClick={closeBooking}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all z-40 shadow-xs"
              title="Close Voucher (Esc)"
              aria-label="Close"
            >
              <Icons.Close className="w-5 h-5 text-slate-700" />
            </button>

            {!bookingSuccess ? (
              <div>
                <div className="mb-5 pr-8">
                  <span className="text-xs uppercase tracking-widest font-bold text-teal-medical block mb-1">
                    Direct Appointment
                  </span>
                  <h3 className="font-display font-extrabold text-2xl text-slate-heading">
                    Book Your Visit
                  </h3>
                  <p className="text-xs text-slate-muted mt-1">
                    DHA Phase 6 Suite • Confirmed within 30 seconds.
                  </p>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-4 pr-1">
                  
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-heading mb-1.5">
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (formErrors.name) setFormErrors({ ...formErrors, name: null });
                      }}
                      placeholder="e.g. Tariq Mehmood"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-alabaster border border-slate-200 text-slate-heading text-sm focus:outline-none focus:border-teal-medical focus:ring-1 focus:ring-teal-medical"
                    />
                    {formErrors.name && (
                      <p className="text-[11px] text-rose-500 font-semibold mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  {/* Mobile & WhatsApp Number (Strictly Digits Only) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-heading">
                        Mobile / WhatsApp Number <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] text-slate-400 font-medium">11 Digits (03XX) or +92</span>
                    </div>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handlePhoneInput}
                      placeholder="e.g. 03001234567 or +923001234567"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-alabaster border border-slate-200 text-slate-heading text-sm font-mono focus:outline-none focus:border-teal-medical focus:ring-1 focus:ring-teal-medical"
                    />
                    {formErrors.phone ? (
                      <p className="text-[11px] text-rose-500 font-semibold mt-1">{formErrors.phone}</p>
                    ) : (
                      <p className="text-[10px] text-slate-400 mt-1">Numbers only. Enter 11-digit mobile (03001234567) or +92 prefix.</p>
                    )}
                  </div>

                  {/* Compulsory Email Address */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-heading mb-1.5">
                      Email Address <span className="text-rose-500">*</span> <span className="text-[10px] font-normal text-slate-400">(Compulsory for Voucher)</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (formErrors.email) setFormErrors({ ...formErrors, email: null });
                      }}
                      placeholder="e.g. tariq.mehmood@gmail.com"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-alabaster border border-slate-200 text-slate-heading text-sm focus:outline-none focus:border-teal-medical focus:ring-1 focus:ring-teal-medical"
                    />
                    {formErrors.email && (
                      <p className="text-[11px] text-rose-500 font-semibold mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  {/* Specialist & Suite */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-heading mb-1.5">
                      Select Specialist &amp; Suite
                    </label>
                    <select
                      value={formData.specialist}
                      onChange={(e) => {
                        setFormData({ ...formData, specialist: e.target.value, timeSlot: '' });
                      }}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-alabaster border border-slate-200 text-slate-heading text-sm focus:outline-none focus:border-teal-medical"
                    >
                      {SPECIALISTS.map(s => (
                        <option key={s.id} value={s.name}>{s.name} ({s.suite} &bull; {s.dayNames})</option>
                      ))}
                    </select>
                  </div>

                  {/* Doctor's Consultation Schedule & Dynamic Conflict-Free Slot Manager */}
                  <div className="bg-slate-alabaster border border-slate-200/80 rounded-2xl p-4 space-y-3">
                    
                    <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-200/60">
                      <span className="font-bold text-slate-heading flex items-center gap-1.5">
                        <Icons.Clock className="w-3.5 h-3.5 text-teal-medical" />
                        <span>Doctor Consultation Days:</span>
                      </span>
                      <span className="font-semibold text-teal-medical bg-teal-50 px-2.5 py-0.5 rounded-full text-[11px] border border-teal-200/60">
                        {currentDoctor.dayNames}
                      </span>
                    </div>

                    {/* Quick Active Days Shortcut Pills */}
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-muted block mb-1.5">
                        Next Active Clinic Days:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {nextActiveDays.map((d) => (
                          <button
                            key={d.dateStr}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, date: d.dateStr, timeSlot: '' }));
                              if (formErrors.date) setFormErrors(prev => ({ ...prev, date: null }));
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                              formData.date === d.dateStr
                                ? 'bg-teal-medical text-white shadow-sm'
                                : 'bg-white text-slate-heading border border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {d.display}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Date Picker */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-muted mb-1">
                        Or Pick Specific Date:
                      </label>
                      <input
                        type="date"
                        required
                        min={todayStr}
                        value={formData.date}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, date: e.target.value, timeSlot: '' }));
                          if (formErrors.date) setFormErrors(prev => ({ ...prev, date: null }));
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-heading text-xs focus:outline-none focus:border-teal-medical"
                      />
                      {formErrors.date && (
                        <p className="text-[11px] text-rose-500 font-semibold mt-1">{formErrors.date}</p>
                      )}
                    </div>

                    {/* Real-Time Live Time Slots Grid (Collision Protected) */}
                    {isDateOnDuty && (
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-heading">
                            Available Time Slots:
                          </span>
                          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live Schedule
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {computedSlots.map(({ slot, isBooked }) => {
                            if (isBooked) {
                              return (
                                <div
                                  key={slot}
                                  className="px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-400 text-xs font-semibold text-center cursor-not-allowed opacity-60 flex items-center justify-center gap-1"
                                  title="This slot is already reserved by another patient or reception"
                                >
                                  <span className="text-[10px]">🔒</span>
                                  <span className="line-through">{slot}</span>
                                </div>
                              );
                            }

                            const isSelected = formData.timeSlot === slot;
                            return (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, timeSlot: slot }));
                                  if (formErrors.timeSlot) setFormErrors(prev => ({ ...prev, timeSlot: null }));
                                }}
                                className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                  isSelected
                                    ? 'bg-teal-medical text-white shadow-md shadow-teal-medical/20 scale-[1.02]'
                                    : 'bg-white text-slate-heading border border-teal-200/80 hover:border-teal-medical hover:bg-teal-surface/50'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500'}`}></span>
                                <span>{slot}</span>
                              </button>
                            );
                          })}
                        </div>

                        {formErrors.timeSlot && (
                          <p className="text-[11px] text-rose-500 font-semibold mt-1.5">{formErrors.timeSlot}</p>
                        )}
                      </div>
                    )}

                  </div>

                  {/* Treatment Selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-heading mb-1.5">
                      Select Treatment
                    </label>
                    <select
                      value={formData.treatment}
                      onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-alabaster border border-slate-200 text-slate-heading text-sm focus:outline-none focus:border-teal-medical"
                    >
                      <option value="EMS Airflow® Spa Cleaning (PKR 6,500)">EMS Airflow® Spa Cleaning (PKR 6,500)</option>
                      <option value="Laser Teeth Whitening (PKR 25,000)">Laser Teeth Whitening (PKR 25,000)</option>
                      <option value="Hollywood Smile Porcelain Veneers (PKR 35,000)">Hollywood Smile Porcelain Veneers (PKR 35,000)</option>
                      <option value="Painless 3D Dental Implants (PKR 85,000)">Painless 3D Dental Implants (PKR 85,000)</option>
                      <option value="General Consultation & 3D Scan (PKR 3,500)">General Consultation &amp; 3D Scan (PKR 3,500)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 bg-teal-medical hover:bg-teal-hover text-white font-semibold py-3.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    Confirm Appointment Booking
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-2">
                <div className="w-14 h-14 rounded-full bg-teal-surface border border-teal-subtle text-teal-medical flex items-center justify-center mx-auto mb-3">
                  <Icons.Check className="w-7 h-7 text-teal-medical" />
                </div>
                <h3 className="font-display font-extrabold text-2xl text-slate-heading mb-1">
                  Voucher &amp; Token Confirmed!
                </h3>
                <p className="text-xs text-slate-body max-w-xs mx-auto mb-4">
                  Your sequential queue position has been registered for DHA Phase 6:
                </p>

                <div className="bg-teal-50/80 border border-teal-200/90 rounded-3xl p-4 text-center mb-5 shadow-sm">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-medical block mb-1">
                    OFFICIAL PATIENT QUEUE VOUCHER
                  </span>
                  <div className="font-mono font-extrabold text-3xl text-teal-medical tracking-wider">
                    {bookingSuccess.ref}
                  </div>
                  <div className="text-xs font-semibold text-slate-heading mt-2 flex items-center justify-center gap-2">
                    <span className="bg-white px-3 py-1 rounded-full border border-teal-200 shadow-sm text-teal-800 font-bold">
                      Queue Position: #{bookingSuccess.queueNum} in Line
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                      ● Active
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-muted bg-slate-alabaster p-4 rounded-2xl border border-slate-200/60 text-left space-y-2 mb-5">
                  <div className="flex justify-between items-center"><span className="font-medium text-slate-500">Patient:</span> <strong className="text-slate-heading text-sm">{bookingSuccess.name}</strong></div>
                  <div className="flex justify-between items-center"><span className="font-medium text-slate-500">Mobile:</span> <strong className="text-slate-heading">{bookingSuccess.phone}</strong></div>
                  <div className="flex justify-between items-center"><span className="font-medium text-slate-500">Email:</span> <strong className="text-teal-medical">{bookingSuccess.email}</strong></div>
                  <div className="flex justify-between items-center"><span className="font-medium text-slate-500">Queue Order:</span> <span className="bg-teal-medical text-white font-bold px-2 py-0.5 rounded-full text-[10px]">Turn #{bookingSuccess.queueNum}</span></div>
                  <div className="flex justify-between items-center"><span className="font-medium text-slate-500">Specialist:</span> <strong className="text-slate-heading">{bookingSuccess.doctor} ({bookingSuccess.suite})</strong></div>
                  <div className="flex justify-between items-center"><span className="font-medium text-slate-500">Treatment:</span> <strong className="text-slate-heading">{bookingSuccess.treatment}</strong></div>
                  <div className="flex justify-between items-center"><span className="font-medium text-slate-500">Confirmed Slot:</span> <strong className="text-slate-heading">{bookingSuccess.date} at {bookingSuccess.time}</strong></div>
                  <div className="flex justify-between items-center"><span className="font-medium text-slate-500">Status:</span> <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full text-[10px] border border-amber-200">Awaiting Treatment</span></div>
                  <div className="flex justify-between items-center"><span className="font-medium text-slate-500">Location:</span> <span className="text-teal-medical font-semibold">DHA Phase 6 Suite, Karachi</span></div>
                </div>

                <div className="space-y-3">
                  {/* Calendar Reminder Alert Box */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2 text-left">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-heading">
                      <span className="flex items-center gap-1.5 text-teal-medical">
                        <Icons.Bell className="w-4 h-4 text-teal-medical" />
                        <span>Appointment Reminder (Auto Alert)</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal">Never Miss Your Visit</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <a
                        href={getGoogleCalendarUrl(bookingSuccess)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-teal-medical hover:bg-teal-50/50 text-slate-heading text-xs font-semibold transition-all shadow-2xs hover:shadow-xs"
                        title="Add directly to your Google Calendar with 24h & 2h alerts"
                      >
                        <Icons.Calendar className="w-3.5 h-3.5 text-teal-medical" />
                        <span>Add to Google Calendar</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => downloadIcsReminder(bookingSuccess)}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-teal-medical hover:bg-teal-50/50 text-slate-heading text-xs font-semibold transition-all shadow-2xs hover:shadow-xs"
                        title="Download .ics reminder file for iPhone, Outlook, or Android"
                      >
                        <Icons.Download className="w-3.5 h-3.5 text-teal-medical" />
                        <span>Download .ics Reminder</span>
                      </button>
                    </div>
                  </div>

                  {/* Send to Reception WhatsApp */}
                  <a
                    href={`https://wa.me/923001234567?text=${encodeURIComponent(`Assalam-o-Alaikum Aura Dental Spa!\n\nI have booked an appointment online:\n• Voucher Token: ${bookingSuccess.ref} (Turn #${bookingSuccess.queueNum})\n• Patient: ${bookingSuccess.name}\n• Mobile: ${bookingSuccess.phone}\n• Email: ${bookingSuccess.email}\n• Doctor: ${bookingSuccess.doctor} (${bookingSuccess.suite})\n• Treatment: ${bookingSuccess.treatment}\n• Confirmed Slot: ${bookingSuccess.date} at ${bookingSuccess.time}\n\nPlease confirm my slot in line.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-full transition-colors text-sm flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Icons.WhatsApp className="w-4 h-4" />
                    <span>Send Voucher to Reception WhatsApp</span>
                  </a>

                  {/* Clear Dismiss / Done Button */}
                  <button
                    type="button"
                    onClick={closeBooking}
                    className="w-full bg-slate-heading hover:bg-slate-800 text-white font-bold py-3.5 rounded-full transition-all text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <Icons.Check className="w-4 h-4 text-emerald-400" />
                    <span>Done &amp; Close Voucher</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

// Mount React 18 safely
try {
  const container = document.getElementById('root');
  if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(<DentalSpaApp />);
  }
} catch (mountErr) {
  console.error("Mount error:", mountErr);
}
