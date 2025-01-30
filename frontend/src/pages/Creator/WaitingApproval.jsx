import React, { useRef, useState } from 'react';
import ModernNavbar from '../../components/ModernNavbar';

const WaitingApproval = () => {
    const emailRef = useRef(null);
    const [isChecking, setIsChecking] = useState(false);

    const check = async () => {
        setIsChecking(true);
        try {
            const response = await fetch("http://localhost:3000/admin/waiting", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: emailRef.current.value }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            if (data.message === "Approved") {
                alert("You have been approved");
            } else {
                alert("Oops, you aren't approved");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <div>
            {/* Inject global styles for the glowing background animation */}
            <style>
                {`
                @keyframes glowing-background {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }

                .animate-glowing-background {
                    background: linear-gradient(270deg, #003554, #081A42, #003554 , #081A42);
                    background-size: 400% 400%;
                    animation: glowing-background 10s ease infinite;
                }
                `}
            </style>

            <ModernNavbar />
            {/* Dynamic glowing background container */}
            <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
                {/* Animated glowing background */}
                <div className="absolute inset-0 animate-glowing-background"></div>

                {/* Form container */}
                <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8 w-full max-w-md animate-fade-in transition-all duration-300 hover:shadow-[0_0_20px_5px_rgba(0,166,251,0.4)] relative z-10">
                    <h1 className="text-3xl font-bold text-center mb-6 text-[#051923] animate-slide-down">
                        Waiting for Approval
                    </h1>
                    
                    <div className="space-y-4">
                        <div className="relative">
                            <input
                                type="email"
                                ref={emailRef}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 rounded-lg border-2 border-[#0582CA] focus:border-[#00A6FB] outline-none transition-all duration-300 text-[#051923] bg-white/50 backdrop-blur-sm hover:shadow-md focus:scale-105 focus:shadow-lg"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <svg
                                    className="w-5 h-5 text-[#0582CA] animate-bounce"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                        </div>

                        <button
                            onClick={check}
                            disabled={isChecking}
                            className="w-full bg-[#00A6FB] hover:bg-[#0582CA] text-white font-semibold py-3 rounded-lg transition-all duration-300 relative overflow-hidden hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#00A6FB] focus:ring-offset-2"
                        >
                            {isChecking ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Checking...
                                </div>
                            ) : (
                                "Check Status"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WaitingApproval;