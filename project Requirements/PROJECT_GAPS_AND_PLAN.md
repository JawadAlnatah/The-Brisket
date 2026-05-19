# CIS311 Final Project — Gap Analysis & Fix Plan

## Context
Project: **The Brisket** — Next.js + Supabase restaurant shopping cart  
Due: **Sun 17 May 2026**  
After cross-referencing all three requirement documents against the current codebase, four gaps need fixing before submission.

---

## Current Status vs. Rubric

| Rubric Item | Points | Status |
|---|---|---|
| Display products from DB as images | 1.0 | ✅ Done |
| Product details + quantity from DB | 0.5 | ✅ Done |
| Add to cart + stock check | 0.5 | ✅ Done |
| Checkout with totals + cart icon | 0.5 | ✅ Done |
| Cart: delete / modify / empty | 0.5 | ✅ Done |
| Buy: empty cart + update DB stock | 0.5 | ✅ Done |
| Admin auth (DB check, security guard) | 1.0 | ✅ Done |
| Admin add product + **file upload** | 1.0 | ⚠️ File picker sets path but doesn't actually upload the file |
| Admin search / modify / delete | 1.0 | ✅ Done |
| Cookie (Past Purchases) on **main page** | 1.0 | ❌ Only shown on cart page — Task 12 requires it on the home page |
| Style | 0.5 | ✅ Done |
| JS validation + help window | 2.0 | ✅ Done |
| Implication of Project (4 questions) | 2.0 | ❌ Missing entirely |
| Admin logout visible | — | ⚠️ Hidden on mobile screens (`hidden sm:flex` CSS class) |

**Total points at risk: ~3 points if gaps are not fixed.**

---

## Fix 1 — Past Purchases on Home Page (Task 12) — 1 pt at risk

**Problem:**  
Task 12 says *"Returning customers will see their past purchases on the **main web page**."*  
Currently, the `last_purchase` cookie is read and displayed on the **cart page only** (when cart is empty). The home page (`app/page.tsx`) has no past purchase display at all.

**Solution:**  
Create a new client component `components/PastPurchaseBanner.tsx` that:
- Reads the `last_purchase` cookie on mount
- If found, renders a visible banner: *"Welcome back! Your last order: [items summary]"*
- If cookie is absent, renders nothing (so new customers see no change)

**Where to add it:**  
`app/page.tsx` — insert `<PastPurchaseBanner />` between `<HeroBurger />` and `<Testimonials />`

**Cookie format** (already being set in `app/cart/page.tsx`):
```
last_purchase = URL-encoded string, e.g. "2x Smoked Brisket, 1x Coleslaw — Total: $65.00"
```

---

## Fix 2 — Actual Image Upload to Supabase Storage

**Problem:**  
The admin add/edit product modal has a file picker button (line 503 in `app/admin/dashboard/page.tsx`) that only reads the filename and sets a local path string like `/images/menu/filename.png`. The file **never actually gets uploaded** to any server or storage — it only works if the image file is manually placed in the `public/images/menu/` folder.

The Milestone 2 rubric explicitly checks:
- "Admin add product **include image upload**"
- "Admin modify product **include image upload**"
- The final rubric lists "File upload button" as a required sub-criterion for Add Product (1 pt)

**Solution:**  
In `app/admin/dashboard/page.tsx`, update the `handleImageFile` function (currently lines 166–171):

1. Upload the selected file to Supabase Storage:
   ```ts
   await supabase.storage.from('menu-images').upload(file.name, file, { upsert: true })
   ```
2. Get the public URL back:
   ```ts
   const { data } = supabase.storage.from('menu-images').getPublicUrl(file.name)
   ```
3. Set `form.image` to `data.publicUrl` instead of the hardcoded `/images/menu/` path
4. Show a loading state on the image picker button while uploading ("Uploading…")
5. Show an error toast if the upload fails

> **Note:** The bucket name `'menu-images'` must match the actual bucket name in your Supabase project. Update if different.

---

## Fix 3 — Admin Logout Visible on Mobile

**Problem:**  
In `app/admin/dashboard/page.tsx` at line 425, the div wrapping the logout button has the class `hidden sm:flex` — this makes the logout button **invisible on screens smaller than 640px**. The Milestone 2 rubric specifically checks "Admin logout".

**Solution:**  
Remove `hidden sm:flex` from the wrapper div at line 425.  
The logout function `handleLogout()` and all its logic are already correctly implemented — this is purely a CSS visibility fix.

---

## Fix 4 — Implication of Project Page (Task 17) — 2 pts at risk

**Problem:**  
Task 17 requires a written section answering 4 business questions about the project. It is worth **2 points** in the final rubric and is completely missing from the application.

The 4 required questions:
1. What issues faced by the organization are solved through the website?
2. What technological features were included to solve those problems?
3. What additional problems/challenges may result from the system?
4. How did the tools used help design an appropriate system?

**Solution:**  
Create `app/implications/page.tsx` — a styled static page that answers all 4 questions in the context of The Brisket restaurant.

Add a link to it in `components/Features.tsx` (the contact/about section at the bottom of the home page) so it is accessible from the site.

---

## Summary of Files to Change

| File | Action | Why |
|---|---|---|
| `components/PastPurchaseBanner.tsx` | **Create** new component | Show past purchase cookie on home page |
| `app/page.tsx` | Add `<PastPurchaseBanner />` | Wire the banner into the home page |
| `app/admin/dashboard/page.tsx` | Update `handleImageFile` + fix logout CSS | Real file upload + logout always visible |
| `app/implications/page.tsx` | **Create** new page | Task 17 — Implication of Project (2 pts) |
| `components/Features.tsx` | Add link to `/implications` | Make implications page discoverable |

---

## Verification Checklist

- [ ] Place an order → revisit home page → past purchases banner appears
- [ ] In admin, add a product with a real image file → image appears served from a Supabase Storage URL
- [ ] Resize browser to mobile → admin logout button is visible
- [ ] Visit `/implications` → all 4 business questions are answered
