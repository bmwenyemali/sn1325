# SN1325 Application - Navigation Structure

## Complete Navigation Architecture

**Generated:** January 2025  
**Last Updated:** After horizontal menu implementation and user management fixes

---

## 1. PUBLIC ROUTES (Unauthenticated Access)

### 🏠 Home Page `/`

- **Purpose:** Landing page with hero section, features, and CTA
- **Components:**
  - Logo SN1325 (250x250px)
  - Hero section with background pattern
  - Feature cards (Statistics, User Management, Security, Validation)
  - Call-to-Action button to dashboard
- **Access:** Public
- **Theme:** Dark mode enabled with gradient background

### 📄 About Page `/about`

- **Purpose:** Information about SN1325 and UNSCR 1325
- **Content:** Details about the National Secretariat and UN Resolution
- **Access:** Public

### 🏢 Structures Page `/structures` (Public View)

- **Purpose:** Public listing of structures
- **Access:** Public (read-only)

### 🔐 Authentication Page `/auth/signin`

- **Purpose:** User login with NextAuth v5
- **Features:**
  - Email/password authentication
  - Session-based auth with bcryptjs
  - Role-based redirect after login (ADMIN/USER/VIEWER)
- **Access:** Public (unauthenticated only)

---

## 2. DASHBOARD ROUTES (Authenticated Access)

### 🎯 Main Dashboard `/dashboard`

- **Purpose:** Central dashboard with statistics and overview
- **Features:**
  - Statistics cards (Total Indicateurs, Données Validées, En Attente, Utilisateurs Actifs)
  - Recent activities
  - Quick actions
  - Role-based content visibility
- **Access:** All authenticated users
- **Layout:** AdminLayout with sidebar + horizontal top menu

---

## 3. HORIZONTAL TOP MENU (5 Main Sections)

The application has a **dual navigation system**: Sidebar (left) + Horizontal Top Menu (desktop only)

### Horizontal Menu Structure (Desktop):

```
┌─────────────────────────────────────────────────────────────────┐
│  [Données] [Références] [Structures] [Utilisateurs] [Paramètres] │
└─────────────────────────────────────────────────────────────────┘
```

**Active State:** Highlighted with blue background and white text  
**Responsive:** Hidden on mobile (< 1024px), shows compact header instead

---

## 4. SECTION 1: DONNÉES (Data Management)

### Parent Route: `/dashboard/donnees`

#### 📊 Données Numériques `/dashboard/donnees/data-numeric`

- **Purpose:** Numeric data entry and management
- **Features:**
  - Full CRUD operations
  - Populated fields: indicateur, province, cible
  - Table with search/filter
  - Modal for create/edit
- **API:** `/api/data-numeric` (GET, POST)
- **API:** `/api/data-numeric/[id]` (GET, PUT, DELETE)
- **Access:** ADMIN (write), USER (read)
- **Status:** ✅ IMPLEMENTED

#### 📋 Données Liste `/dashboard/donnees/data-liste`

- **Purpose:** Qualitative data (list-based)
- **Features:**
  - Full CRUD operations
  - Populated field: loisMesuresActions
  - Table with search
  - Modal for create/edit
- **API:** `/api/data-liste` (GET, POST)
- **API:** `/api/data-liste/[id]` (GET, PUT, DELETE)
- **Access:** ADMIN (write), USER (read)
- **Status:** ✅ IMPLEMENTED

#### 🗺️ Données Province `/dashboard/donnees/data-province`

- **Purpose:** Province-level aggregate data
- **Features:**
  - Full CRUD operations
  - Uses SimpleData model
  - Province-specific information
- **API:** `/api/data-province` (GET, POST)
- **API:** `/api/data-province/[id]` (GET, PUT, DELETE)
- **Access:** ADMIN (write), USER (read)
- **Status:** ✅ IMPLEMENTED

---

## 5. SECTION 2: RÉFÉRENCES (Reference Data)

### Parent Route: `/dashboard/referentiel`

#### 🎯 Axes Stratégiques `/dashboard/referentiel/axes`

