# ✨ AURA DENTAL SPA — Karachi
### Clinical Luxury Dental Clinic & Real-Time Reception Queue Operations Desk
**Locations:** Main Shahbaz Commercial, DHA Phase 6 & Clifton, Karachi, Pakistan  
**Emergency & Consultation WhatsApp:** [+92 300 1234567](https://wa.me/923001234567)  

---

## 🌐 Live Project Links
- **Patient Experience & Booking Suite:** [https://aliyan-ui-ux-coder.github.io/Dential-Clinic-/](https://aliyan-ui-ux-coder.github.io/Dential-Clinic-/)
- **Reception Desk & Queue Manager:** [https://aliyan-ui-ux-coder.github.io/Dential-Clinic-/admin.html](https://aliyan-ui-ux-coder.github.io/Dential-Clinic-/admin.html)
- **Local Dev Server:** `http://localhost:3000/` & `http://localhost:3000/admin`

---

## 📖 Project Overview
**Aura Dental Spa** is an end-to-end clinical luxury dental healthcare platform tailored for Karachi's premier medical districts (DHA Phase 6 & Clifton). It eliminates traditional dental clinic anxiety through private acoustic suites, gentle painless dentistry, intermediate non-intimidating English copy, and a synchronized real-time patient queue & token operations system.

---

## 🚀 Key Features

### 1. 🦷 Clinical Luxury Patient Experience
- **Painless Treatment Philosophy:** Highlights 0% pain, computerized local anesthesia, and gentle ultrasonic care.
- **Before & After Smile Transformation Slider:** Interactive touch & mouse comparison slider demonstrating natural Swiss porcelain veneers.
- **Alternating Hero Suite Visuals:** Smooth cross-fade carousel showcasing real treatment suites and digital 3D guided scanning.
- **Transparent Karachi Pricing (PKR):** Clear rates for EMS Airflow® cleaning, laser teeth whitening, E.max veneers, and Straumann® dental implants.

### 2. 🔒 Conflict-Free Dynamic Time Slot Booking
- **Doctor Consultation Schedules:**
  - **Dr. Ahmed Khan (Suite 1):** Chief Implant & Oral Surgeon • *Mon, Wed, Fri, Sat*
  - **Dr. Sophia Vance (Suite 2):** Swiss Aesthetic Smile Specialist • *Tue, Thu, Fri, Sun*
  - **Dr. Sara Malik (Suite 3):** Top 1% Invisalign® Clear Braces Specialist • *Mon, Tue, Thu, Sat*
- **Real-Time Collision Locking:** When a slot is booked (either online or at the reception desk), it is immediately locked with `🔒 Booked` and disabled to prevent double bookings.
- **Auto Active-Day Picker:** Suggests the next available consultation dates for the selected doctor.

### 3. 🇵🇰 Strict Pakistani Contact Validation
- **Mobile / WhatsApp Verification:** Enforces valid 11-digit Pakistani mobile numbers (`03XXXXXXXXX`) or country code format (`+923XXXXXXXXX` / `923XXXXXXXXX`). Rejects fake or non-numeric inputs.
- **Compulsory Email:** Required to deliver official digital vouchers and calendar invitations.

### 4. 🎟️ Sequential Line-by-Line Token Generation
- Issues official sequential queue vouchers (`SPA-001`, `SPA-002`, `SPA-007`...) with line position numbers (e.g. *Turn #7 in Line*).
- Live synchronization across multiple browser tabs via standard `localStorage` and `storage` events.

### 5. 📅 One-Click Appointment Reminders
- **Add to Google Calendar:** Automatically pre-fills patient name, doctor, treatment, confirmed date/time, and clinic address with automatic **24-hour** and **2-hour** reminder alerts.
- **Download .ics Calendar File:** Universal calendar file compatible with Apple Calendar (iOS/macOS), Android devices, and Microsoft Outlook.
- **Direct WhatsApp Messaging:** Instant one-click message pre-filled with voucher token for the clinic reception.

### 6. 🏥 Streamlined Reception Operations Desk (`/admin` / `spa-admin.html`)
- **4 Minimal Bento KPI Cards:** Today's Appointments, In Treatment, Completed, and Total Vouchers Issued.
- **Live Queue Table:** Instant status toggle (`Waiting in Lounge` ➔ `In-Chair` ➔ `Treatment Done`).
- **Desk Walk-In Booking Modal:** Receptionists can assign queue tokens, choose doctor consultation slots, and verify availability.
- **One-Click WhatsApp Reminders:** Receptionist can send customized token reminders to patients with a single click.

---

## 🛠️ Tech Stack & Architecture
- **Frontend Framework:** React 18 (Standalone Production Bundle compiled via `esbuild`)
- **Styling:** Tailwind CSS with Clinical Luxury Design Tokens (Emerald Teal `#0d9488`, Pure Slate `#0f172a`, Alabaster `#f8fafc`)
- **Typography:** Plus Jakarta Sans & Outfit
- **Data Store:** Reactive LocalStorage with Event-Driven Store API (`ClinicStore`)
- **Zero CDN Failure Points:** Completely self-contained JavaScript bundle (`js/dental-spa.bundle.js`, 295 KB).

---

## 💻 Local Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/Aliyan-UI-UX-coder/Dential-Clinic-.git
cd Dential-Clinic-

# 2. Install dependencies (optional if running pre-built bundle)
npm install

# 3. Build React bundle (already pre-built in js/dental-spa.bundle.js)
npm run build

# 4. Start local development server
npx serve -l 3000 .
```

Open your browser at:
- **Patient Site:** [http://localhost:3000/](http://localhost:3000/)
- **Admin Desk:** [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 📄 License
Created for Aura Dental Spa Karachi. All rights reserved © 2026.
