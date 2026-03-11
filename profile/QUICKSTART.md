# Quick Start Guide

## 🚀 Memulai Website Profil

### 1. Install Dependencies
```bash
cd app/frontend
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Browser akan otomatis membuka `http://localhost:5173`

### 3. Edit & Customize

#### Update Personal Info
Edit `app/mock.js`:
```javascript
export const personalInfo = {
  name: "Your Name",
  firstName: "Your",
  email: "your@email.com",
  // ... update other fields
}
```

#### Update Skills
Edit `skills` object di `app/mock.js`:
```javascript
export const skills = {
  programming: [
    { name: "Your Skill", level: 85 },
    // ... add more
  ],
  // ... other categories
}
```

#### Update Projects
Edit `projects` array di `app/mock.js`:
```javascript
export const projects = [
  {
    id: 1,
    title: "Your Project",
    description: "...",
    tech: ["Tech1", "Tech2"],
    category: "Web Dev",
    color: "#00e5a0",
  },
  // ... add more
]
```

#### Update Experiences
Edit `experiences` array di `app/mock.js`:
```javascript
export const experiences = [
  {
    id: 1,
    role: "Your Role",
    company: "Company Name",
    period: "Jan – Dec 2024",
    // ... other fields
  },
]
```

### 4. Customize Design

#### Change Colors
Edit `app/frontend/tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#00e5a0', // Change this
      secondary: '#38bdf8',
      // ... more colors
    }
  }
}
```

#### Change Fonts
Edit `app/frontend/src/index.css`:
```css
.font-space {
  font-family: 'Your Font', monospace;
}
```

### 5. Add More Sections

Create new component di `app/frontend/src/components/`:
```jsx
import React from "react";
import { motion } from "framer-motion";

const YourSection = () => {
  return (
    <section id="your-section">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Your content here
      </motion.div>
    </section>
  );
};

export default YourSection;
```

Kemudian import di `App.jsx`:
```jsx
import YourSection from "./components/YourSection";

// Di dalam return JSX
<YourSection />
```

### 6. Deploy

```bash
# Build
npm run build

# Preview before deploy
npm run preview
```

### 7. Useful Links

- [React Docs](https://react.dev)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [Vite Docs](https://vitejs.dev)

## 📱 Testing

### Mobile Testing
```bash
# Get your local IP
ipconfig getifaddr en0  # macOS
# or
hostname -I  # Linux

# Access via: http://<YOUR_IP>:5173
```

### Browser DevTools
- F12 untuk open Developer Tools
- Toggle Device Toolbar (Ctrl+Shift+M)
- Test di berbagai ukuran screen

## 🎮 Game Customization

Edit `app/frontend/src/components/Game.jsx`:

```javascript
// Change game cards (icons dari lucide-react)
export const gameCards = [
  { id: 1, icon: "Code", label: "Code" },
  // ... update dengan icons yang disukain
]

// Change game difficulty
const totalCards = gameCards.length * 2; // Tambah pairs untuk more difficult
```

## 🐛 Troubleshooting

### Error: Cannot find module 'mock'
- Pastikan `app/mock.js` exist
- Check path di `app/frontend/src/data/index.js`

### Styles tidak muncul
- Clear cache: `npm run build`, delete `dist/`
- Restart dev server: `ctrl+c` kemudian `npm run dev`

### Game tidak berfungsi
- Check console (F12) untuk error messages
- Verify `gameCards` di mock.js tidak kosong
- Check Framer Motion version compatibility

### Performance issue
- Reduce floating particles di Hero section
- Optimize images (WebP format)
- Check browser console untuk warnings

## 📚 Resources

- Full documentation: [README.md](./app/frontend/README.md)
- Deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Original plan: [PLAN.md](./plan.md)

## 💡 Tips

1. **Regular commits** saat mengubah apapun
2. **Test mobile version** sebelum deploy
3. **Update meta tags** di `index.html`
4. **Monitor bundle size** di build
5. **Keep dependencies updated**

---

Happy coding! 🎉

Untuk questions: nabilamelsyana5@gmail.com
