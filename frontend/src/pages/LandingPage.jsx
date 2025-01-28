import React from "react";
import ModernNavbar from '../components/ModernNavbar';
import { ArrowRight, Star, Award, Rocket, Clock, Shield, Search } from 'lucide-react';
import ModerFooter from '../components/ModernFooter';

const LandingPage = () => {
  const popularCategories = [
    { name: "Social Media Content", count: "2,145 experts" },
    { name: "Blog Writing", count: "1,893 experts" },
    { name: "SEO Content", count: "1,567 experts" },
    { name: "Video Scripts", count: "945 experts" },
    { name: "Email Marketing", count: "1,234 experts" },
    { name: "Technical Writing", count: "876 experts" }
  ];

  return (
    <div className="min-h-screen bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CiAgPGZpbHRlciBpZD0ibm9pc2UiPgogICAgPGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNzUiIG51bU9jdGF2ZXM9IjIiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz4KICA8L2ZpbHRlcj4KICA8cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] bg-repeat">
      <ModernNavbar />
      
      {/* Hero Section */}
      <div className="pt-24 bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Find the Perfect
                <span className="bg-gradient-to-r from-[#CC5803] to-[#FF9505] bg-clip-text text-transparent">
                  {" "}Content Creator
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Connect with top-tier content creators for your brand. Quality content, delivered on time, every time.
              </p>
              
              {/* Search Bar */}
              <div className="relative mb-8">
                <input
                  type="text"
                  placeholder="Try 'social media content' or 'blog writing'"
                  className="w-full px-6 py-4 rounded-lg border-2 border-gray-200 focus:border-[#FFB627] focus:outline-none shadow-sm"
                />
                <button className="absolute right-2 top-2 px-4 py-2 bg-[#CC5803] hover:bg-[#E2711D] text-white rounded-lg font-semibold transition-all">
                  Search
                </button>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-[#FFB627] mr-2" />
                  <span className="text-gray-600">4.8/5 average rating</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-[#CC5803] mr-2" />
                  <span className="text-gray-600">Verified experts</span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative">
                <img
                  src="/api/placeholder/600/400"
                  alt="Content Creators"
                  className="rounded-lg shadow-2xl"
                />

                {/* Floating Stats Card */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Rocket className="h-6 w-6 text-[#CC5803]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Active Creators</p>
                      <p className="text-xl font-bold text-gray-900">10,000+</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Popular Categories
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCategories.map((category, index) => (
              <a
                key={index}
                href="#"
                className="p-6 rounded-lg border border-gray-100 hover:shadow-lg transition-all hover:border-[#FFB627] group"
              >
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-[#CC5803] mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600">{category.count}</p>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-orange-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="h-8 w-8 text-[#CC5803]" />,
                title: "1. Find Your Creator",
                description: "Browse profiles and reviews to find the perfect match for your content needs"
              },
              {
                icon: <Clock className="h-8 w-8 text-[#E2711D]" />,
                title: "2. Place Your Order",
                description: "Discuss requirements and timeline with your chosen creator"
              },
              {
                icon: <Shield className="h-8 w-8 text-[#FF9505]" />,
                title: "3. Get Quality Content",
                description: "Receive your content with our satisfaction guarantee"
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Creator CTA */}
      <div className="py-20 bg-gradient-to-r from-[#CC5803] to-[#FF9505]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Are You a Content Creator?
          </h2>
          <p className="text-lg text-white opacity-90 mb-8">
            Join our community of professional creators and start earning doing what you love
          </p>
          <button className="px-8 py-4 bg-white text-[#CC5803] rounded-lg font-semibold transition-all hover:bg-orange-50 inline-flex items-center">
            Become a Creator
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10K+", label: "Active Creators" },
              { number: "50K+", label: "Satisfied Clients" },
              { number: "100K+", label: "Projects Completed" },
              { number: "4.8/5", label: "Average Rating" }
            ].map((stat, index) => (
              <div key={index}>
                <p className="text-3xl font-bold text-[#CC5803] mb-2">{stat.number}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ModerFooter/>
    </div>
  );
};

export default LandingPage;
