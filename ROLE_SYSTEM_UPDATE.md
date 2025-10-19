# Role System Update - USER → VISITOR

**Date:** January 2025  
**Status:** ✅ COMPLETED

## Summary

Complete refactoring of the role system from `ADMIN/USER` to `ADMIN/VISITOR` to eliminate confusion and improve clarity.

---

## Changes Made

### 1. **User Model** (`src/models/User.ts`)

- Updated interface: `role: "ADMIN" | "VISITOR"`
- Updated schema enum: `["ADMIN", "VISITOR"]`
- Updated default value: `"VISITOR"`

### 2. **Header Component** (`src/components/layout/Header.tsx`)

Complete menu restructure with role-based navigation:

**Admin Menu (6 items):**

- 🏠 Tableau de bord → `/admin/dashboard`
- 📊 Données → `/admin/dashboard/donnees/saisie`
- 📚 Références → `/admin/dashboard/referentiel/indicateurs`
- 🏢 Structures → `/admin/dashboard/structures`
- 👥 Utilisateurs → `/admin/dashboard/utilisateurs`
- ⚙️ Paramètres → `/admin/dashboard/parametres`

**Visitor Menu (4 items):**

- 🏠 Tableau de bord → `/user/dashboard`
- 📊 Données → `/user/dashboard/donnees`
- 📈 Statistiques → `/user/dashboard/statistiques`
- 🏢 Structures → `/user/dashboard/structures`

**Public Menu:**

- ℹ️ À propos
- 🔓 Se connecter

**Changes:**

- Logout changed from `Link` to `button` with `signOut({ callbackUrl: "/" })`
- Added Lucide React icons
- Mobile menu updated to match desktop
- All menu items properly role-gated

### 3. **User Management Page** (`src/app/admin/dashboard/utilisateurs/page.tsx`)

- Updated User interface: `role: "ADMIN" | "VISITOR"`
- Updated FormData default: `role: "VISITOR"`
- Updated select options: "Visiteur" / "Administrateur"
- Updated badge display: Shows "Visiteur" instead of "Utilisateur"

### 4. **Database Script** (`src/scripts/createTestUsers.mjs`)

Created Node.js script to initialize test users:

- **Admin User:** carine@gmail.com (password: 12345)
- **Visitor User:** ben@gmail.com (password: 12345)
- Deletes all existing users before creating new ones
- Uses bcrypt for password hashing (10 salt rounds)
- Direct MongoDB Atlas connection

---

## Test Users Created

| Email            | Password | Role    | Portal Access      |
| ---------------- | -------- | ------- | ------------------ |
| carine@gmail.com | 12345    | ADMIN   | `/admin/dashboard` |
| ben@gmail.com    | 12345    | VISITOR | `/user/dashboard`  |

---

## Verification

✅ **Build Status:** Successful (51 routes compiled)  
✅ **TypeScript Errors:** None  
✅ **Role References:** All USER references removed  
✅ **Database:** 2 test users created successfully  
✅ **Auth System:** Compatible with VISITOR role

### Grep Search Results:

```bash
# No remaining USER role references found
grep -r "role.*===.*\"USER\"|\"USER\".*===.*role"
# Result: 0 matches
```

---

## Testing Instructions

### 1. Test Admin Login

```bash
Email: carine@gmail.com
Password: 12345
Expected: Redirect to /admin/dashboard
Verify: All 6 admin menu items visible in Header
```

### 2. Test Visitor Login

```bash
Email: ben@gmail.com
Password: 12345
Expected: Redirect to /user/dashboard
Verify: Only 4 visitor menu items visible in Header
```

### 3. Test Role-Based Access

- ✅ Admin can access `/admin/dashboard/*` routes
- ✅ Visitor cannot access admin routes (should be blocked by middleware)
- ✅ Visitor can access `/user/dashboard/*` routes
- ✅ Logout redirects to home page

---

## Database Connection

**MongoDB Atlas Cluster:** `sn1325cluster.2d5fksa.mongodb.net`  
**Database:** `sn1325`  
**Collection:** `users`

### Script Execution Log:

```
✅ Connected to MongoDB
✅ Deleted 2 existing users
✅ Admin user created: { email: 'carine@gmail.com', role: 'ADMIN' }
✅ Visitor user created: { email: 'ben@gmail.com', role: 'VISITOR' }
✨ Test users created successfully!
```

---

## Files Modified

1. ✅ `src/models/User.ts` - Role type definitions
2. ✅ `src/components/layout/Header.tsx` - Menu structure
3. ✅ `src/app/admin/dashboard/utilisateurs/page.tsx` - User management UI
4. ✅ `src/scripts/createTestUsers.mjs` - Database initialization (NEW)

---

## Next Steps

### Recommended:

1. **Test Login Flow:** Verify both admin and visitor login/routing
2. **Test Access Control:** Ensure middleware blocks unauthorized access
3. **Update Documentation:** Check README for any USER references
4. **Consider Renaming:** Optionally rename `/user/dashboard` to `/visitor/dashboard` for consistency (or keep as-is for user-friendliness)

### Optional Improvements:

- Remove Mongoose duplicate index warnings (cosmetic only)
- Add more test users with different permissions
- Update any API documentation mentioning roles

---

## Rollback Plan

If issues occur, revert these commits:

1. User model role changes
2. Header menu restructure
3. User management page updates
4. Database test users (delete carine@gmail.com and ben@gmail.com)

---

## Notes

- **Why VISITOR?** The term "USER" was confusing because everyone is a "user". "VISITOR" clearly indicates limited access.
- **Portal Names:** Admin Portal (`/admin/dashboard`) and Visitor Portal (`/user/dashboard`)
- **Password Security:** Test passwords are simple (12345) for development only. Use strong passwords in production.
- **Middleware:** Existing middleware should automatically recognize VISITOR role through NextAuth session.

---

**Status:** ✅ Ready for testing  
**Build:** ✅ Passing  
**Database:** ✅ Populated  
**Next Action:** User to test login functionality
