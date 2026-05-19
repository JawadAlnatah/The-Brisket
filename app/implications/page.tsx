import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function ImplicationsPage() {
    return (
        <main className="bg-[#050505] min-h-screen text-white font-sans selection:bg-orange-500 selection:text-white pb-24">
            <div className="max-w-4xl mx-auto px-6 pt-32">
                {/* Header */}
                <div className="flex items-center gap-4 mb-12">
                    <Link href="/" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">Implication of Project</h1>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 space-y-12 backdrop-blur-sm">
                    
                    {/* Intro / Context */}
                    <div className="border-b border-white/10 pb-8">
                        <p className="text-gray-400 leading-relaxed text-lg">
                            This section outlines the business systems analysis and implications for 
                            <strong className="text-white"> The Brisket</strong> project, in fulfillment of 
                            <span className="text-orange-500 font-bold"> Task 17</span> of the CIS311 Final Project.
                        </p>
                    </div>

                    {/* Question 1 */}
                    <section>
                        <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-start gap-3">
                            <span className="text-orange-500 font-black">1.</span>
                            What issues faced by the organization are solved through the website?
                        </h2>
                        <div className="pl-6 md:pl-8 text-gray-300 leading-relaxed space-y-3">
                            <p>
                                Prior to the system, The Brisket relied heavily on manual phone orders and walk-in requests. This manual process led to several organizational issues:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-400">
                                <li><strong>Order inaccuracies:</strong> Taking phone orders in a loud kitchen often resulted in mistakes.</li>
                                <li><strong>Lost revenue:</strong> During peak hours, busy phone lines prevented new customers from placing orders.</li>
                                <li><strong>Inventory mismanagement:</strong> Staff had no real-time way to track how much smoked meat was left, often leading to selling items that were already out of stock.</li>
                            </ul>
                            <p>
                                The website solves these issues by automating the ordering process, allowing customers to self-serve, and digitally tracking stock quantities so items automatically hide when sold out.
                            </p>
                        </div>
                    </section>

                    {/* Question 2 */}
                    <section>
                        <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-start gap-3">
                            <span className="text-orange-500 font-black">2.</span>
                            What technological features were included to solve those problems?
                        </h2>
                        <div className="pl-6 md:pl-8 text-gray-300 leading-relaxed space-y-3">
                            <p>To address the organizational challenges, several key features were implemented:</p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-400">
                                <li><strong>Interactive Digital Menu & Cart:</strong> Built with React and Zustand state management, allowing users to accurately build their orders without staff intervention.</li>
                                <li><strong>Real-time Database (Supabase):</strong> Tracks inventory dynamically. When a user checks out, the database automatically decrements the stock for the purchased items.</li>
                                <li><strong>Admin Dashboard:</strong> A secure, authenticated control panel where management can easily add new menu items, update prices, and upload images to Supabase Cloud Storage.</li>
                                <li><strong>Order Management Interface:</strong> Allows kitchen staff to see new orders instantly and update their status (Pending, Completed, Cancelled).</li>
                            </ul>
                        </div>
                    </section>

                    {/* Question 3 */}
                    <section>
                        <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-start gap-3">
                            <span className="text-orange-500 font-black">3.</span>
                            What additional problems/challenges may result from the system?
                        </h2>
                        <div className="pl-6 md:pl-8 text-gray-300 leading-relaxed space-y-3">
                            <p>While the website solves many problems, introducing a digital system creates new challenges:</p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-400">
                                <li><strong>Staff Training:</strong> The kitchen and management staff must be trained to constantly monitor the Admin Dashboard for new orders, rather than waiting for a phone to ring.</li>
                                <li><strong>Inventory Synchronization:</strong> If walk-in customers buy brisket, staff must manually update the digital stock in the Admin Dashboard, otherwise online customers might buy stock that is physically gone.</li>
                                <li><strong>Internet Dependency:</strong> If the restaurant experiences an internet outage, they temporarily lose access to incoming digital orders and the admin panel.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Question 4 */}
                    <section>
                        <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-start gap-3">
                            <span className="text-orange-500 font-black">4.</span>
                            How did the tools used help design an appropriate system?
                        </h2>
                        <div className="pl-6 md:pl-8 text-gray-300 leading-relaxed space-y-3">
                            <p>
                                The choice of modern web development tools was crucial in designing a fast, reliable, and appropriate system for a restaurant environment:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-400">
                                <li><strong>Next.js & React:</strong> Allowed for the creation of a seamless, app-like user experience with immediate feedback (like the sliding cart), which is essential for preventing cart abandonment.</li>
                                <li><strong>Tailwind CSS:</strong> Enabled rapid, responsive styling to ensure the website looks beautiful and functions perfectly on mobile phones, where the majority of food orders are placed.</li>
                                <li><strong>Supabase (PostgreSQL):</strong> Provided a highly relational and scalable backend without the need to manage a separate server. Its built-in cloud storage and Row Level Security ensured that admin data remains secure while menu data is fetched instantly.</li>
                            </ul>
                        </div>
                    </section>

                </div>
                
                <div className="mt-12 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-wider px-8 py-4 rounded-xl transition-all hover:scale-105">
                        <CheckCircle size={20} /> Return to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}
