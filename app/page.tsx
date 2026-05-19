import HeroBurger from "@/components/HeroBurger";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import MenuSection from "@/components/MenuSection";
import StickyCart from "@/components/StickyCart";
import PastPurchaseBanner from "@/components/PastPurchaseBanner";


export default function Home() {
  return (
    <main className="bg-[#050505] min-h-screen">

      {/* 1. Scrollytelling Hero */}
      <HeroBurger />



      {/* 3. Social Proof */}
      <Testimonials />

      {/* 4. Menu & Conversion */}
      <div id="menu">
        <PastPurchaseBanner />
        <MenuSection />
      </div>

      {/* 5. Sticky Cart */}
      <StickyCart />

      {/* 2. Features (Moved to Bottom as About Us) */}
      <Features />

      {/* 6. Simple Footer */}
      <footer className="py-12 text-center text-gray-600 text-sm border-t border-white/5 relative z-10">
        <p>© 2026 THE BRISKET. ALL RIGHTS RESERVED.</p>
      </footer>
    </main>
  );
}
