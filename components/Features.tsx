"use client";
import Link from "next/link";

export default function Features() {
    return (
        <section id="contact" className="bg-white relative z-10">

            {/* ── Top: Business Info ── */}
            <div className="py-24 px-6 relative">
                {/* Decorative Branding - Subtle */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent opacity-5 pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-gray-500 font-medium tracking-widest uppercase mb-4">AUTHENTIC SMOKEHOUSE</p>
                    <h3 className="text-3xl md:text-5xl font-black text-black mb-12">Experience the <span className="text-orange-600">finest smoked brisket</span> in town.</h3>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-16">
                        <div className="flex flex-col items-center group">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 group-hover:text-orange-600 transition-colors">Order Now</span>
                            <a href="tel:0541460722" className="text-3xl md:text-4xl font-black text-black hover:text-orange-600 transition-colors">
                                054 146 0722
                            </a>
                        </div>
                        <div className="w-16 h-px bg-gray-200 md:w-px md:h-16" />
                        <div className="flex flex-col items-center group">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 group-hover:text-orange-600 transition-colors">Location</span>
                            <a
                                href="https://maps.app.goo.gl/UkdojxzdaSoibrbG6"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-3xl md:text-4xl font-black text-black hover:text-orange-600 transition-colors"
                            >
                                Tarout
                            </a>
                        </div>
                        <div className="w-16 h-px bg-gray-200 md:w-px md:h-16" />
                        <div className="flex flex-col items-center group">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 group-hover:text-orange-600 transition-colors">Hours</span>
                            <span className="text-xl md:text-2xl font-black text-black">12 PM – 12 AM</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Embedded Google Map ── */}
            <div className="w-full h-[420px] relative border-t border-gray-100">
                {/* Map label overlay */}
                <div className="absolute top-4 left-4 z-10 bg-white shadow-lg rounded-xl px-4 py-2 flex items-center gap-2">
                    <span className="text-orange-600 font-black text-sm uppercase tracking-wider">📍 THE BRISKET</span>
                    <span className="text-gray-400 text-xs">· Tarout, Eastern Province</span>
                </div>
                <iframe
                    title="The Brisket Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3580.9!2d50.0415934!3d26.5657723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e4a0100211ebd23%3A0xaed494ed48e324c!2sTHE%20BRISKET!5e0!3m2!1sen!2ssa!4v1"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>

            {/* ── Footer line ── */}
            <div className="py-8 px-6 text-center border-t border-gray-100 flex flex-col items-center gap-4">
                <Link 
                    href="/implications"
                    className="inline-block text-orange-500 hover:text-orange-600 text-xs font-bold uppercase tracking-widest transition-colors"
                >
                    Project Implications (Task 17)
                </Link>
            </div>
        </section>
    );
}

