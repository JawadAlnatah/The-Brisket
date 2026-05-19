# 🎓 The Brisket Website - Complete Learning Roadmap

> **Goal:** Build The Brisket website from scratch while learning modern web development
> **Duration:** ~40-50 days (3 hours/day)
> **Prerequisites:** Basic HTML & CSS knowledge

---

## 📋 Phase 1: JavaScript Fundamentals (Days 1-8)

### Day 1 (3 hours): JavaScript Basics - Variables & Data Types
**What you'll learn:** Variables, strings, numbers, booleans, arrays, objects

**Tasks:**
1. **Setup environment** (30 min)
   - Install [Node.js](https://nodejs.org/) (v20 or higher)
   - Install [VS Code](https://code.visualstudio.com/)
   - Install VS Code extensions: "ES7+ React" and "Prettier"

2. **Practice variables** (1 hour)
   ```javascript
   // Create a file: practice.js
   let restaurantName = "The Brisket";
   const priceOfBrisket = 28.00;
   let isOpen = true;
   
   console.log(restaurantName); // Run: node practice.js
   ```
   - Practice: Create variables for 5 menu items with names and prices

3. **Arrays and Objects** (1.5 hours)
   ```javascript
   // Array
   const menuItems = ["Brisket", "Ribs", "Salad"];
   
   // Object
   const brisket = {
     name: "Smoked Brisket",
     price: 28.00,
     category: "Main Dishes"
   };
   ```
   - Practice: Create an array of 3 menu items (each as an object)
   - Practice: Access properties using `brisket.name` and `brisket.price`

**Resources:**
- [JavaScript.info - Variables](https://javascript.info/variables)
- [MDN - Arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

---

### Day 2 (3 hours): Functions & Methods
**What you'll learn:** Functions, arrow functions, parameters, return values

**Tasks:**
1. **Regular functions** (1 hour)
   ```javascript
   function calculateTotal(price, quantity) {
     return price * quantity;
   }
   
   const total = calculateTotal(28.00, 2);
   console.log(total); // 56.00
   ```
   - Practice: Create `addItem()`, `removeItem()` functions

2. **Arrow functions** (1 hour)
   ```javascript
   const addToCart = (item) => {
     console.log(`Added ${item.name} to cart`);
   };
   ```
   - Practice: Convert your functions to arrow functions

3. **Array methods** (1 hour)
   ```javascript
   const prices = [28, 45, 32];
   const doubled = prices.map(price => price * 2);
   const expensive = prices.filter(price => price > 30);
   const total = prices.reduce((sum, price) => sum + price, 0);
   ```
   - Practice: Use `.map()`, `.filter()`, `.find()` on menu items array

**Checkpoint:** Create a simple cart system with add/remove functions

---

### Day 3 (3 hours): DOM Manipulation & Events
**What you'll learn:** Select elements, modify HTML, handle click events

**Tasks:**
1. **Setup HTML file** (30 min)
   ```html
   <!-- index.html -->
   <!DOCTYPE html>
   <html>
   <head>
     <title>Practice</title>
   </head>
   <body>
     <h1 id="title">The Brisket</h1>
     <button id="addBtn">Add to Cart</button>
     <div id="cart"></div>
     <script src="script.js"></script>
   </body>
   </html>
   ```

2. **Select & modify elements** (1 hour)
   ```javascript
   // script.js
   const title = document.getElementById("title");
   title.textContent = "Welcome to The Brisket";
   title.style.color = "white";
   ```
   - Practice: Change text, colors, add/remove classes

3. **Event listeners** (1.5 hours)
   ```javascript
   const button = document.getElementById("addBtn");
   button.addEventListener("click", () => {
     alert("Item added!");
   });
   ```
   - Practice: Create 3 buttons that add different items to a cart `<div>`

**Checkpoint:** Build a simple page with buttons that add items to a list

---

### Day 4 (3 hours): ES6+ Features
**What you'll learn:** Template literals, destructuring, spread operator, modules

**Tasks:**
1. **Template literals** (45 min)
   ```javascript
   const item = { name: "Brisket", price: 28 };
   const message = `${item.name} costs $${item.price}`;
   ```

2. **Destructuring** (45 min)
   ```javascript
   const { name, price } = item;
   const [first, second] = menuItems;
   ```

3. **Spread operator** (45 min)
   ```javascript
   const newItems = [...menuItems, newItem];
   const updatedItem = { ...item, price: 30 };
   ```

4. **Import/Export** (45 min)
   ```javascript
   // menu.js
   export const menuItems = [...];
   
   // main.js
   import { menuItems } from './menu.js';
   ```

**Checkpoint:** Refactor your cart code using modern ES6 syntax

---

### Day 5-6 (6 hours): Async JavaScript & APIs
**What you'll learn:** Promises, async/await, fetch API

**Day 5 Tasks:**
1. **Understanding async** (1.5 hours)
   ```javascript
   const fetchData = async () => {
     const response = await fetch('https://api.example.com/menu');
     const data = await response.json();
     return data;
   };
   ```

2. **Practice with real API** (1.5 hours)
   - Use [JSONPlaceholder](https://jsonplaceholder.typicode.com/) for practice
   - Fetch posts and display them

**Day 6 Tasks:**
1. **Error handling** (1.5 hours)
   ```javascript
   try {
     const data = await fetchData();
   } catch (error) {
     console.error("Error:", error);
   }
   ```

2. **Build mini project** (1.5 hours)
   - Fetch menu data from a JSON file
   - Display it on a webpage
   - Add loading states

---

### Day 7-8 (6 hours): Review & Mini Project
**Build a simple restaurant menu page with vanilla JavaScript**

**Day 7: Build the page**
- Create HTML structure
- Style with CSS
- Load menu items from JavaScript array
- Add "Add to Cart" buttons

**Day 8: Add interactivity**
- Shopping cart functionality
- Calculate total price
- Display cart items
- Clear cart button

**Checkpoint:** You should have a working menu page with a cart!

---

## 📘 Phase 2: TypeScript Basics (Days 9-11)

### Day 9 (3 hours): TypeScript Fundamentals
**What you'll learn:** Types, interfaces, type safety

**Tasks:**
1. **Setup TypeScript** (30 min)
   ```bash
   npm install -g typescript
   tsc --init
   ```

2. **Basic types** (1.5 hours)
   ```typescript
   let name: string = "Brisket";
   let price: number = 28.00;
   let isAvailable: boolean = true;
   let categories: string[] = ["Main", "Salads"];
   ```

3. **Interfaces** (1 hour)
   ```typescript
   interface MenuItem {
     id: string;
     name: string;
     price: number;
     category: string;
   }
   
   const brisket: MenuItem = {
     id: "m1",
     name: "Smoked Brisket",
     price: 28.00,
     category: "Main Dishes"
   };
   ```

**Practice:** Convert your JavaScript menu array to TypeScript

---

### Day 10 (3 hours): TypeScript with Functions
**What you'll learn:** Function types, return types, generics

**Tasks:**
1. **Typed functions** (1.5 hours)
   ```typescript
   function addItem(item: MenuItem): void {
     console.log(`Added ${item.name}`);
   }
   
   function calculateTotal(items: MenuItem[]): number {
     return items.reduce((sum, item) => sum + item.price, 0);
   }
   ```

2. **Practice** (1.5 hours)
   - Create typed cart functions: `addToCart`, `removeFromCart`, `getTotal`
   - Use interfaces for all data structures

---

### Day 11 (3 hours): TypeScript Review & Practice
**Checkpoint project:** Rebuild your cart system with TypeScript

---

## ⚛️ Phase 3: React Fundamentals (Days 12-20)

### Day 12 (3 hours): React Setup & JSX
**What you'll learn:** Create React app, JSX syntax, components

**Tasks:**
1. **Create React app** (30 min)
   ```bash
   npx create-react-app my-restaurant
   cd my-restaurant
   npm start
   ```

2. **Understanding JSX** (1.5 hours)
   ```jsx
   function MenuItem() {
     return (
       <div className="menu-item">
         <h2>Smoked Brisket</h2>
         <p>$28.00</p>
       </div>
     );
   }
   ```
   - Practice: Create 3 simple components

3. **Props** (1 hour)
   ```jsx
   function MenuItem({ name, price }) {
     return (
       <div>
         <h2>{name}</h2>
         <p>${price}</p>
       </div>
     );
   }
   
   // Usage
   <MenuItem name="Brisket" price={28} />
   ```

**Checkpoint:** Create a Menu component that displays items

---

### Day 13 (3 hours): React State & Events
**What you'll learn:** useState hook, event handling

**Tasks:**
1. **useState basics** (1.5 hours)
   ```jsx
   import { useState } from 'react';
   
   function Counter() {
     const [count, setCount] = useState(0);
     
     return (
       <div>
         <p>Count: {count}</p>
         <button onClick={() => setCount(count + 1)}>+</button>
       </div>
     );
   }
   ```

2. **Cart state** (1.5 hours)
   ```jsx
   const [cart, setCart] = useState([]);
   
   const addToCart = (item) => {
     setCart([...cart, item]);
   };
   ```
   - Practice: Build a cart with add/remove functionality

---

### Day 14 (3 hours): Lists & Keys
**What you'll learn:** Rendering lists, key prop, map()

**Tasks:**
1. **Render menu items** (1.5 hours)
   ```jsx
   const menuItems = [
     { id: 1, name: "Brisket", price: 28 },
     { id: 2, name: "Ribs", price: 45 }
   ];
   
   return (
     <div>
       {menuItems.map(item => (
         <MenuItem key={item.id} {...item} />
       ))}
     </div>
   );
   ```

2. **Conditional rendering** (1.5 hours)
   ```jsx
   {cart.length === 0 ? (
     <p>Cart is empty</p>
   ) : (
     <CartItems items={cart} />
   )}
   ```

**Checkpoint:** Display menu from array, add items to cart

---

### Day 15 (3 hours): useEffect Hook
**What you'll learn:** Side effects, data fetching, cleanup

**Tasks:**
1. **Basic useEffect** (1.5 hours)
   ```jsx
   useEffect(() => {
     console.log('Component mounted');
   }, []); // Runs once
   
   useEffect(() => {
     console.log('Cart updated');
   }, [cart]); // Runs when cart changes
   ```

2. **Fetch data** (1.5 hours)
   ```jsx
   useEffect(() => {
     fetch('/api/menu')
       .then(res => res.json())
       .then(data => setMenuItems(data));
   }, []);
   ```

---

### Day 16-17 (6 hours): Component Architecture
**What you'll learn:** Component composition, lifting state up

**Day 16: Build components**
- Header component
- Menu component
- MenuItem component
- Cart component

**Day 17: Connect components**
- Lift cart state to App component
- Pass state down as props
- Pass functions down to update state

---

### Day 18-19 (6 hours): Styling in React
**What you'll learn:** CSS modules, inline styles, className

**Day 18:**
1. **CSS Modules** (1.5 hours)
   ```css
   /* MenuItem.module.css */
   .menuItem {
     padding: 20px;
     background: black;
   }
   ```
   ```jsx
   import styles from './MenuItem.module.css';
   <div className={styles.menuItem}>...</div>
   ```

2. **Inline styles** (1.5 hours)
   ```jsx
   <div style={{ color: 'white', padding: '20px' }}>...</div>
   ```

**Day 19:**
- Style all your components
- Make it responsive
- Add hover effects

---

### Day 20 (3 hours): React Review
**Mini project:** Build a complete restaurant menu app with cart

**Features:**
- Display menu items from array
- Add to cart functionality
- Show cart count
- Calculate total price
- Remove items from cart

---

## 🔥 Phase 4: Next.js & Advanced Concepts (Days 21-28)

### Day 21 (3 hours): Next.js Setup & Routing
**What you'll learn:** App router, file-based routing, layouts

**Tasks:**
1. **Create Next.js app** (30 min)
   ```bash
   npx create-next-app@latest brisket-restaurant
   # Choose: TypeScript, Tailwind CSS, App Router
   cd brisket-restaurant
   npm run dev
   ```

2. **Understanding app router** (1.5 hours)
   ```
   app/
   ├── page.tsx          # Home page (/)
   ├── layout.tsx        # Root layout
   └── cart/
       └── page.tsx      # Cart page (/cart)
   ```
   - Create a new page at `/menu`
   - Add navigation between pages

3. **Layouts** (1 hour)
   ```tsx
   // app/layout.tsx
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           <Header />
           {children}
           <Footer />
         </body>
       </html>
     );
   }
   ```

---

### Day 22 (3 hours): Tailwind CSS Crash Course
**What you'll learn:** Utility classes, responsive design, dark mode

**Tasks:**
1. **Basic utilities** (1 hour)
   ```tsx
   <div className="bg-black text-white p-8 rounded-lg shadow-xl">
     <h1 className="text-4xl font-bold">The Brisket</h1>
   </div>
   ```
   - Practice: Common classes (padding, margin, colors, text sizes)

2. **Responsive design** (1 hour)
   ```tsx
   <div className="text-sm md:text-lg lg:text-2xl">
     Responsive text
   </div>
   ```
   - Practice: Make components responsive

3. **Custom colors** (1 hour)
   ```tsx
   <div className="bg-[#050505] text-orange-500">
     Custom colors
   </div>
   ```

**Checkpoint:** Style your Next.js app with Tailwind

---

### Day 23 (3 hours): Zustand State Management
**What you'll learn:** Global state, stores, hooks

**Tasks:**
1. **Install Zustand** (15 min)
   ```bash
   npm install zustand
   ```

2. **Create cart store** (1.5 hours)
   ```typescript
   // store/cartStore.ts
   import { create } from 'zustand';
   
   interface CartItem {
     id: string;
     name: string;
     price: number;
     quantity: number;
   }
   
   interface CartState {
     items: CartItem[];
     addItem: (item: CartItem) => void;
     removeItem: (id: string) => void;
     totalPrice: () => number;
   }
   
   export const useCartStore = create<CartState>((set, get) => ({
     items: [],
     addItem: (item) => set((state) => ({
       items: [...state.items, { ...item, quantity: 1 }]
     })),
     removeItem: (id) => set((state) => ({
       items: state.items.filter(i => i.id !== id)
     })),
     totalPrice: () => get().items.reduce((sum, item) => 
       sum + (item.price * item.quantity), 0
     )
   }));
   ```

3. **Use in components** (1.25 hours)
   ```tsx
   import { useCartStore } from '@/store/cartStore';
   
   function MenuSection() {
     const addItem = useCartStore(state => state.addItem);
     
     return (
       <button onClick={() => addItem(item)}>
         Add to Cart
       </button>
     );
   }
   ```

**Checkpoint:** Implement global cart state

---

### Day 24-25 (6 hours): Framer Motion Basics
**What you'll learn:** Animations, transitions, scroll animations

**Day 24: Basic animations**
1. **Install** (15 min)
   ```bash
   npm install framer-motion
   ```

2. **Simple animations** (2.75 hours)
   ```tsx
   import { motion } from 'framer-motion';
   
   <motion.div
     initial={{ opacity: 0, y: 50 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.5 }}
   >
     Content
   </motion.div>
   ```
   - Animate menu items fading in
   - Add hover effects: `whileHover={{ scale: 1.05 }}`

**Day 25: Scroll animations**
1. **useScroll hook** (1.5 hours)
   ```tsx
   import { useScroll, useTransform } from 'framer-motion';
   
   const { scrollY } = useScroll();
   const opacity = useTransform(scrollY, [0, 300], [1, 0]);
   
   <motion.div style={{ opacity }}>
     Fades out on scroll
   </motion.div>
   ```

2. **Practice** (1.5 hours)
   - Create parallax effects
   - Text that fades in while scrolling

---

### Day 26-27 (6 hours): Build The Brisket Structure
**Now we build the actual website!**

**Day 26: Setup project**
1. **Create folders** (30 min)
   ```
   app/
   ├── page.tsx
   ├── layout.tsx
   ├── globals.css
   └── cart/
       └── page.tsx
   
   components/
   ├── HeroBurger.tsx
   ├── MenuSection.tsx
   ├── Features.tsx
   ├── Testimonials.tsx
   └── StickyCart.tsx
   
   data/
   └── menu.ts
   
   store/
   └── cartStore.ts
   ```

2. **Create menu data** (1 hour)
   - Copy menu items from `data/menu.ts` (5 categories, ~24 items)

3. **Build cart store** (1.5 hours)
   - Implement add, remove, decrease, total functions

**Day 27: Build basic components**
1. **Header/Hero placeholder** (1 hour)
2. **Menu Section** (1.5 hours)
   - Display categories as tabs
   - Show items in grid
   - Add "Add to Cart" buttons
3. **Sticky Cart** (30 min)
   - Fixed position at bottom
   - Show item count

---

### Day 28 (3 hours): Polish & Review
**Tasks:**
1. **Test all features** (1 hour)
   - Add items to cart
   - Navigate to cart page
   - Remove items
   - Check totals

2. **Responsive design** (1 hour)
   - Test on mobile view
   - Fix any layout issues

3. **Code cleanup** (1 hour)
   - Remove console.logs
   - Add comments
   - Organize imports

**Checkpoint:** You now have a working restaurant website!

---

## 🎨 Phase 5: Advanced Features (Days 29-40)

### Day 29-30 (6 hours): Hero Scroll Animation
**The complex canvas animation!**

**Day 29: Understanding the concept**
1. **Learn about HTML Canvas** (1.5 hours)
   ```tsx
   const canvasRef = useRef<HTMLCanvasElement>(null);
   
   useEffect(() => {
     const canvas = canvasRef.current;
     const ctx = canvas?.getContext('2d');
     // Draw on canvas
   }, []);
   ```

2. **Load image sequence** (1.5 hours)
   - Understand how 192 frames create animation
   - Preload all images

**Day 30: Implement scroll animation**
1. **Map scroll to frame index** (1.5 hours)
   ```tsx
   const { scrollY } = useScroll();
   const frameIndex = useTransform(scrollY, [0, 1500], [0, 191]);
   ```

2. **Render frames on canvas** (1.5 hours)
   - Follow `HeroBurger.tsx` implementation
   - Test animation smoothness

**Note:** This is the hardest part! Take your time.

---

### Day 31-32 (6 hours): Text Overlays & Polish
**Day 31:**
- Implement "SLOW SMOKED" and "TEXAS STYLE" text overlays
- Make them fade in/out with scroll

**Day 32:**
- Add spring animations for smoothness
- Optimize performance

---

### Day 33-34 (6 hours): Testimonials Section
**Day 33:**
1. **Create testimonial data** (1 hour)
2. **Build scrolling animation** (2 hours)

**Day 34:**
- Infinite loop animation
- Duplicate items for seamless scroll

---

### Day 35-36 (6 hours): Features Section
**Day 35:**
- Contact information
- Icons from Lucide React
- Opening hours

**Day 36:**
- Location with Google Maps link
- Hover effects
- Responsive layout

---

### Day 37-38 (6 hours): Cart Page
**Day 37: Build cart UI**
- List cart items
- Show images, names, prices
- Quantity controls (+/-)

**Day 38: Cart functionality**
- Update quantities
- Remove items
- Calculate subtotal
- Empty cart state

---

### Day 39 (3 hours): Final Polish
**Tasks:**
1. **Background gradients** (1 hour)
   - Add noise texture
   - Dark gradient overlay

2. **Fonts** (30 min)
   - Use Geist Sans font (already in layout)

3. **SEO** (30 min)
   - Update metadata in `layout.tsx`
   - Add descriptions

4. **Final testing** (1 hour)
   - Test all features
   - Check mobile responsiveness

---

### Day 40 (3 hours): Deployment & Review
**Tasks:**
1. **Build for production** (30 min)
   ```bash
   npm run build
   npm run start
   ```

2. **Deploy to Vercel** (1 hour)
   - Create Vercel account
   - Connect GitHub repo
   - Deploy automatically

3. **Review your journey** (1.5 hours)
   - Document what you learned
   - Identify areas to improve
   - Plan next project

---

## 🎉 Congratulations!

You've built a complete modern restaurant website from scratch!

### What You've Learned:
✅ JavaScript fundamentals
✅ TypeScript type safety
✅ React components and hooks
✅ Next.js app router
✅ Tailwind CSS styling
✅ Framer Motion animations
✅ Zustand state management
✅ Canvas API for animations
✅ Responsive design
✅ Deployment

### Next Steps:
1. **Add more features:**
   - User authentication
   - Backend API for orders
   - Payment integration
   - Admin dashboard

2. **Build another project:**
   - E-commerce store
   - Blog platform
   - Social media app

3. **Learn advanced topics:**
   - Server actions in Next.js
   - Database integration (Prisma + PostgreSQL)
   - Authentication (NextAuth)

---

## 📚 Essential Resources

### Documentation
- [React Docs](https://react.dev/)
- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

### Practice Platforms
- [freeCodeCamp](https://www.freecodecamp.org/)
- [Frontend Mentor](https://www.frontendmentor.io/)
- [JavaScript30](https://javascript30.com/)

### YouTube Channels
- [Traversy Media](https://www.youtube.com/@TraversyMedia)
- [Web Dev Simplified](https://www.youtube.com/@WebDevSimplified)
- [Fireship](https://www.youtube.com/@Fireship)

---

## 💡 Tips for Success

1. **Don't skip days** - Consistency is key
2. **Type every line of code** - Don't copy-paste
3. **Break if stuck** - Take a 10-minute walk
4. **Build small projects** - After each concept
5. **Ask questions** - Use Stack Overflow, Discord communities
6. **Review regularly** - Revisit previous days
7. **Have fun!** - Enjoy the learning process

---

**Remember:** Every expert was once a beginner. You've got this! 🚀
