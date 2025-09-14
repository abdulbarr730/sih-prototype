import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Logo component as an inline SVG for scalability
const CrediFolioLogo = ({ size = 'w-12 h-12', className = '' }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={`${size} ${className}`} 
        viewBox="0 0 100 100" 
        fill="none"
    >
        <path d="M50 0L20 15V85L50 100L80 85V15L50 0Z" fill="#7C3AED" stroke="#4C1D95" strokeWidth="2" />
        <rect x="25" y="45" width="50" height="40" rx="5" fill="#FFFFFF" stroke="#4C1D95" strokeWidth="2" />
        <path d="M50 20L30 30L50 40L70 30L50 20Z" fill="#4C1D95" stroke="#4C1D95" strokeWidth="2" />
        <path d="M50 40L30 30V40L50 50L70 40V30L50 40Z" fill="#4C1D95" stroke="#4C1D95" strokeWidth="2" />
        <rect x="35" y="65" width="30" height="5" rx="2" fill="#7C3AED" />
        <rect x="35" y="75" width="30" height="5" rx="2" fill="#7C3AED" />
        <path d="M50 20L50 85" stroke="#4C1D95" strokeWidth="2" strokeLinecap="round" />
        <path d="M25 85L75 85" stroke="#4C1D95" strokeWidth="2" strokeLinecap="round" />
    </svg>
);


// Modal component for the sign-up form