- **Purpose:** Strategic axes management
- **Features:**
  - Full CRUD with table
  - Fields: nom, numero, ordre, dateCreation, details
  - Nested indicateurs count
  - Bug fix: null check for dateCreation.toLocaleDateString()
- **API:** `/api/axes` (GET, POST)
- **API:** `/api/axes/[id]` (GET, PUT, DELETE)
- **Access:** ADMIN only
- **Status:** ✅ IMPLEMENTED + BUG FIXED

#### 📏 Indicateurs `/dashboard/referentiel/indicateurs`

- **Purpose:** Indicators management linked to axes
- **Features:**
  - Full CRUD with table
  - Fields: nom, numero, ordre, type, frequence, details
  - Populated field: axe (reference to Axe Stratégique)
  - Nested categories count
- **API:** `/api/indicateurs` (GET, POST)
- **API:** `/api/indicateurs/[id]` (GET, PUT, DELETE)
- **Access:** ADMIN only
- **Status:** ✅ IMPLEMENTED

#### 🏷️ Catégories `/dashboard/referentiel/categories`

- **Purpose:** Categories management
- **Features:**
  - Full CRUD with table
  - Populated fields: indicateur, grandeCategorie
  - Hierarchical structure
- **API:** `/api/categories` (GET, POST)
- **API:** `/api/categories/[id]` (GET, PUT, DELETE)
- **Access:** ADMIN only
- **Status:** ✅ IMPLEMENTED

#### 🎯 Cibles `/dashboard/referentiel/cibles`

- **Purpose:** Targets/Cibles management
- **Features:**
  - Full CRUD with modal form
  - Fields: nom, acronyme, type, description
  - Populated fields: categorie, grandeCategorie
  - Table with search functionality
- **API:** `/api/cibles` (GET, POST)
- **API:** `/api/cibles/[id]` (GET, PUT, DELETE)
- **Access:** ADMIN only
- **Status:** ✅ IMPLEMENTED

#### 🗺️ Provinces `/dashboard/referentiel/provinces`

- **Purpose:** Provinces reference data
- **Features:**
  - List of DRC provinces
  - Read-only or ADMIN edit
- **API:** `/api/provinces` (GET)
- **Access:** All authenticated users (read), ADMIN (edit)
- **Status:** ✅ IMPLEMENTED (API only)
- **Note:** Page may need creation

#### ⚧️ Sexe (Gender) `/dashboard/referentiel/sexe`

- **Purpose:** Static gender referential
- **Features:**
  - Read-only card display
  - Three categories: Homme, Femme, Total
  - Static data (no create/edit)
- **API:** `/api/sexe` (GET)
- **API:** `/api/sexe/[id]` (GET)
- **Access:** All authenticated users (read-only)
- **Status:** ✅ IMPLEMENTED

#### 📦 Grandes Catégories `/dashboard/referentiel/grandes-categories`

- **Purpose:** Major categories management
- **Access:** ADMIN only
- **Status:** ⚠️ ROUTE EXISTS (in navigation) - Implementation unknown

---

## 6. SECTION 3: STRUCTURES

### 🏢 Structures Management `/dashboard/structures`

- **Purpose:** Organization structures management
- **Features:**
  - Full CRUD with enhanced card grid
  - Fields: nom, acronyme, type, secteur, adresse, telephone, email, siteWeb, description, province, statut
  - Filter by province and type
  - Modal form for create/edit
  - Populated field: province
- **API:** `/api/structures` (GET, POST)
- **API:** `/api/structures/[id]` (GET, PUT, DELETE)
- **Access:** ADMIN (write), USER (read)
- **Status:** ✅ IMPLEMENTED (enhanced version)

---

## 7. SECTION 4: UTILISATEURS (User Management)

### 👥 Users Management `/dashboard/utilisateurs`

- **Purpose:** User account management
- **Features:**
  - Full CRUD with modal form
  - Fields:
    - nom (Last Name)
    - prenom (First Name)
    - email (unique)
    - password (bcryptjs hashed)
    - role (dropdown: USER/ADMIN/VIEWER) - **NOT hardcoded**
    - statut (Actif/Inactif)
    - fonction (Job title)
    - organisation (Organization)
    - province (dropdown from provinces API)
  - Table display with all user info
  - Real-time fetching from database
  - handleSubmit for create/update
  - handleEdit to populate modal
  - handleDelete with confirmation
