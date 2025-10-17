# Testing Guide - SN1325 Application

## 🚀 Quick Start

### 1. Start the Application

```bash
cd "c:/Users/bienv/Mon Drive/AKILI/PROJECTS 2026/SN1325/sn1325-app"
npm run dev
```

The app will start at: http://localhost:3000

### 2. Initialize the Database

Visit in your browser: **http://localhost:3000/api/init**

You should see a JSON response like:

```json
{
  "ok": true,
  "success": true,
  "summary": {
    "axes": 5,
    "provinces": 26,
    "users": 2,
    "dataEntries": 7
  }
}
```

## 👤 Test User Accounts

### Admin User

- **Email**: admin@sn1325.cd
- **Password**: admin123
- **Access**: Full administrative access
- **Province**: Kinshasa
- **Organization**: Secrétariat National 1325

### Consultant User

- **Email**: consultant@sn1325.cd
- **Password**: consult123
- **Access**: Read and Write permissions
- **Province**: Nord-Kivu
- **Organization**: ONU Femmes

## ✅ Testing Checklist

### 1. Dark Mode Toggle

- [ ] Click the sun/moon icon in the header
- [ ] Verify the entire page switches between light and dark themes
- [ ] Refresh the page - theme preference should persist
- [ ] Test on all pages: Home, About, Structures, Dashboard

### 2. Login Flow (Admin)

- [ ] Go to http://localhost:3000
- [ ] Click "Accéder au Tableau de Bord" or "Se connecter"
- [ ] Login with admin@sn1325.cd / admin123
- [ ] Should redirect to /dashboard
- [ ] Verify "Tableau de Bord" button shows in header
- [ ] Verify menu shows: À propos, Statistiques, Axes Stratégiques, Structures

### 3. Login Flow (Consultant)

- [ ] Logout if logged in
- [ ] Login with consultant@sn1325.cd / consult123
- [ ] Should redirect to /dashboard
- [ ] Verify consultant can see dashboard
- [ ] Verify consultant has limited access (no admin features)

### 4. Navigation (Logged In)

- [ ] Click "À propos" - should show about page
- [ ] Click "Statistiques" - should go to statistics page
- [ ] Click "Axes Stratégiques" - should show axes page
- [ ] Click "Structures" - should show structures list
- [ ] Click "Tableau de Bord" - should return to dashboard

### 5. Navigation (Logged Out)

- [ ] Logout or visit in incognito mode
- [ ] Verify only "À propos" and "Se connecter" are visible in menu
- [ ] Click "Accéder au Tableau de Bord" on home - should go to signin
- [ ] Statistiques, Axes, Structures links should NOT be visible

### 6. Homepage Design

- [ ] Verify beautiful gradient hero section
- [ ] Verify animated shield icon in hero
- [ ] Verify 4 statistics cards with gradient icons
- [ ] Verify "À Propos de la Résolution 1325" section
- [ ] Verify 3 colored feature boxes at bottom
- [ ] Test hover effects on all cards
- [ ] Test responsive design (resize browser)

### 7. About Page

- [ ] Visit /about
- [ ] Verify page title and description
- [ ] Verify 3 objectives listed
- [ ] Verify 3 partner cards with gradients
- [ ] Hover over partner cards - should scale slightly
- [ ] Test dark mode on this page

### 8. Structures Page

- [ ] Visit /structures (must be logged in)
- [ ] Verify search input works
- [ ] Verify table shows structure data
- [ ] Test filtering with search
- [ ] Test dark mode

### 9. Dashboard

- [ ] Login and go to /dashboard
- [ ] Verify welcome message shows user's name
- [ ] Verify 4 statistics cards
- [ ] Verify "Actions rapides" section with 4 action cards
- [ ] Verify "Aperçu des progrès" with 5 progress bars
- [ ] Verify "Activités récentes" sidebar
- [ ] Verify "État du système" section
- [ ] Test hover effects on action cards

### 10. Responsive Design

- [ ] Resize browser to mobile size (< 768px)
- [ ] Verify mobile menu (hamburger icon) appears
- [ ] Click hamburger - menu should slide in
- [ ] Test all navigation links in mobile menu
- [ ] Test dark mode toggle in mobile view
- [ ] Verify cards stack properly on mobile

### 11. Accessibility & Performance

- [ ] Test keyboard navigation (Tab key)
- [ ] Verify all interactive elements are reachable
- [ ] Check color contrast in both light and dark modes
- [ ] Verify page loads quickly
- [ ] Check for console errors (F12 Developer Tools)

## 🐛 Common Issues & Solutions

### Issue: Dark mode doesn't work

**Solution**: Clear localStorage and refresh

```javascript
// In browser console:
localStorage.clear();
location.reload();
```

### Issue: Can't login

**Solution**: Re-initialize database

1. Visit http://localhost:3000/api/init
2. Or run: `node seed-db.js`

### Issue: Dev server won't start

**Solution**: Kill existing Node processes

```bash
# Windows
wmic process where "name='node.exe'" delete

# Then restart
npm run dev
```

### Issue: Build errors

**Solution**: Clean and rebuild

```bash
rm -rf .next .next-dev node_modules
npm install
npm run build
```

## 📊 Expected Results

### Login Success

- Redirects to /dashboard
- Header shows user's name
- Conditional menu items appear
- "Se connecter" changes to "Tableau de Bord"

### Dark Mode Success

- Background turns dark
- Text remains readable
- All cards/components adapt
- Icons and gradients still visible
- Preference persists after refresh

### Responsive Success

- Mobile menu works
- Cards stack vertically on small screens
- Text remains readable
- No horizontal scrolling
- Touch targets are large enough

## 🎯 Success Criteria

✅ All login flows work for both admin and consultant
✅ Dark/light mode toggle works on all pages
✅ Navigation shows/hides based on auth state
✅ All pages are beautiful and modern
✅ Responsive design works on all screen sizes
✅ No console errors
✅ Production build succeeds
✅ Database seeds successfully

## 📝 Notes

- The consultant user has READ and WRITE privileges only (no DELETE or ADMIN)
- Theme preference is stored in localStorage
- Database is MongoDB (ensure connection string is in .env.local)
- All pages support dark mode except auth pages (they have custom backgrounds)

---

**Last Updated**: October 17, 2025
**Version**: 1.0.0
**Status**: ✅ Ready for Testing
