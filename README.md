# AgriCare Hero

Build a clean, high-converting, modern Frontend-only Agriculture/Fertilizer Store Home Page using React, Tailwind CSS, and Lucide Icons (or React Icons). 

Do NOT set up any backend yet. Focus strictly on a responsive, polished UI layout.

### Branding & Color Palette
- Business Name: "Chaudhary Traders" (Agri-Care & Plant Protection Store)
- Background: Pure White (#FFFFFF) and Light Clean Gray (#F8FAFC)
- Primary Navy Color: `#2A1B69` (For Top Header bar, Nav links, and Primary headings)
- Accent Agriculture Green: `#00A651` (For active links, badges, hover states, and action buttons)
- Body Text: Muted Dark Gray (#64748B)

---

### Section 1: Top Bar & Navigation Bar
1. Top Bar (Background: `#2A1B69`, Text: White, Text Size: Small):
   - Left side: Email (info@chaudharytraders.com) and Phone (+92 300 1234567).
   - Right side: Social media icons (Facebook, Instagram, WhatsApp, YouTube).
2. Main Navbar (Background: White, Sticky, Shadow-sm):
   - Logo: "Chaudhary Traders" with a green leaf accent style.
   - Nav Links: Home (Active - Green), About Us, Products (Dropdown style), Services, Brands/Companies, POS Counter, Contact Us.
   - Right Side: Search bar button.

---

### Section 2: Smooth Image Carousel / Hero Slider (MAIN FOCUS)
Create an auto-playing, smooth-transition Hero Carousel component:
- Behavior: Auto-scroll through 3 agriculture-themed high-res images every 4 seconds.
- Transition: Use smooth cross-fade and CSS keyframe zoom/pan effect (Ken Burns effect) so that while the image stays, it subtly moves/scales smoothly giving a high-end dynamic feel.
- Dark Overlay: Subtle dark overlay on images to make white text pop out clearly.
- Slide Content over Images:
  - Slide 1: Heading "Quality Fertilizers for Maximum Crop Yield" + Subtext "Official dealer of Engro, FMC & Syngenta" + Green "Explore Products" button.
  - Slide 2: Heading "Advanced Plant Protection & Pesticides" + Subtext "Safeguard your crops with modern spray formulations" + Green "Consult Advisor" button.
  - Slide 3: Heading "Trusted Agri Partner in Sahiwal" + Subtext "Serving farmers with authentic seeds and fertilizers" + Green "Visit Store" button.
- Controls: Smooth dot indicators at the bottom and subtle left/right arrow navigation buttons.

---

### Section 3: Live Weather & Spray Advisory Bar (Farmer Utility)
- A clean white card bar right under the hero section displaying:
  - Local Sahiwal Live Weather Alert (e.g., 32°C Sunny | Ideal Conditions for Wheat Spray).
  - Quick Info Badges: 100% Original Products | Doorstep Delivery | Expert Advisory.

---

### Section 4: Featured Product Categories Grid
- Display 4 Category Cards in a responsive grid:
  1. Fertilizers (Khad)
  2. Crop Sprays (Pesticides)
  3. Hybrid Seeds
  4. Micronutrients & Plant Medicines
- Card Style: White background, subtle gray border (#E2E8F0), soft hover shadow lift, green badge tags, and a "Browse Items" button.

---

### Section 5: Our Services Section (Sungro Theme Style)
- Left Column: Heading "Our Agriculture Services" in `#2A1B69` with a short green accent underline bar. Paragraph explaining advisory services, plus a green pill-shaped button "View All Services".
- Right Columns: 2 Cards showcasing "Farmer Awareness Campaigns" and "Direct Franchise & Delivery" with images and descriptions.

---

### Section 6: Trusted Partner Brands (Companies Carousel)
- Showcase logos/names of top brands: Engro Fertilizers, FMC, Syngenta, Bayer, Fatima Fertilizer.

---

### Section 7: Footer
- Background: `#2A1B69` with white text.
- Columns for About Chaudhary Traders, Quick Navigation Links, Contact Address (Main Grain Market, Sahiwal), and Copyright text.

Make all components responsive (Mobile, Tablet, Desktop) using standard Tailwind classes.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://chaudhary-agro-showcase.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d225f9df-8f8d-4331-9d23-44034597832e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
