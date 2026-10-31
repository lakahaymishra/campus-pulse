# Campus Pulse – AI-Powered Campus Information Hub

A modern, responsive, intelligent campus announcement platform designed to eliminate information overload for university students. **Campus Pulse** unifies messy WhatsApp forwards, department emails, hackathon posters, and exam circulars into a single structured, searchable, and actionable hub.

---

## 🌟 Highlights & Key Features

### 1. 🧠 Smart AI Notice Input
- **Universal Unstructured Text Parser**: Paste WhatsApp group forwards (emojis, asterisks, messy formatting), email circulars, or poster captions.
- **Dual-Engine Architecture**:
  - **Live Google Gemini 1.5 Flash LLM**: Connected via user API key with strict JSON schema validation.
  - **Built-in Smart Heuristics Engine (Demo Mode)**: 100% offline, deterministic rule-based natural language parser that works out-of-the-box with zero setup.
  - **Zero Deception**: Clearly signals whether the live Gemini API or the built-in offline engine is active.
- **Graceful Handling of Missing Data**: Never hallucinates missing information. If venue, time, or deadline is absent, it highlights them in a warning banner for manual review.
- **Pre-Save Interactive Editor**: Review and adjust title, category, priority, date, time, venue, deadline, and organizer before saving.
- **Duplicate Prevention Warning**: Real-time title similarity and date matching alerts students if a similar announcement already exists.

### 2. 📊 Smart Dashboard
- **Live Metrics**:
  - Total Announcements count
  - Upcoming Scheduled Events
  - Urgent Notices (with pulsing beacon and priority alert ticker)
  - Expired / Past Notices archive
  - Today's Active Updates
- **Urgent Announcement Banner**: High-priority alert banner with deadline reminders and 1-click details view.
- **Latest Updates Stream**: Rapid access to recently published notices.
- **Category Distribution Hub**: Instant navigation pills with live item counts.

### 3. 🗂️ Organised Announcements
- **Instant Search**: Fuzzy search across title, description, venue, organizer, and tags.
- **7 Campus Categories**:
  - 📝 Examination
  - 💼 Placement & Internships
  - 💻 Academic
  - 🚀 Events & Hackathons
  - ⚽ Sports
  - 🎸 Cultural
  - 📢 General Campus Facilities
- **Multi-Filter System**:
  - Filter by Category
  - Filter by Priority (`Urgent`, `High`, `Normal`, `Low`)
  - Filter by Status (`All`, `Active & Upcoming`, `Happening Today`, `Expired`)
- **Flexible Sorting**: Earliest Date, Latest Date, Priority (Urgent first), Alphabetical.
- **Dual View Modes**: Switch between **Modern Card Grid View** and **Dense List View**.

### 4. 📅 Interactive Campus Calendar
- **Monthly Grid View**: Color-coded category event pills on scheduled dates.
- **Today Spotlight**: Glowing indicator for the current simulated date (`October 31, 2026`).
- **Interactive Day Drawer**: Click any date to view all scheduled events, timings, and venues.
- **Quick Add**: "+ Add Notice for this Date" shortcut directly from the calendar.
- **Export to Calendar (`.ics`)**: 1-click download of RFC 5545 standard `.ics` files compatible with Google Calendar, Apple Calendar, and Microsoft Outlook.

### 5. ⚡ "What Do I Need to Know This Week?" (AI Weekly Summary)
- **Executive Campus Briefing**: Analyzes all saved announcements for the upcoming 7 days.
- **Categorized Synthesis**:
  - 🚨 Urgent Action Items
  - 📝 Examination Schedules & Hall Ticket Deadlines
  - 💻 Academic Assignments & Submissions
  - 💼 Placement Drives & Registration Cutoffs
  - 🏆 Sports & Cultural Festivities
- **Interactive Action Checklist**: Checkbox list of deadlines with progress meter.
- **Audio Readout (Text-to-Speech)**: Synthesized speech narration of the briefing using Web Speech API.
- **1-Click WhatsApp / Notion Copy**: Formatted markdown/text ready to paste into study groups.

### 6. 🔔 Priority and Reminder System
- **Visual Priority Badges**: Bold rose badges, glowing beacons, and alert tags.
- **In-App Notification Center**: Bell icon in header displays active reminders with unread badge counter.
- **Web Audio Chimes**: Pleasant synthesized audio feedback on actions (reminders, saves, deletions).
- **Desktop Notifications**: Browser notification integration.

