# � Nabila's Portfolio - Modern Web Experience

A powerful, feature-rich portfolio built with **React**, **Three.js**, and **Framer Motion**. Features an interactive 3D galaxy background, multiple games, and a smooth user experience.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Status](https://img.shields.io/badge/status-Production%20Ready-green)

## ✨ Features

🎯 **9 Interactive Sections**
- **Hero** - Landing dengan animated 3D galaxy background (15k particles with morphing shapes)
- **About** - Personal story, traits, timeline, education
- **Skills** - Technical skills dengan visual progress indicators
- **Projects** - Portfolio showcase dengan filter & 3D tilt effect
- **Memory Game** - Interactive card matching game
- **Catch the Game** - Mouse-controlled falling items mini game ☕ (NEW!)
- **Contact** - Contact form dengan email integration
- **Footer** - Quick links & social media

🎨 **Visual Enhancements**
- ✅ Three.js 3D Galaxy particles dengan morphing shapes (Galaxy→Vortex→Sphere→Helix)
- ✅ Mouse proximity particle repulsion physics
- ✅ Scroll-based shape transitions
- ✅ Framer Motion smooth animations on all components
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark theme dengan neon accent colors (#00e5a0, #38bdf8, #a78bfa)

🎮 **Interactive Games**
- **Memory Card Game** - Match pairs of tech icons, localStorage best scores
- **Catch The Coffee** - Dodge enemies, catch items for points, 4 difficulty levels
- Both feature dynamic difficulty scaling & persistent scoring

⚡ **Performance**
- Vite for lightning-fast development & optimized builds
- GPU-accelerated 15,000 particle system dengan BufferGeometry
- Code splitting & lazy component loading
- Hardware-accelerated CSS animations

## 📂 Struktur File

```
profile/
├── app/
│   ├── frontend/                 # React app
│   │   ├── src/
│   │   │   ├── components/       # React components
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Hero.jsx
│   │   │   │   ├── About.jsx
│   │   │   │   ├── Skills.jsx
│   │   │   │   ├── Projects.jsx
│   │   │   │   ├── Game.jsx
│   │   │   │   ├── Contact.jsx
│   │   │   │   └── Footer.jsx
│   │   │   ├── data/
│   │   │   │   └── index.js      # Data exports
│   │   │   ├── App.jsx           # Main component
│   │   │   ├── main.jsx          # Entry point
│   │   │   └── index.css         # Global styles
│   │   ├── index.html            # HTML template
│   │   ├── vite.config.js        # Vite config
│   │   ├── tailwind.config.js    # Tailwind config
│   │   ├── postcss.config.js     # PostCSS config
│   │   ├── package.json          # Dependencies
│   │   ├── .gitignore
│   │   ├── .eslintrc.cjs
│   │   ├── .env.example
│   │   └── README.md
│   └── mock.js                   # Data file
├── plan.md                       # Original plan
├── QUICKSTART.md                 # Setup guide
├── DEPLOYMENT.md                 # Deployment guide
└── IMPLEMENTATION_STATUS.md      # Status report
```

## ✨ Fitur Unggulan

### 1. Animasi 3D Modern
- ✅ Floating cubes dengan rotation
- ✅ Spinning rings dengan perspective
- ✅ Gradient orbs yang bergerak
- ✅ Floating particles background
- ✅ Smooth parallax effects

### 2. Game Interaktif
- ✅ Memory card matching game
- ✅ 3D flip animations
- ✅ Sound effects (flip, match, win)
- ✅ Move counter & progress tracking
- ✅ Best score saved di localStorage
- ✅ Victory modal dengan CTA

### 3. Interactive Timeline
- ✅ Experience timeline visual
- ✅ Expandable cards dengan details
- ✅ Tech highlights/badges
- ✅ Smooth animations

### 4. Skills Mastery Display
- ✅ 4 kategori skills
- ✅ Animated progress bars
- ✅ Interactive tilt cards
- ✅ Color-coded categories

### 5. Project Gallery
- ✅ Grid layout responsif
- ✅ Category filters
- ✅ Hover effects & animations
- ✅ Tech stack display

### 6. Contact Integration
- ✅ Interactive form dengan validation
- ✅ Social media links
- ✅ Email & WhatsApp integration
- ✅ Success feedback

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| Build Tool | Vite |
| Package Manager | npm |
| Version Control | Git |

## 📖 Dokumentasi

### Quick Links
- **Setup Guide**: [QUICKSTART.md](./QUICKSTART.md) - Panduan cepat untuk mulai
- **Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md) - Cara deploy ke production
- **Full Docs**: [README.md](./app/frontend/README.md) - Dokumentasi lengkap
- **Status**: [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) - Checklist fitur
- **Original Plan**: [plan.md](./plan.md) - Rencana awal project

## 🎮 Game Mechanics

### Memory Game
- Flip 2 cards setiap turn
- Cocokkan icon yang sama
- Matched cards tetap terbuka
- Unmatched cards flip back
- Hitung total moves untuk win
- Track best score

### Controls
- Click card untuk flip
- "New Game" button untuk restart
- Sound toggle untuk audio effects
- Mobile-friendly dengan touch support

## 📱 Responsive Design

✅ Mobile (<768px) - Single column, compact
✅ Tablet (768-1024px) - Two columns
✅ Desktop (>1024px) - Multi-column with full animations

## 🎯 Customization

### Edit Personal Info
```javascript
// Di app/mock.js
export const personalInfo = {
  name: "Your Name",
  email: "your@email.com",
  // ... update fields
}
```

### Update Skills, Projects, Experiences
Edit respective arrays di `app/mock.js`

### Change Colors
Edit `app/frontend/tailwind.config.js` colors section

### Add/Modify Components
Create new `.jsx` files di `app/frontend/src/components/`

## 🚀 Deployment Options

1. **Vercel** (Recommended)
   ```bash
   vercel
   ```

2. **Netlify**
   ```bash
   netlify deploy --prod --dir=dist
   ```

3. **GitHub Pages**
   - Update base path di vite.config.js
   - Push to gh-pages branch

4. **Docker**
   - Use provided Dockerfile
   - Deploy image ke cloud

5. **Laragon/Local Server**
   - Build project
   - Copy dist/ ke folder public

Lihat [DEPLOYMENT.md](./DEPLOYMENT.md) untuk detail lengkap.

## 🔍 Performance

- ⚡ Vite untuk fast HMR
- 🎬 GPU-accelerated animations
- 📦 Optimized bundle size
- 🎯 Lazy loading dengan useInView
- 📱 Responsive images ready

## ♿ Accessibility

- ✅ Semantic HTML
- ✅ ARIA labels siap
- ✅ Focus states
- ✅ Keyboard navigation
- ✅ Color contrast compliant

## 🔐 Security

- ✅ Content Security Policy ready
- ✅ XSS protection (React)
- ✅ CSRF ready untuk forms
- ✅ No hardcoded secrets

## 📊 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## 🆘 Troubleshooting

### Port sudah dipakai
```bash
vite --port 3000
```

### Build error
```bash
rm -rf node_modules
npm install
npm run build
```

### Import error
- Check path di files
- Ensure mock.js location correct
- Verify data/index.js exports

Lihat [QUICKSTART.md](./QUICKSTART.md) untuk tips lainnya.

## 📝 Environment Setup

```bash
# Copy example
cp app/frontend/.env.example app/frontend/.env.local

# Edit dengan nilai Anda
# NODE_ENV=development
# Untuk production:
# NODE_ENV=production
```

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)
- [Lucide Icons](https://lucide.dev)

## 💬 Feedback & Support

**Contact Information:**
- 📧 Email: nabilamelsyana5@gmail.com
- 🔗 LinkedIn: linkedin.com/in/nabilamelsyana
- 🐙 GitHub: github.com/nabilamelsyana
- 📱 WhatsApp: +62 8885169997
- 📍 Location: Jakarta, Indonesia

## 📄 License

MIT License - Free to use for commercial & personal projects

## 🎉 Credits

**Built with ❤️ by:**
- Framer Motion - Smooth animations
- React - UI Framework
- Tailwind CSS - Styling
- Lucide React - Beautiful icons
- Vite - Lightning fast builds

---

## ✅ Project Status: COMPLETE

Semua fitur sudah diimplementasikan dan siap untuk:
- ✅ Development
- ✅ Customization
- ✅ Production Deployment

**Selamat! Website Anda siap untuk digunakan.** 🚀

Untuk memulai: `cd app/frontend && npm install && npm run dev`

---

**Last Updated**: February 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✨