// Main App component
export default function LandingPage() {

    return (
        <div className="bg-gray-100 text-gray-800 font-inter">
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
                .font-inter {
                    font-family: 'Inter', sans-serif;
                }
                .hero-bg {
                    background-image: linear-gradient(135deg, #4c1d95, #7c3aed);
                    position: relative;
                    overflow: hidden;
                }
                .hero-bg::before {
                    content: '';
                    position: absolute;
                    top: -20%;
                    left: -20%;
                    width: 140%;
                    height: 140%;
                    background: rgba(255, 255, 255, 0.05);
                    transform: rotate(30deg);
                    z-index: 0;
                }
                .text-gradient {
                    background: -webkit-linear-gradient(135deg, #e0e7ff, #93c5fd);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                `}
            </style>

            {/* Hero Section */}
            <header className="hero-bg text-white py-12 md:py-24 relative">
                <div className="container mx-auto px-4 text-center z-10 relative">
                    <div className="flex justify-center items-center mb-4">
                        <CrediFolioLogo size="w-20 h-20" className="mr-4" />
                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                            <span className="text-gradient">CrediFolio</span>
                        </h1>
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">The Digital Passport of Student Life</h2>
                    <p className="text-base sm:text-lg md:text-xl font-light max-w-2xl mx-auto mb-8">
                        From Chaos to Clarity. We transform your student achievements into verifiable, lifelong credentials.
                    </p>
                    <div className="space-y-4 sm:space-y-0 sm:space-x-4">
                        <Link
                            to="/login"
                            className="bg-white text-purple-700 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 inline-block"
                        >
                            Get Started Now
                        </Link>
                    </div>
                </div>
            </header>

            {/* Problem Section */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">The Problem: The "Digital Black Hole" of Achievement</h2>
                        <p className="text-gray-600 max-w-3xl mx-auto">
                            Where do your hard-earned skills and accomplishments go? In today's system, they're scattered, lost, and unverified, creating a major trust deficit.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="p-6 rounded-lg bg-red-50 border-red-200 border transform transition-all duration-300 hover:scale-105 shadow-md">
                            <div className="text-4xl text-red-500 mb-4">🎓</div>
                            <h3 className="font-bold text-xl mb-2">Fragmented Identity</h3>
                            <p className="text-gray-600">Your achievements are spread across different departments and records, making it hard to see your full potential.</p>
                        </div>
                        <div className="p-6 rounded-lg bg-yellow-50 border-yellow-200 border transform transition-all duration-300 hover:scale-105 shadow-md">
                            <div className="text-4xl text-yellow-500 mb-4">😟</div>
                            <h3 className="font-bold text-xl mb-2">Burden of Proof</h3>
                            <p className="text-gray-600">You face the hassle of proving your skills to universities and employers, leading to lost opportunities.</p>
                        </div>
                        <div className="p-6 rounded-lg bg-blue-50 border-blue-200 border transform transition-all duration-300 hover:scale-105 shadow-md">
                            <div className="text-4xl text-blue-500 mb-4">🤷</div>
                            <h3 className="font-bold text-xl mb-2">Lost Opportunities</h3>
                            <p className="text-gray-600">Unrecorded skills and achievements often mean missed opportunities for growth and career advancement.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 md:py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">How It Works: From Upload to Opportunity</h2>
                        <p className="text-gray-600 max-w-3xl mx-auto">
                            CrediFolio provides a seamless journey from your achievement to a showcase-ready digital portfolio.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Step 1: Upload */}
                        <div className="p-8 bg-white rounded-xl shadow-md transform transition-all duration-300 hover:scale-105">
                            <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-xl mb-2">1. Upload</h3>
                            <p className="text-gray-600">Submit your achievement with digital evidence (certificates, photos) through our intuitive interface.</p>
                        </div>
                        {/* Step 2: Verify */}
                        <div className="p-8 bg-white rounded-xl shadow-md transform transition-all duration-300 hover:scale-105">
                            <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.047A12.043 12.043 0 002.944 12c.004 3.08 1.48 5.92 3.868 7.64a12.164 12.164 0 005.183 2.155 12.071 12.071 0 002.348-.198 12.067 12.067 0 002.348-.198c2.09-.34 4.026-1.31 5.618-2.883a12.164 12.164 0 003.868-7.64c.004-3.08-1.48-5.92-3.868-7.64z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-xl mb-2">2. Verify</h3>
                            <p className="text-gray-600">The designated authority (e.g., faculty) reviews the evidence and approves it with a single click.</p>
                        </div>
                        {/* Step 3: Showcase */}
                        <div className="p-8 bg-white rounded-xl shadow-md transform transition-all duration-300 hover:scale-105">
                            <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-xl mb-2">3. Showcase</h3>
                            <p className="text-gray-600">Your verified achievement is instantly added to your dynamic, shareable digital portfolio.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Unique Selling Propositions Section */}
            <section className="py-16 md:py-24 bg-gray-100">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">The Winning Edge: Our Unique Selling Propositions</h2>
                        <p className="text-gray-600 max-w-3xl mx-auto">
                            CrediFolio is built on a foundation of cutting-edge technology to provide trust, intelligence, and a seamless user experience.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="p-6 rounded-lg bg-gray-50 border-gray-200 border transform transition-all duration-300 hover:scale-105 shadow-md">
                            <div className="text-4xl mb-4">🔐</div>
                            <h3 className="font-bold text-xl mb-2">Blockchain for Verifiability</h3>
                            <p className="text-gray-600">We store a cryptographic hash of every verified certificate on a blockchain, making it 100% tamper-proof and instantly verifiable.</p>
                        </div>
                        <div className="p-6 rounded-lg bg-gray-50 border-gray-200 border transform transition-all duration-300 hover:scale-105 shadow-md">
                            <div className="text-4xl mb-4">🧠</div>
                            <h3 className="font-bold text-xl mb-2">AI-Powered Recommendation Engine</h3>
                            <p className="text-gray-600">Our ML engine analyzes a student's profile to recommend relevant workshops, courses, and competitions to help them discover opportunities.</p>
                        </div>
                        <div className="p-6 rounded-lg bg-gray-50 border-gray-200 border transform transition-all duration-300 hover:scale-105 shadow-md">
                            <div className="text-4xl mb-4">🏷</div>
                            <h3 className="font-bold text-xl mb-2">NLP-based Skill Tagging</h3>
                            <p className="text-gray-600">We use Natural Language Processing to automatically extract and tag skills from certificates and descriptions for smart profiling and easier discovery by recruiters.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Empowering Every User</h2>
                        <p className="text-gray-600 max-w-3xl mx-auto">
                            CrediFolio is built to serve students, faculty, and institutions, providing powerful tools for everyone.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="p-6 rounded-lg border-2 border-purple-200 bg-purple-50 transform transition-all duration-300 hover:shadow-xl">
                            <h3 className="font-bold text-lg mb-2 text-purple-800">For Students</h3>
                            <ul className="text-gray-600 list-disc list-inside space-y-1">
                                <li>Dynamic Dashboard</li>
                                <li>Real-time Progress View</li>
                                <li>Gamification with Points</li>
                            </ul>
                        </div>
                        <div className="p-6 rounded-lg border-2 border-blue-200 bg-blue-50 transform transition-all duration-300 hover:shadow-xl">
                            <h3 className="font-bold text-lg mb-2 text-blue-800">For Faculty</h3>
                            <ul className="text-gray-600 list-disc list-inside space-y-1">
                                <li>Seamless Verification</li>
                                <li>Reduced Paperwork</li>
                                <li>Simple Approval Panel</li>
                            </ul>
                        </div>
                        <div className="p-6 rounded-lg border-2 border-green-200 bg-green-50 transform transition-all duration-300 hover:shadow-xl">
                            <h3 className="font-bold text-lg mb-2 text-green-800">For Everyone</h3>
                            <ul className="text-gray-600 list-disc list-inside space-y-1">
                                <li>Auto-Generated Portfolio</li>
                                <li>Shareable Web Link & QR Code</li>
                                <li>Customizable Templates</li>
                            </ul>
                        </div>
                        <div className="p-6 rounded-lg border-2 border-yellow-200 bg-yellow-50 transform transition-all duration-300 hover:shadow-xl">
                            <h3 className="font-bold text-lg mb-2 text-yellow-800">For Institutions</h3>
                            <ul className="text-gray-600 list-disc list-inside space-y-1">
                                <li>Powerful Analytics</li>
                                <li>Audit-Ready Reports</li>
                                <li>Data-Driven Insights</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-16 md:py-24 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Ready to build your verifiable portfolio?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                        Join the platform that is changing the way we record and share academic achievements. Sign up today and unlock your full potential.
                    </p>
                    <Link
                        to="/login"
                        className="bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-purple-800 transition-all duration-300 transform hover:scale-105 inline-block"
                    >
                        Sign Up Now
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-gray-400 py-8">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex justify-center items-center mb-4">
                        <CrediFolioLogo size="w-10 h-10" className="mr-2" />
                        <span className="text-xl font-bold text-white">CrediFolio</span>
                    </div>
                    <p>&copy; 2024 CrediFolio. All rights reserved.</p>
                    <p className="text-sm mt-2">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a> |
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </p>
                    <p className="text-sm mt-2">
                        Contact us: <a href="mailto:credifolio.sih2025@gmail.com" className="hover:text-white transition-colors">credifolio.sih2025@gmail.com</a>
                    </p>
                </div>
            </footer>

             
        </div>
    );
};

