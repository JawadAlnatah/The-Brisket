# The Brisket Website - Technology Stack Guide

## 🎯 Overview
**The Brisket** is a modern restaurant website built with cutting-edge web technologies. This guide will explain every technology used and how it affects the website.

---

## 🚀 Core Technologies

### 1. **Next.js** (v16.1.6)
**What it is:** A React framework for building fast, production-ready web applications.

**What it does:**
- Handles **server-side rendering** (SSR) - makes your website load faster
- Manages **routing** - creates pages automatically based on folder structure
- Optimizes **images and performance** automatically
- Provides **development server** with hot reload (changes appear instantly)

**How it affects the website:**
- Makes the website load instantly (better SEO)
- Handles navigation between pages smoothly
- The `app/` folder structure creates routes automatically
- Example: `app/page.tsx` → home page, `app/cart/page.tsx` → cart page

---

### 2. **React** (v19.2.3)
**What it is:** A JavaScript library for building user interfaces using **components**.

**What it does:**
- Breaks the website into **reusable components** (like LEGO blocks)
- Manages **state** (data that changes, like cart items)
- Updates the page **without reloading** (smooth user experience)
- Uses **JSX** syntax (HTML-like code in JavaScript)

**How it affects the website:**
- Each section is a component: `HeroBurger`, `MenuSection`, `Features`
- When you add items to cart, React updates the UI instantly
- Components can be reused across pages

---

### 3. **TypeScript** (v5)
**What it is:** JavaScript with **type safety** (catches errors before running code).

**What it does:**
- Adds **types** to variables (string, number, etc.)
- Catches **bugs** during development
- Provides **autocomplete** in code editors
- Makes code more reliable and easier to understand

**How it affects the website:**
- Files end with `.ts` (TypeScript) or `.tsx` (TypeScript + JSX)
- Example: In `menu.ts`, items have defined types (name: string, price: number)
- Prevents errors like passing wrong data types

---

## 🎨 Styling Technologies

### 4. **Tailwind CSS** (v4)
**What it is:** A **utility-first** CSS framework for styling.

**What it does:**
- Provides **pre-built classes** like `bg-black`, `text-white`, `p-4`
- Eliminates the need to write custom CSS files
- Automatically removes unused styles (smaller file size)
- Responsive design with `md:`, `lg:` prefixes

**How it affects the website:**
- All styling is done directly in components using class names
- Example: `className="bg-[#050505] text-white p-8"`
- Makes the website dark themed with gradient backgrounds
- Responsive on mobile and desktop

---

### 5. **PostCSS** (with @tailwindcss/postcss)
**What it is:** A tool that **processes CSS** with JavaScript plugins.

**What it does:**
- Transforms Tailwind CSS into regular CSS
- Adds **vendor prefixes** (browser compatibility)
- Optimizes CSS for production

**How it affects the website:**
- Works behind the scenes
- Ensures styles work on all browsers
- Makes the final CSS file smaller

---

## ✨ Animation & Interaction

### 6. **Framer Motion** (v12.31.0)
**What it is:** A powerful **animation library** for React.

**What it does:**
- Creates **smooth animations** and transitions
- Handles **scroll-based animations** (parallax effects)
- Provides physics-based animations (spring, bounce)
- Easy gesture support (drag, hover)

**How it affects the website:**
- **Hero section animation**: The brisket image sequence plays as you scroll
- **Text overlays**: "SLOW SMOKED" and "TEXAS STYLE" fade in/out while scrolling
- **Smooth transitions**: Elements fade in when page loads
- Uses `useScroll`, `useTransform`, `useSpring` hooks for scroll effects

---

### 7. **Lucide React** (v0.563.0)
**What it is:** A library of beautiful **SVG icons**.

**What it does:**
- Provides 1000+ customizable icons
- Icons are React components (easy to use)
- Lightweight and scalable

**How it affects the website:**
- Used for cart icon, phone icon, location pin
- Icons in the Features section
- Clean, professional look

---

## 🛠️ State Management

### 8. **Zustand** (v5.0.11)
**What it is:** A simple **state management** library.

**What it does:**
- Manages **global state** (data shared across components)
- Simpler than Redux (less boilerplate code)
- Works with React hooks

**How it affects the website:**
- **Cart functionality**: Stores cart items globally
- `useCartStore` hook lets any component access cart
- Functions: `addItem`, `removeItem`, `totalPrice`
- When you add items in `MenuSection`, `StickyCart` updates automatically

---

## 🧰 Utility Libraries

### 9. **clsx** (v2.1.1)
**What it is:** A tiny utility for **conditionally joining class names**.

**What it does:**
- Combines multiple class names easily
- Handles conditional classes (if/else for styling)

**Example:**
```typescript
clsx('btn', isActive && 'active', 'text-white')
// Result: "btn active text-white" (if isActive is true)
```

---

### 10. **tailwind-merge** (v3.4.0)
**What it is:** Merges Tailwind classes **intelligently**.

**What it does:**
- Prevents conflicting classes
- Example: `bg-red bg-blue` → keeps only `bg-blue`

**How it affects the website:**
- Works with `clsx` to handle dynamic styling
- Ensures no CSS conflicts

---

## 📦 Development Tools

### 11. **ESLint** (v9)
**What it is:** A **code linter** that finds and fixes problems.

