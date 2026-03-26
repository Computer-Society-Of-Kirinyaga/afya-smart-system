# 🚀 AFYA Smart System - Quick Start Guide

## ⚡ 60-Second Startup

### 1. Install Dependencies
```bash
cd frontend
pnpm install  # or npm install
```

### 2. Start Development Server
```bash
pnpm dev
```

### 3. Open in Browser
```
http://localhost:5173
```

## 🔑 Demo Login Credentials

**Option 1 (Recommended):**
- **Email**: `jane@vitalis.io`
- **Password**: `password123`

**Option 2:**
- **Email**: `john@vitalis.io`
- **Password**: `password456`

## 📍 Application Flow

```
1. Home Page (/)
   ↓ (Click "Get Started" or go to Login)
2. Login Page (/login)
   ↓ (Enter credentials above)
3. Dashboard Overview (/dashboard/overview)
   ↓ (Use sidebar to navigate)
4. Vitals Page, Alerts Page, Settings Page
   ↓ (Explore all features)
5. Logout (back to login)
```

## 🎯 Key Features to Explore

### Overview Page
- See current vital readings
- View patient's risk score
- Browse recent alerts
- Check all vital status at a glance

### Vitals Page
- Switch between 4 vital types (tabs)
- View 24-hour trend chart
- Check average/min/max values
- See hourly history table

### Alerts Page
- Filter alerts by severity (Critical/Warning/Info)
- Mark alerts as read
- Delete alerts
- View alert statistics

### Settings Page
- Update contact information
- Configure SMS notifications
- Enable/disable toast alerts
- View system information

## 📊 Understanding the Data

### Real-Time Mock Data
All data is **generated dynamically** with realistic ranges:

| Vital | Range | Unit |
|-------|-------|------|
| Heart Rate | 58-105 | bpm |
| Systolic BP | 105-145 | mmHg |
| Diastolic BP | 60-95 | mmHg |
| SpO2 | 95-100 | % |
| Temperature | 36.1-37.5 | °C |
| Glucose | 90-130 | mg/dL |

### Alert Severity Colors
- 🔴 **Critical** (Red) - Life-threatening
- 🟡 **Warning** (Yellow) - Elevated reading
- 🔵 **Info** (Blue) - General information

## 💾 Data Persistence

### What Gets Saved?
- ✅ Login session (localStorage)
- ✅ Contact information (localStorage)
- ✅ SMS settings (localStorage)
- ✅ Toast notification preference (localStorage)

### What's Real-Time?
- 🔄 Current vitals (refreshes every 5 min)
- 🔄 Alerts (refreshes every 30 sec)
- 🔄 Analytics (refreshes every 30 min)

**Note**: All data is mock-generated. Refresh page to see new values.

## 🎨 Interface Customization

### Change Email/Password
Edit `src/store/auth.ts`:
```typescript
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'your-email@vitalis.io': {
    password: 'your-password',
    user: {
      id: '1',
      name: 'Your Name',
      email: 'your-email@vitalis.io',
    },
  },
}
```

### Change Default Contact Info
Edit `src/store/settings.ts`:
```typescript
contacts: {
  primaryPhone: '+254712345678',  // Change this
  email: 'jane@vitalis.io',        // Change this
  emergencyContact: 'John Doe',    // Change this
}
```

### Change Color Theme
All colors use TailwindCSS classes. Primary color is `teal-600`. Search for "teal-600" in component files to update theme.

## 🐛 Troubleshooting

### Port Already in Use
```bash
# If port 5173 is busy, Vite will use next available port
# Check terminal output for actual URL
```

### Login Not Working
1. Clear browser localStorage: Dev Tools → Application → Clear Storage
2. Refresh page
3. Try login again with correct credentials

### Data Not Updating
1. Alerts auto-refresh every 30 seconds
2. Vitals refresh every 5 minutes
3. Manual refresh: F5 or Cmd+R

### Styling Issues
```bash
# Rebuild TailwindCSS
pnpm run build
```

## 📁 Important Files

### Configuration
- `vite.config.ts` - Build configuration
- `tsconfig.json` - TypeScript settings
- `tailwind.config.js` - Tailwind setup
- `prettier.config.js` - Code formatting

### Source Code
- `src/routes/` - All page routes
- `src/content/` - Page components
- `src/store/` - Zustand stores
- `src/components/` - Reusable components
- `src/lib/mockData.ts` - Data generators
- `src/hooks/useVitals.ts` - Query hooks

## 🔗 Route Map

```
/                  → Home page (redirects to login if not authenticated)
/login             → Login page
/dashboard         → Dashboard layout (protected)
├── /overview      → Patient overview & summary
├── /vitals        → Vital detail & history
├── /alerts        → Alert management
└── /settings      → User preferences
```

## 📚 Component Hierarchy

```
Root
├── RootComponent (/__root.tsx)
├── LoginPage (/login)
└── DashboardShell (/dashboard)
    ├── Sidebar (Navigation)
    ├── Topbar (User Info & Alerts)
    └── Outlet
        ├── OverviewPage
        ├── VitalsPage
        ├── AlertsPage
        └── SettingsPage
```

## ⚙️ Development Tips

### Hot Reload
- Changes to TypeScript/JSX files auto-reload
- Changes to TailwindCSS classes auto-apply
- No page refresh needed!

### Debug Tips
- Open DevTools: F12
- Check Console tab for errors
- Inspect Elements to verify classes
- Use React DevTools extension for component inspection

### Build for Production
```bash
pnpm build
# Creates optimized build in dist/
```

## 🔐 Security Notes

**Development Only:**
- Credentials stored in code (for demo)
- No authentication token validation
- No API security

**For Production:**
- Use secure authentication (OAuth, JWT)
- Hash passwords server-side
- Use HTTPS only
- Validate all inputs
- Implement rate limiting

## 📞 Support Resources

- **Specification Files**: `/files` folder (15 markdown docs)
- **Implementation Docs**: `DASHBOARD_IMPLEMENTATION.md`
- **Project Summary**: `FINAL_SUMMARY.md`
- **Component Code**: Check JSDoc comments in components

## ✅ Verification Checklist

- [ ] Dependencies installed (`pnpm install`)
- [ ] Dev server running (`pnpm dev`)
- [ ] Browser opens to http://localhost:5173
- [ ] Can login with provided credentials
- [ ] Dashboard sidebar shows 4 menu items
- [ ] Can navigate between pages
- [ ] Data refreshes automatically
- [ ] Settings persist after refresh
- [ ] Can logout successfully

## 🎉 You're Ready!

Everything is configured and ready to use. Start exploring the dashboard and try all the features!

**Happy Coding! 🚀**

---

*For detailed technical information, see DASHBOARD_IMPLEMENTATION.md*
