# The Brisket Website Structure Overview

## 📄 Page Structure

The website is a **single-page application** with one additional cart page:

### Main Page (`app/page.tsx`)
The home page contains all main sections in this order:

1. **Hero Section** (Scrollytelling Animation)
2. **Testimonials** (Customer Reviews)
3. **Menu** (Product Catalog)
4. **Sticky Cart** (Floating Cart Button)
5. **Features** (Contact Info / About Us)
6. **Footer** (Copyright)

### Cart Page (`app/cart/page.tsx`)
Dedicated page showing:
- Cart items with images
- Quantity controls
- Remove buttons
- Total price
- "Continue Shopping" link

---

## 🧩 Components Breakdown

### 1. HeroBurger Component
**File:** `components/HeroBurger.tsx`

**What it shows:**
- Full-screen scrolling animation (192 WebP image frames)
- Brand name "THE BRISKET" 
- Subtext: "Premium Smoked Meat"
- Text overlays that appear while scrolling:
  - "SLOW SMOKED - 18 Hours Low & Slow"
  - "TEXAS STYLE - Authentic Oak Wood"

**Height:** 150vh on mobile, 250vh on desktop (creates scroll area)

**Technologies:**
- Framer Motion (scroll tracking)
- HTML5 Canvas (image rendering)
- useScroll, useTransform, useSpring hooks
- Responsive scroll ranges

---

### 2. Testimonials Component
**File:** `components/Testimonials.tsx`

**What it shows:**
- Scrolling customer reviews
- Infinite loop animation
- 5-star ratings

**Sample quotes:**
- "Best smoked brisket I've ever tasted!"
- "The lamb ribs are absolutely incredible"
- "Authentic Texas BBQ flavor"

**Style:**
- Dark background with white text
- Orange star icons
- Auto-scrolling horizontally

---

### 3. MenuSection Component
**File:** `components/MenuSection.tsx`

**What it shows:**
- **Category tabs** (5 categories):
  1. Main Dishes (5 items)
  2. Salads (2 items)
  3. Appetizers (3 items)
  4. Sauces (8 items)
  5. Soft Drinks (5 items)

- **For each item:**
  - Product image
  - Name
  - Description
  - Price
  - "Add to Cart" button

**Data source:** `data/menu.ts` (24 total menu items)

**Functionality:**
- Click tab to filter by category
- Click "Add to Cart" → adds item to Zustand store
- Grid layout (responsive: 1-3 columns)

---

### 4. StickyCart Component
**File:** `components/StickyCart.tsx`

**What it shows:**
- Floating button at bottom of screen
- Shopping cart icon (from Lucide React)
- Item count badge (e.g., "3")
- Text: "View Cart"

**Functionality:**
- Always visible while scrolling (position: fixed)
- Shows total number of items in cart
- Clicking → navigates to `/cart` page
- Smooth scale animation on hover

**Connects to:** Zustand cart store

---

### 5. Features Component
**File:** `components/Features.tsx`

**What it shows:**
3 feature cards with icons:

1. **Hours**
   - Icon: Clock
   - Text: "Open Daily 11AM - 11PM"

2. **Phone**
   - Icon: Phone
   - Text: "054 146 0722"
   - Clickable link (tel:)

3. **Location**
   - Icon: Map Pin
   - Text: "Tarout"
   - Link to Google Maps

**Style:**
- Dark cards with orange icons
- 3-column grid on desktop
- Stacked on mobile

---

## 📊 Data Structure

### Menu Items (`data/menu.ts`)

Each item has:
```typescript
{
  id: string;          // e.g., "m1"
  name: string;        // e.g., "Smoked Brisket"
  price: number;       // e.g., 28.00
  category: string;    // e.g., "Main Dishes"
  image: string;       // e.g., "/images/menu/smoked-brisket.png"
  description: string; // e.g., "Our famous 18-hour..."
}
```

### Cart Store (`store/cartStore.ts`)

**State:**
- `items: CartItem[]` (array of items in cart)

**Cart Item includes:**
- All menu item properties
- Plus: `quantity: number`