**What it does:**
- Catches common coding mistakes
- Enforces code style consistency
- Integrates with Next.js

**How it affects development:**
- Keeps code clean and consistent
- Warns about potential bugs
- Run with: `npm run lint`

---

## 🌐 Languages Used

### HTML (via JSX/TSX)
- **What:** Structure of the website
- **Where:** Inside `.tsx` files as JSX (looks like HTML)
- **Example:** `<div>`, `<h1>`, `<button>`

### CSS (via Tailwind)
- **What:** Styling/appearance
- **Where:** Class names in components
- **Example:** `className="bg-black text-white"`

### JavaScript/TypeScript
- **What:** Logic and interactivity
- **Where:** All `.ts` and `.tsx` files
- **Example:** Cart functions, scroll animations

---

## 📁 File Structure Explained

```
The brisket/
├── app/                          # Next.js app router (pages)
│   ├── page.tsx                 # Home page (main entry point)
│   ├── layout.tsx               # Wrapper for all pages (fonts, metadata)
│   ├── globals.css              # Global styles (background, noise texture)
│   └── cart/
│       └── page.tsx             # Cart page
│
├── components/                   # Reusable UI components
│   ├── HeroBurger.tsx           # Hero section with scroll animation
│   ├── MenuSection.tsx          # Menu with "Add to Cart" buttons
│   ├── Features.tsx             # Contact info, location, hours
│   ├── Testimonials.tsx         # Scrolling customer reviews
│   └── StickyCart.tsx           # Floating cart button
│
├── data/
│   └── menu.ts                  # Menu items data (dishes, prices, images)
│
├── store/
│   └── cartStore.ts             # Global cart state (Zustand)
│
├── public/                       # Static files (images, icons)
│   └── brisket-sequence/        # Animation frames (192 images)
│
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── next.config.ts                # Next.js configuration
└── postcss.config.mjs            # PostCSS configuration
```

---

## 🎭 Website Structure Breakdown

### 1. **Hero Section** (`HeroBurger.tsx`)
**What it does:**
- Full-screen scrolling animation (192 frames of brisket images)
- Text overlays appear/disappear as you scroll
- Shows brand name "THE BRISKET"
- Tagline: "Premium Smoked Meat"

**Technologies used:**
- Framer Motion (scroll animations)
- HTML5 Canvas (renders image sequence)
- TypeScript (type-safe code)

---

### 2. **Testimonials Section** (`Testimonials.tsx`)
**What it does:**
- Scrolling customer reviews
- Auto-loops infinitely
- Social proof (builds trust)

**Technologies used:**
- React (component)
- Tailwind CSS (styling)
- CSS animations (scroll effect)

---

### 3. **Menu Section** (`MenuSection.tsx`)
**What it does:**
- Displays menu categories (Main Dishes, Salads, etc.)
- Shows items with images, prices, descriptions
- "Add to Cart" buttons
- Tabs for filtering categories

**Technologies used:**
- React hooks (`useState` for category selection)
- Zustand (adds items to cart)
- Framer Motion (smooth transitions)
- Lucide React (icons)

**Data flow:**
1. Reads menu items from `data/menu.ts`
2. User clicks "Add to Cart"
3. Calls `useCartStore.addItem(item)`
4. Cart updates globally

---

### 4. **Sticky Cart** (`StickyCart.tsx`)
**What it does:**
- Floating button showing cart count
- Always visible while scrolling
- Click to go to cart page

**Technologies used:**
- Zustand (`totalItems()`)
- Next.js Link (navigation)
- Framer Motion (animations)

---

### 5. **Features Section** (`Features.tsx`)
**What it does:**
- Contact information
- Opening hours
- Location with map link

**Technologies used:**
- React
- Lucide React (icons)
- Tailwind CSS

---

### 6. **Cart Page** (`app/cart/page.tsx`)
**What it does:**
- Shows cart items
- Adjust quantities (+/-)
- Remove items
- Shows total price

**Technologies used:**
- Zustand (cart state)
- React
- Next.js routing

---

## 🔄 How Everything Works Together

### Example: Adding Item to Cart

1. **User clicks "Add to Cart" button** in `MenuSection.tsx`
2. **React event handler** fires: `onClick={() => addItem(item)}`
3. **Zustand store** (`cartStore.ts`) updates global state
4. **`StickyCart.tsx` re-renders** automatically (shows new count)
5. **No page reload needed** - React updates UI instantly

### Example: Scroll Animation

1. **User scrolls page** on hero section
2. **Framer Motion** tracks scroll position (`useScroll`)
3. **`useTransform`** converts scroll to frame number (0-191)
4. **Canvas renders** corresponding image from sequence
5. **Smooth animation** appears (like a video playing with scroll)

---

## ✅ Summary

| Technology | Purpose | Skill Level |
|------------|---------|-------------|
| Next.js | Framework (routing, SSR) | Intermediate |
| React | UI Components | Intermediate |
| TypeScript | Type Safety | Beginner-Intermediate |
| Tailwind CSS | Styling | Beginner |
| Framer Motion | Animations | Intermediate |
| Zustand | State Management | Beginner |
| HTML/CSS | Structure/Style | You know this! |

**Total concepts to learn:** 7 main technologies
**Estimated time:** 40-60 hours (with practice)
**Recommended order:** HTML/CSS → JavaScript → TypeScript → React → Next.js → Tailwind → Framer Motion → Zustand
