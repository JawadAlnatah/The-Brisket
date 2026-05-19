# CIS 311 Final Project - Rubric to Codebase Mapping

This document maps every single requirement from the **CIS311 Final Project Rubric** directly to the exact file and function where it is implemented in "The Brisket" project. You can use this during your presentation or code review to instantly show the Dr. where the work was done.

---

## Functionality 1: Cart (3.5 Marks)

### 1. Display Products (1 Mark)
* **Requirements:** Products displayed, From database, As images.
* **Where in code:** 
  - **`app/page.tsx`**: Contains the main menu rendering. It fetches the menu items directly from the Supabase database.
  - **`components/ui/` or `app/page.tsx`**: Renders the images using the `<img>` or Next.js `<Image>` tags.

### 2. Product Details (0.5 Marks)
* **Requirements:** Display selected product details, From database, Allow quantity input.
* **Where in code:** 
  - **`app/page.tsx`**: The menu section displays the descriptions and prices fetched from the database.
  - **`app/cart/page.tsx`**: Shows the full details of selected products and provides the `+` and `-` buttons to modify the quantity.

### 3. Add to Cart Button (0.5 Marks)
* **Requirements:** Check quantity against stock, Add items, Reflect in cart image product.
* **Where in code:** 
  - **`store/cartStore.ts`**: The `addItem` function checks `if (existingItem.quantity >= item.stock)` before allowing the addition to prevent exceeding inventory.
  - **`app/page.tsx` / Header Navigation**: The floating cart icon instantly reflects the total number of items using Zustand global state (`items.length`).

### 4. Checkout (0.5 Marks)
* **Requirements:** Display all products in cart, Calculate total for each product, Calculate total for all products, Display all products in cart by clicking cart image.
* **Where in code:** 
  - **`app/cart/page.tsx`**: This entire page is dedicated to checkout. 
  - **`store/cartStore.ts`**: The `totalPrice` function calculates the grand total. The UI maps through the array to show `item.price * item.quantity` for individual product subtotals.

### 5. Allow Modification in Cart (0.5 Marks)
* **Requirements:** Delete, Modify, Empty cart.
* **Where in code:** 
  - **`store/cartStore.ts`**: Contains `removeItem` (Delete), `increaseItem`/`decreaseItem` (Modify), and `clearCart` (Empty).
  - **`app/cart/page.tsx`**: Implements the UI buttons (Trash icon, `+`/`-` buttons, and "Empty Cart" button) that trigger these store functions.

### 6. Buy Product (0.5 Marks)
* **Requirements:** Empty cart, Update database, Detect quantity.
* **Where in code:** 
  - **`app/cart/page.tsx` (`handleCheckout` function)**: When "Place Order" is clicked, it:
    1. Loops through items and reduces stock in the database (`update { stock: data.stock - item.quantity }`).
    2. Inserts the order into the `orders` and `order_items` tables.
    3. Calls `clearCart()` to empty the user's session cart.

---

## Functionality 2: Admin (3 Marks)

### 7. Authenticate (1 Mark)
* **Requirements:** Check against database, authorise/give msg, Security (hide admin pages/logout unless logged in).
* **Where in code:** 
  - **`app/admin/page.tsx`**: Contains the admin login form. Submits to Supabase Auth / custom table to check credentials.
  - **`lib/adminAuth.ts`**: Handles the security logic.
  - **`app/admin/dashboard/page.tsx`**: The dashboard itself is protected. If a user is not authenticated, they are redirected away. No admin buttons are visible to normal customers.

### 8. Add Product (1 Mark)
* **Requirements:** Page to add, Insert db, File upload button, Appear in products.
* **Where in code:** 
  - **`app/admin/dashboard/page.tsx`**: Features a form/modal for adding a new product. 
  - **File Upload**: Uses Supabase Storage to upload the image file, saves the returned file URL, and inserts the new record into the `menu_items` database. It immediately appears on `app/page.tsx`.

### 9. Search to Delete and Update (1 Mark)
* **Requirements:** Search for product, Modify, Delete, Reflect in database.
* **Where in code:** 
  - **`app/admin/dashboard/page.tsx`**: Features a search bar and a list of all products. Each product has an "Edit" (modify) and "Delete" button which run SQL/Supabase commands (`UPDATE` or `DELETE`) to directly alter the database.

---

## Functionality 3: Extra Features (5.5 Marks)

### 10. Cookie - Past Purchases (1 Mark)
* **Requirements:** Store and display past purchases using cookies.
* **Where in code:** 
  - **`app/cart/page.tsx` (Lines 138-142)**: During successful checkout, `document.cookie` creates the `last_purchase` cookie holding the receipt string.
  - **`components/PastPurchaseBanner.tsx`**: Reads `document.cookie`, extracts the receipt, and displays it on the main page for returning customers.

### 11. Style (0.5 Marks)
* **Requirements:** HTML and CSS, similar appearance, max 10 pages, images stored properly.
* **Where in code:** 
  - Implemented globally via **Tailwind CSS** (`app/globals.css`). The app follows a consistent dark/orange cinematic theme across all pages.

### 12. Javascript (2 Marks)
* **Requirements:** Validate forms with JS, Help Window popup.
* **Where in code:** 
  - **Form Validation (`app/cart/page.tsx`)**: JS Regex checks ensure the phone number is 10 digits and the name is valid text before allowing the checkout button to work.
  - **Help Window (`app/admin/page.tsx`)**: The `showHelp()` function triggers a browser `window.alert()` popup with instructions, completely satisfying the help window requirement.

### 13. Implication of Project (2 Marks)
* **Requirements:** Document business issues solved, tech features, challenges, and tools used.
* **Where in code:** 
  - **`presentation_material.md`**: Specifically written out in Section 4 to answer the 4 mandatory implication questions from the rubric for your report/presentation.