**Functions:**
- `addItem(item)` - Adds item or increases quantity
- `removeItem(id)` - Removes item completely
- `decreaseItem(id)` - Decreases quantity by 1 (removes if qty = 1)
- `totalItems()` - Returns total count
- `totalPrice()` - Returns sum of (price × quantity)
- `clearCart()` - Empties cart

---

## 🎨 Visual Design Elements

### Color Scheme
- **Primary background:** `#050505` (almost black)
- **Accent color:** Orange (`#f97316`, `orange-500`)
- **Text:** White
- **Borders:** White with 5% opacity (`white/5`)

### Backgrounds
- Radial gradient (dark gray at top → black)
- Noise texture overlay (SVG fractal noise, 5% opacity)
- Creates premium, textured look

### Typography
- **Fonts:** Geist Sans (body), Geist Mono (monospace)
- **Hero title:** 10vw on mobile, 8vw on desktop, black, uppercase
- **Section titles:** Large, bold, tracking-tight

### Spacing
- Generous padding (p-8, p-12)
- Consistent gaps between elements
- Full-width sections

---

## 🔄 User Flow

### Adding Items to Cart
1. User scrolls to Menu section
2. Clicks category tab (e.g., "Main Dishes")
3. Views items in grid
4. Clicks "Add to Cart" on desired item
5. Item added to Zustand store
6. Sticky cart badge updates with new count
7. User can continue shopping or click "View Cart"

### Viewing Cart
1. User clicks "View Cart" button
2. Navigates to `/cart` page
3. Sees all items with quantities
4. Can:
   - Increase quantity (+)
   - Decrease quantity (-)
   - Remove item (trash icon)
   - See updated total
5. Click "Continue Shopping" → returns to home page

### Scroll Experience
1. User lands on page
2. Sees "THE BRISKET" title over first brisket frame
3. Scrolls down
4. Brisket animation plays (192 frames)
5. Text overlays appear: "SLOW SMOKED" → "TEXAS STYLE"
6. Reaches testimonials section
7. Continues to menu
8. Sticky cart always visible

---

## 📱 Responsive Behavior

### Mobile (< 768px)
- Hero: 150vh scroll range (faster animation)
- Text: Larger viewport units (10vw)
- Menu: 1 column grid
- Features: Stacked vertically
- Canvas: 85% zoom (fits screen better)

### Desktop (≥ 768px)
- Hero: 250vh scroll range (slower, smoother)
- Text: Smaller viewport units (8vw)
- Menu: 2-3 column grid
- Features: 3 columns
- Canvas: Full scale

---

## 🗂️ File Organization

```
The brisket/
│
├── app/                          # Pages (Next.js App Router)
│   ├── page.tsx                 # Home page
│   ├── layout.tsx               # Root layout (wrapper)
│   ├── globals.css              # Global styles
│   └── cart/
│       └── page.tsx             # Cart page
│
├── components/                   # Reusable UI components
│   ├── HeroBurger.tsx           # Hero animation
│   ├── MenuSection.tsx          # Menu grid
│   ├── Features.tsx             # Info cards
│   ├── Testimonials.tsx         # Reviews
│   └── StickyCart.tsx           # Cart button
│
├── data/
│   └── menu.ts                  # Menu items array
│
├── store/
│   └── cartStore.ts             # Global cart state
│
└── public/                       # Static assets
    ├── brisket-sequence/        # 192 WebP animation frames
    └── images/menu/             # Menu item images
```

---

## ✨ Key Features Summary

| Feature | Technology | Purpose |
|---------|-----------|---------|
| Scroll Animation | Framer Motion + Canvas | Wow factor, brand storytelling |
| Menu Display | React + TypeScript | Product catalog |
| Cart System | Zustand | State management |
| Routing | Next.js App Router | Page navigation |
| Styling | Tailwind CSS | Responsive design |
| Icons | Lucide React | Visual elements |
| Animations | Framer Motion | Smooth transitions |

---

## 🎯 Purpose of Each Section

1. **Hero:** Captures attention, establishes brand identity
2. **Testimonials:** Builds trust, social proof
3. **Menu:** Main conversion area, product showcase
4. **Sticky Cart:** Convenience, always accessible
5. **Features:** Contact info, creates trust
6. **Footer:** Legal, copyright

---

This structure creates a **modern, fast, and engaging** restaurant website that guides users from awareness → interest → action (ordering).
