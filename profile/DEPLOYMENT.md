# Deployment Guide

## Pre-deployment Checklist

- [ ] Semua dependencies di-install: `npm install`
- [ ] Build successful: `npm run build`
- [ ] No console errors/warnings
- [ ] Game tested dan working
- [ ] Responsive design tested di mobile & desktop
- [ ] All links working correctly
- [ ] Meta tags updated dengan proper OG images
- [ ] Analytics setup (if needed)

## Development

```bash
cd app/frontend
npm install
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

## Build untuk Production

```bash
npm run build
```

Output akan di-generate di folder `dist/`

## Deployment Options

### 1. **Vercel** (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### 2. **Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### 3. **GitHub Pages**
Tambahkan di `vite.config.js`:
```javascript
export default {
  base: '/profile/',
  // ... rest of config
}
```

### 4. **Laragon / Local Server**
```bash
# Build
npm run build

# Copy dist/ ke folder public/web
# Akses via: http://localhost/profile/
```

### 5. **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## Environment Variables

Copy `.env.example` ke `.env.local` dan isi dengan nilai yang sesuai:

```bash
cp .env.example .env.local
```

## Performance Tips

1. **Image Optimization**
   - Gunakan WebP format untuk images
   - Optimize SVGs
   - Lazy load non-critical images

2. **Code Splitting**
   - Vite otomatis split kode
   - Monitor bundle size: `npm run build -- --analyze`

3. **Caching**
   - Set cache headers untuk static files
   - Use service workers untuk offline support

4. **SEO**
   - Meta tags sudah di-setup
   - Update og:image dengan screenshot
   - Verifikasi di Google Search Console

## Monitoring

- Setup Google Analytics via `.env`
- Monitor Core Web Vitals
- Check error logs regularly

## Security

- Update dependencies: `npm audit fix`
- Use HTTPS untuk production
- Validate form inputs
- Sanitize user inputs sebelum display

## Troubleshooting

### Port 5173 sudah digunakan
```bash
vite --port 3000
```

### Build error
```bash
# Clear cache
rm -rf node_modules
npm install
npm run build
```

### Git deployment error
```bash
# Rebind origin jika perlu
git remote set-url origin <new-url>
git push origin main
```

## Support

Untuk questions atau issues, contact:
- Email: nabilamelsyana5@gmail.com
- GitHub: github.com/nabilamelsyana
