# Nabila Melsyana - Portfolio Website

Sebuah website profil interaktif yang menampilkan portofolio, proyeksi, dan pengalaman dengan fitur game memory card yang seru, animasi 3D, dan desain modern yang responsif.

## 🎨 Fitur Utama

### 1. **Landing Page (Hero Section)**
- Animasi pembuka yang memukau dengan floating cubes dan rings 3D
- Gradient orbs yang bergerak dinamis
- Floating particles dengan animasi smooth
- Typewriter effect untuk subtitle
- Call-to-action buttons menuju projects dan game

### 2. **About Section**
- Story personal dengan summary
- Education & certification cards
- **Traits Showcase** - 4 kartu yang menampilkan kualitas personal:
  - ⚡ Fast Learner
  - 👥 Team Player
  - 🔍 Detail Oriented
  - 🔄 Adaptable
- **Interactive Timeline** - Journey pengalaman dengan:
  - Timeline visual dengan dots dan garis
  - Expandable experience cards
  - Highlight teknologi yang digunakan
  - Location dan periode yang detail

### 3. **Skills Section**
- Kategori skills yang dapat dipilih:
  - Programming & Web (HTML, CSS, JS, Laravel, etc)
  - Product & QA (UML, Testing, Scrum, etc)
  - Data & Reporting (Excel, Tableau, etc)
  - Tools & Platforms (Git, VS Code, Figma, Docker, etc)
- Animated skill bars dengan percentage
- Tilt card effect saat hover
- Smooth category transitions

### 4. **Projects Section**
- Grid gallery projects dengan filter kategori
- Project cards dengan:
  - Deskripsi singkat
  - Tech stack tags
  - Color indicator unik per project
  - Hover effects dan animasi
- Category filter: All, Web Dev, System, Architecture
- CTA menuju GitHub

### 5. **Interactive Game**
- **Memory Card Matching Game** dengan tech skill cards
- Features:
  - 8 pairs of tech cards dengan flip animation 3D
  - Real-time move counter
  - Progress bar visual
  - Sound effects (flip, match, win)
  - Sound on/off toggle
  - Best score tracking dengan localStorage
  - Responsive grid (3 kolom mobile, 4 kolom desktop)
  - Victory modal dengan encouraging message
  - Play again functionality

### 6. **Contact Section**
- Contact info cards (Email, Phone, Location)
- Interactive contact form dengan:
  - Form validation
  - Smooth animation
  - Success message feedback
- Social media links (LinkedIn, GitHub, Email)
- WhatsApp integration
- Quick response time notice

### 7. **Footer**
- Navigation links
- Contact information
- Social links
- Copyright dengan heart animation
- Responsive design

## 🚀 Teknologi yang Digunakan

### Frontend
- **React 18** - UI Library
- **Framer Motion** - Advanced animations
- **Lucide React** - Beautiful icons
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool

### Design Patterns
- Component-based architecture
- Reusable components dengan props
- Framer Motion hooks (useInView)
- Custom CSS animations
- 3D transforms dan perspective

### Animasi & Effects
- Hero section dengan 3D floating elements
- Scroll-triggered animations
- Parallax effects
- Micro-interactions
- Floating particles
- Card flip animations (3D transform)
- Progress bar animations
- Hover effects dengan scale & glow
- Typing animation effect

## 📁 Struktur Project

```
app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Skills.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Game.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── Footer.jsx
│   │   ├── data/
│   │   │   └── index.js (export dari mock.js)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .gitignore
├── mock.js (Data store)
└── plan.md
```

## 🎮 Game Section Details

### Memory Game
- **Objective**: Temukan semua pasangan cards yang cocok
- **Cards**: 16 cards (8 pairs) dengan tech icons
- **Mechanics**:
  - Klik card untuk membalik
  - Coba match 2 cards yang sama
  - Kalau cocok, cards tetap terbuka (matched)
  - Kalau tidak, cards kembali tertutup
  - Hitung jumlah moves yang digunakan
  - Track best score dengan localStorage

### Sound Effects
- Flip sound (800Hz, short beep)
- Match sound (1200Hz, longer beep)
- Wrong sound (400Hz, descending tone)
- Win sound (1500Hz, triumphant sound)

## 🎨 Design System

### Color Palette
- Primary: `#00e5a0` (Green)
- Secondary: `#38bdf8` (Blue)
- Accent: `#a78bfa` (Purple)
- Warm: `#fbbf24` (Amber)
- Dark: `#06060e` (Deep Dark)
- Darker: `#0d0f1a` (Darker)
- Border: `#1a1d2e` (Dark Gray)

### Typography
- Font Family: Space Mono (Headings), System default (Body)
- Font Sizes: Responsive dengan Tailwind
- Line Heights: 1.5 - 1.8 untuk readability

### Spacing & Layout
- Max-width: 7xl (80rem)
- Padding: 6-8 responsive
- Gap: 4-8 pada grids
- Border Radius: 2xl (1rem) untuk cards

## 🔧 Installation & Setup

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0

### Steps
```bash
# Navigate ke project folder
cd app/frontend

# Install dependencies
npm install

# Development server
npm run dev

# Build untuk production
npm run build

# Preview production build
npm run preview
```

## 📱 Responsive Design

- **Mobile** (< 768px): Single column, compact padding, 3-column game grid
- **Tablet** (768px - 1024px): 2-column layouts, increased spacing
- **Desktop** (> 1024px): 3-4 column layouts, full animations

## ✨ Performance Optimizations

- Lazy loading images & components
- Smooth animations dengan GPU acceleration
- Optimized CSS dengan Tailwind
- Vite untuk fast HMR development
- Minified production builds

## 📝 Konten & Data

Semua data (personal info, skills, experiences, projects, traits) disimpan di `mock.js` dan dapat diakses via data/index.js exports.

## 🤝 Features untuk Improvement (Future)

1. Backend integration untuk form submission
2. Dark/Light mode toggle
3. Lebih banyak game options
4. Blog section
5. Testimonials section
6. More interactive visualizations
7. API integration untuk GitHub projects
8. Email notifications

## 📄 License

MIT License - Bebas digunakan untuk keperluan personal maupun komersial.

## 👋 Contact

- **Email**: nabilamelsyana5@gmail.com
- **Phone**: +62 8885169997
- **LinkedIn**: linkedin.com/in/nabilamelsyana
- **GitHub**: github.com/nabilamelsyana
- **Location**: Jakarta, Indonesia

---

**Built with ❤️ using React, Framer Motion & Tailwind CSS**