- **API:** `/api/users` (GET, POST)
- **API:** `/api/users/[id]` (GET, PUT, DELETE)
- **Access:** ADMIN only
- **Status:** ✅ FULLY IMPLEMENTED (complete rewrite with modal)

---

## 8. SECTION 5: PARAMÈTRES (Settings)

### Parent Route: `/dashboard/parametres`

#### ⚙️ Settings Main `/dashboard/parametres`

- **Purpose:** Main settings page with cards
- **Sections:**
  1. System Information
  2. User Profile
  3. About SN1325
  4. Contact Information
- **Access:** All authenticated users
- **Status:** ✅ IMPLEMENTED

#### 🔧 Configuration `/dashboard/parametres/configuration`

- **Purpose:** System configuration (if needed)
- **Access:** ADMIN only
- **Status:** ⚠️ ROUTE EXISTS (in navigation) - Page needs creation

#### ℹ️ About `/dashboard/parametres/about`

- **Purpose:** About the application
- **Access:** All authenticated users
- **Status:** ⚠️ ROUTE EXISTS (in navigation) - Page needs creation

#### 📧 Contact `/dashboard/parametres/contact`

- **Purpose:** Contact information and support
- **Access:** All authenticated users
- **Status:** ⚠️ ROUTE EXISTS (in navigation) - Page needs creation

---

## 9. ADMIN-SPECIFIC ROUTES

### 📥 Data Import `/dashboard/admin/import`

- **Purpose:** Import old data from previous system
- **Features:**
  - File upload interface
  - Data validation
  - Bulk import operations
- **API:** `/api/import-old-data` (POST)
- **Access:** ADMIN only
- **Status:** ✅ API IMPLEMENTED - Page status unknown

---

## 10. ADDITIONAL ROUTES (Found in Build)

### 🎨 Test Colors `/test-colors`

- **Purpose:** Theme testing page
- **Access:** Development only
- **Status:** ✅ EXISTS

### 📊 Rapports (Reports) - NOT IN HORIZONTAL MENU

These routes exist but are NOT in the horizontal top menu (only in sidebar):

#### 📈 Statistics `/dashboard/rapports/statistiques`

- **Purpose:** Statistical reports and analytics
- **Access:** USER+ (read), ADMIN (full access)
- **Status:** ⚠️ Route exists - implementation unknown

#### 📊 Analyses `/dashboard/rapports/analyses`

- **Purpose:** Data analysis and insights
- **Access:** USER+ (read), ADMIN (full access)
- **Status:** ⚠️ Route exists - implementation unknown

---

## 11. API STRUCTURE

### Authentication API

- **`/api/auth/[...nextauth]`**: NextAuth v5 authentication handlers

### User Management APIs

- **`/api/users`**: GET (list), POST (create)
- **`/api/users/[id]`**: GET (single), PUT (update), DELETE (delete)

### Reference Data APIs

- **`/api/axes`**: Strategic axes CRUD
- **`/api/axes/[id]`**: Single axe operations
- **`/api/indicateurs`**: Indicators CRUD
- **`/api/indicateurs/[id]`**: Single indicator operations
- **`/api/categories`**: Categories CRUD
- **`/api/categories/[id]`**: Single category operations
- **`/api/cibles`**: Targets CRUD (NEW)
- **`/api/cibles/[id]`**: Single target operations (NEW)
- **`/api/sexe`**: Gender referential (read-only) (NEW)
- **`/api/sexe/[id]`**: Single gender category (NEW)
- **`/api/provinces`**: Provinces list

### Data Management APIs

- **`/api/data-numeric`**: Numeric data CRUD (NEW)
- **`/api/data-numeric/[id]`**: Single numeric data operations (NEW)
- **`/api/data-liste`**: Qualitative data CRUD (NEW)
- **`/api/data-liste/[id]`**: Single qualitative data operations (NEW)
- **`/api/data-province`**: Province data CRUD (NEW)
- **`/api/data-province/[id]`**: Single province data operations (NEW)