### 7. ⚙️ Settings & Visual Customization Hub
- **5 Dynamic Background Themes**:
  - **✨ Aurora Glow (Default)**: Modern vibrant indigo, sapphire, and cyan ambient radiant mesh with animated glow orbs.
  - **🌌 Cosmic Nebula**: Deep galaxy purple, magenta, and starry luminous glow.
  - **⚡ Cyber Matrix**: High-tech isometric cyan grid with electric blue luminescence.
  - **🌊 Oceanic Abyss**: Deep marine teal and aqua gradient.
  - **🖤 Obsidian Slate**: Ultra-clean minimalist matte dark aesthetic.
- **Instant Background Switcher**: Dedicated Palette icon in the top header and full gallery in Settings.
- **Google Gemini API Key Config**: Input and test connection button with instant status feedback.
- **Campus & Student Profile**: Personalize college name, student name, and academic program.
- **Full Data Persistence**: Retains all changes and chosen theme across page refreshes via `LocalStorage`.
- **Backup & Restore**: Export full database as `.json` and import backups.
- **Reset to College Samples**: Instantly reloads 8 realistic campus announcements.

---

## 🚀 Quickstart & Usage

Campus Pulse is built with a self-contained architecture. **No build step, no npm installation, and no local server is required.**

### Option A: Direct Browser Launch (Simplest)
1. Double-click `index.html` or drag it into any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari).
2. The application will immediately load with pre-populated sample announcements.

### Option B: Local Web Server (Optional)
If you prefer running through a local development server:
```bash
# Using Python
python -m http.server 3000

# Or using npx serve
npx serve .
```
Then visit `http://localhost:3000` in your browser.

---

## 📋 Realistic Sample College Announcements Included

1. **Mid-Semester Examination Schedule**: Autumn 2026 B.Tech & MCA exam dates and hall ticket collection deadline (`2026-11-05`).
2. **Google & Microsoft Internship Drive**: Pre-final year recruitment drive with Superset registration deadline (`2026-11-07`).
3. **HackPulse 2026**: 36-hour national campus hackathon registration notice with ₹3.5L prize pool (`2026-11-14`).
4. **CS302 Machine Learning Assignment 3**: Backprop & CNNs submission due on GitHub Classroom (`2026-11-02`).
5. **Inter-University Sports Trials**: Football and basketball varsity selections at Central Stadium (`2026-11-10`).
6. **Spandan 2026 Battle of the Bands**: Rock band auditions at Open Air Amphitheatre (`2026-11-12`).
7. **Central Library 24x7 Extended Hours**: Round-the-clock reading hall operations for exam month (`2026-11-01`).
8. **Mandatory Biometric Verification**: Urgent notice for scholarship beneficiaries happening today (`2026-10-31`).

---

## 🎨 UI/UX Design Palette

- **Background**: Deep Navy Canvas (`#070B19`)
- **Containers & Cards**: Glassmorphic Slate (`rgba(15, 26, 58, 0.7)` with `border-slate-800`)
- **Primary Accents**: Electric Brand Blue (`#3B82F6`) & Indigo (`#6366F1`)
- **Category Colors**:
  - Examination: Crimson / Rose (`#F43F5E`)
  - Placement: Sky Blue (`#0284C7`)
  - Academic: Indigo (`#6366F1`)
  - Events: Amber (`#F59E0B`)
  - Sports: Emerald (`#10B981`)
  - Cultural: Fuchsia (`#D946EF`)
- **Typography**: Inter (Body) & Plus Jakarta Sans (Display Headings)

---

## 📂 File Architecture

```
hack/
├── index.html                   # Complete Single Page Application (React 18 + Tailwind + Lucide Icons)
├── README.md                    # Documentation, Features & Architecture overview
└── src/
    ├── data/
    │   └── sampleAnnouncements.js # Rich sample college announcements data
    └── services/
        ├── aiExtractor.js         # Gemini API + Smart Heuristic NLP Parser
        ├── weeklySummaryService.js# Weekly summary generator & action checklist
        ├── storage.js             # LocalStorage CRUD, duplicates check & backup
        ├── calendarIcs.js         # RFC 5545 iCalendar (.ics) generator
        └── audioFeedback.js       # Web Audio API chime synthesizer & TTS
```

---

## 🛡️ License
Built for educational and campus community use. Developed with excellence for **Campus Pulse**.