### Structure APIs

- **`/api/structures`**: Structures CRUD
- **`/api/structures/[id]`**: Single structure operations

### Admin APIs

- **`/api/init`**: Database initialization
- **`/api/import-old-data`**: Old data import

**All APIs follow Next.js 15 pattern:**

```typescript
{
  params: Promise<{ id: string }>;
}
const { id } = await params;
```

---

## 12. ACCESS CONTROL MATRIX

| Route                      | ADMIN   | USER   | VIEWER | Public |
| -------------------------- | ------- | ------ | ------ | ------ |
| `/`                        | ✅      | ✅     | ✅     | ✅     |
| `/about`                   | ✅      | ✅     | ✅     | ✅     |
| `/structures` (public)     | ✅      | ✅     | ✅     | ✅     |
| `/auth/signin`             | ✅      | ✅     | ✅     | ✅     |
| `/dashboard`               | ✅      | ✅     | ✅     | ❌     |
| `/dashboard/donnees/*`     | ✅ (RW) | ✅ (R) | ✅ (R) | ❌     |
| `/dashboard/referentiel/*` | ✅      | ❌     | ❌     | ❌     |
| `/dashboard/structures`    | ✅ (RW) | ✅ (R) | ✅ (R) | ❌     |
| `/dashboard/utilisateurs`  | ✅      | ❌     | ❌     | ❌     |
| `/dashboard/parametres`    | ✅      | ✅     | ✅     | ❌     |
| `/dashboard/admin/*`       | ✅      | ❌     | ❌     | ❌     |

**Legend:**

- ✅ = Full Access
- ✅ (RW) = Read & Write
- ✅ (R) = Read Only
- ❌ = No Access

---

## 13. NAVIGATION PATTERNS

### Desktop Navigation (≥ 1024px)

1. **Horizontal Top Menu**: 5 main sections (Données, Références, Structures, Utilisateurs, Paramètres)

   - Located at top of AdminLayout
   - Active state: Blue background with white text
   - Direct links to section landing pages

2. **Sidebar Navigation**: Detailed submenu items
   - Fixed left sidebar (280px width)
   - Expandable sections with chevron indicators
   - Icon + label for each item
   - Active state highlighting

### Mobile Navigation (< 1024px)

- Hamburger menu with overlay
- Compact header without horizontal menu
- Full sidebar slides in from left
- Touch-optimized spacing

### User Menu

- Located in top-right corner
- Shows user name and role
- Dropdown with:
  - Profile settings
  - Logout option

---

## 14. THEME SYSTEM

### Current Configuration

- **Default Mode**: Dark mode (changed from light)
- **Toggle**: Available in header for all users
- **Persistence**: localStorage (`theme` key)
- **Light Mode**: Dark text for visibility (fixed)
- **Dark Mode Fixes**: Select dropdowns now visible with proper styling

### Color Palette

- **Primary**: Bleu RDC (`#0047AB`)
- **Secondary**: Jaune RDC (`#FFD700`)
- **Accent**: Rouge RDC (`#CE1126`)
- **Dark Backgrounds**: Slate shades (900, 800, 700)
- **Light Backgrounds**: White/Gray shades

---

## 15. BUILD STATUS

**Last Build:** Successful  
**Total Routes Compiled:** 29  
**Errors:** 0  
**Git Commits:**

- `f004c8f`: Initial API creation and menu reorganization
- `73c3ea4`: Horizontal menu + user management modal

### Route Sizes (Selected)

- `/dashboard`: 5.23 kB
- `/dashboard/utilisateurs`: 4.48 kB (increased after modal addition)
- `/dashboard/structures`: 4.15 kB
- `/dashboard/referentiel/axes`: 3.89 kB
- `/dashboard/referentiel/cibles`: 3.76 kB

---

## 16. MISSING IMPLEMENTATIONS / TODO

### Pages That Need Creation

1. ⚠️ `/dashboard/parametres/configuration` - Page exists in navigation but not implemented
2. ⚠️ `/dashboard/parametres/about` - Page exists in navigation but not implemented
3. ⚠️ `/dashboard/parametres/contact` - Page exists in navigation but not implemented
4. ⚠️ `/dashboard/referentiel/grandes-categories` - In sidebar navigation but implementation unknown
5. ⚠️ `/dashboard/referentiel/provinces` - API exists but page may need creation
6. ⚠️ `/dashboard/rapports/statistiques` - Route exists but implementation status unknown
7. ⚠️ `/dashboard/rapports/analyses` - Route exists but implementation status unknown

### Features to Consider

- User profile page
- Advanced search across all data types
- Export functionality (CSV, Excel, PDF)
- Data visualization dashboards
- Audit log for admin actions
- Email notifications
- Batch operations for data import/export

---

## 17. USER JOURNEY EXAMPLES

### 🔵 ADMIN User Journey

1. Login at `/auth/signin` → Redirected to `/dashboard`
2. Click "Références" (horizontal menu) → `/dashboard/referentiel`
3. Click "Axes Stratégiques" (sidebar) → `/dashboard/referentiel/axes`
4. Click "+ Nouvel Axe" → Modal opens
5. Fill form, save → API POST to `/api/axes`
6. Navigate to "Utilisateurs" (horizontal menu) → `/dashboard/utilisateurs`
7. Click "+ Nouvel Utilisateur" → Modal opens with role dropdown
8. Create user with role selection → API POST to `/api/users`

### 🟢 USER User Journey

1. Login at `/auth/signin` → Redirected to `/dashboard`
2. Click "Données" (horizontal menu) → `/dashboard/donnees`
3. Click "Données Numériques" (sidebar) → `/dashboard/donnees/data-numeric`
4. View table (read-only, cannot add/edit/delete)
5. Click "Structures" → View structures in card grid (read-only)
6. Click "Paramètres" → View settings and profile info

### 🟡 VIEWER User Journey

1. Login at `/auth/signin` → Redirected to `/dashboard`
2. Limited to viewing data and structures
3. Cannot access Références or Utilisateurs sections
4. Read-only access to Données and Structures

---

## 18. TECHNICAL NOTES

### Database Models

- **User**: Authentication and user management
- **Structure**: Organizations and entities
- **Axe**: Strategic axes
- **Indicateur**: Indicators linked to axes
- **Province**: DRC provinces
- **Cible**: Targets for indicators
- **DataNumeric**: Numeric data entries
- **DataQualitative**: Qualitative data entries
- **SimpleData**: Province-level aggregate data
- **Category**: Categories hierarchy
- **GrandeCategorie**: Major categories

### Authentication Flow

1. User submits credentials at `/auth/signin`
2. NextAuth validates via `/api/auth/[...nextauth]`
3. Password compared with bcryptjs hash
4. Session created with user data + role
5. Role-based redirect to appropriate dashboard
6. Protected routes check session + role via middleware

### API Pattern (Next.js 15)

```typescript
// GET /api/resource/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // ... fetch and return data
}
```

---

## 19. DEPLOYMENT CHECKLIST

### ✅ Completed

- [x] Dark mode as default with light mode text fixes
- [x] User management with modal and role dropdown (not hardcoded)
- [x] Horizontal top menu with 5 sections
- [x] All CRUD APIs for core features (12 new endpoints)
- [x] Management pages for cibles, sexe, structures, parametres
- [x] Fixed axes date bug with null check
- [x] Database integration with real data
- [x] Build tested: 29 routes, 0 errors
- [x] Git deployed: 2 commits pushed to master

### ⏳ Pending

- [ ] Create missing parameter sub-pages (configuration, about, contact)
- [ ] Implement or verify rapports pages (statistiques, analyses)
- [ ] Add grandes-categories page if needed
- [ ] Create province management page
- [ ] Add user profile editing
- [ ] Implement export functionality
- [ ] Add data visualization dashboards

---

## 20. CONTACT & SUPPORT

**Application Owner:** SN1325 Secrétariat National  
**Technical Stack:** Next.js 15.5.6, MongoDB, NextAuth v5, TypeScript  
**Repository:** Git repository with master branch  
**Last Updated:** January 2025

---

**END OF NAVIGATION STRUCTURE DOCUMENT**
