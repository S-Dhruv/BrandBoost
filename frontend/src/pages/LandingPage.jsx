import React from "react";
import ModernNavbar from '../components/ModernNavbar';
import { ArrowRight, Star, Award, Rocket, Clock, Shield, Search } from 'lucide-react';
import ModerFooter from '../components/ModernFooter';
import ServiceCard from '../components/ServiceCard';
import WaveAnimation from "../components/WaveAnimation";

const LandingPage = () => {
  
  return (
    <div className="min-h-screen bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CiAgPGZpbHRlciBpZD0ibm9pc2UiPgogICAgPGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNzUiIG51bU9jdGF2ZXM9IjIiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz4KICA8L2ZpbHRlcj4KICA8cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] bg-repeat">
      <ModernNavbar />
      
      {/* Hero Section */}
      <div className="pt-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Find the Perfect
                <span className="bg-gradient-to-r from-[#00A6FB] to-[#0582CA] bg-clip-text text-transparent">
                  {" "}Content Creator
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Connect with top-tier content creators for your brand. Quality content, delivered on time, every time.
              </p>

              <div className="flex items-center gap-8">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-[#0582CA] mr-2" />
                  <span className="text-gray-600">4.8/5 average rating</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-[#00A6FB] mr-2" />
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
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Rocket className="h-6 w-6 text-[#0582CA]" />
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
        


          <div className="pt-24 bg-gradient-to-b from-blue-50 to-white relative"> {/* Added relative */}
  {/* Rest of your content */}
  <div style={{ position: 'relative', zIndex: 9999 }}>
    <WaveAnimation />
  </div>
</div>

    
      </div>

      {/* services we offer */}
      <section id="services" className="py-20 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate__animated animate__fadeIn">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0582CA] mb-4">Our Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with expert creators who can elevate your brand through various content services
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ServiceCard
            title="Content Writing"
            description="Professional writers create engaging content for your blogs, websites, and marketing materials."
            features={["Blog Posts", "Website Copy", "Marketing Content"]}
            icon={
              <svg className="w-8 h-8 text-[#0582CA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                ></path>
              </svg>
            }
          />
          <ServiceCard
            title="Website Redesign"
            description="Transform your website with modern designs that engage and convert visitors."
            features={["UI/UX Design", "Responsive Layout", "Performance Optimization"]}
            icon={
              <svg class="w-8 h-8 text-[#0582CA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
            </svg>
            }
          />
          <ServiceCard
            title="Translation Services"
            description="Reach global audiences with accurate and culturally-adapted translations."
            features={["Multiple Languages", "Cultural Adaptation", "Technical Translation"]}
            icon={
              <svg class="w-8 h-8 text-[#0582CA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
            </svg>
            }
          />
          <ServiceCard
            title="Editing Services"
            description="Enhance your content with professional editing that ensures clarity, coherence, and polished quality."
            features={["Grammar and Style Refinement", "Clarity and Structure Improvement", "Proofreading for Accuracy"]}
            
            icon={
              <svg class="w-8 h-8 text-[#0582CA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.121 4.879l5 5a2 2 0 010 2.828l-8 8a2 2 0 01-1.732.513l-4-1a2 2 0 01-1.133-1.133l-1-4a2 2 0 01.513-1.732l8-8a2 2 0 012.828 0zM16 6l2 2m-2-2l-2 2"/>
</svg>

            }
          />



 <ServiceCard
      title = "SEO Optimization"
      description ="Improve your search engine rankings with data-driven SEO strategies."
      features= {["Keyword Research", "On-Page SEO", "Link Building"]}
      icon= {<svg className="w-8 h-8 text-[#0582CA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>}
      />

<ServiceCard
  title="Email Marketing"
  description="Create and manage effective email campaigns that drive results."
  features={["Campaign Strategy", "Template Design", "Performance Tracking"]}
  icon={
    <svg className="w-8 h-8 text-[#0582CA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  }
/>







        </div>
      </div>
    </section>





    {/*Our Expert Creators*/}
    <section id="creators" class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="text-center mb-16 animate__animated animate__fadeIn">
        <h2 class="text-3xl md:text-4xl font-bold text-[#00A6FB] mb-4">Our Expert Creators</h2>
        <p class="text-gray-600 max-w-2xl mx-auto">Join our network of talented professionals or find the perfect creator for your project</p>
      </div>

      <div class="grid md:grid-cols-2 gap-12 items-stretch">
        
        <div class="space-y-10 animate__animated animate__fadeInLeft">
          <div class="bg-gray-100 rounded-lg p-6 transform hover:-translate-y-1 transition-transform duration-300">
            <div class="flex items-center gap-4">
              <div class="bg-gradient-to-br from-[#00A6FB] to-[#0582CA] rounded-full w-16 h-16 flex items-center justify-center text-white text-xl font-bold">
                CW
              </div>
              <div>
                <h3 class="text-xl font-semibold text-[#00A6FB]">Content Writers</h3>
                <p class="text-[#051923]">Expert writers for all your content needs</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-100 rounded-lg p-6 transform hover:-translate-y-1 transition-transform duration-300">
            <div class="flex items-center gap-4">
              <div class="bg-gradient-to-br from-[#0582CA] to-[#006494] rounded-full w-16 h-16 flex items-center justify-center text-white text-xl font-bold">
                WD
              </div>
              <div>
                <h3 class="text-xl font-semibold text-[#0582CA]">Web Designers</h3>
                <p class="text-[#051923]">Creative designers for stunning websites</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-100 rounded-lg p-6 transform hover:-translate-y-1 transition-transform duration-300">
            <div class="flex items-center gap-4">
              <div class="bg-gradient-to-br from-[#006494] to-[#00A6FB] rounded-full w-16 h-16 flex items-center justify-center text-white text-xl font-bold">
                TR
              </div>
              <div>
                <h3 class="text-xl font-semibold text-[#006494]">Translators</h3>
                <p class="text-[#051923]">Professional multilingual translators</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-100 rounded-lg p-6 transform hover:-translate-y-1 transition-transform duration-300">
            <div class="flex items-center gap-4">
              <div class="bg-gradient-to-br from-[#00A6FB] to-[#0582CA] rounded-full w-16 h-16 flex items-center justify-center text-white text-xl font-bold">
                ED
              </div>
              <div>
                <h3 class="text-xl font-semibold text-[#00A6FB]">Editors</h3>
                <p class="text-[#051923]">Talented editors for all forms of content</p>
              </div>
            </div>
          </div>
        </div>

        
        <div class="bg-gray-100 bg-opacity-5 rounded-xl p-12 animate__animated animate__fadeInRight h-full">
  <div class="space-y-8">
    <h3 class="text-2xl font-bold text-[#0582CA] mb-16">
      Why Join Our Network?
    </h3>
    
    <div class="flex items-center gap-4">
      <div class="bg-[#00A6FB]/10 rounded-full p-3">
        <svg class="w-10 h-10 text-[#00A6FB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <h4 class="font-semibold text-[#00A6FB]">Competitive Rates</h4>
        <p class="text-[#051923]">Fair compensation for your expertise</p>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <div class="bg-[#0582CA]/10 rounded-full p-3">
        <svg class="w-10 h-10 text-[#0582CA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
      <div>
        <h4 class="font-semibold text-[#0582CA]">Verified Projects</h4>
        <p class="text-[#051923]">Work with legitimate clients</p>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <div class="bg-[#006494]/10 rounded-full p-3">
        <svg class="w-10 h-10 text-[#006494]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      </div>
      <div>
        <h4 class="font-semibold text-[#006494]">Growth Opportunities</h4>
        <p class="text-[#051923]">Expand your professional network</p>
      </div>
    </div>

    <button class="w-full bg-[#0582CA] text-white py-3 rounded-full font-semibold hover:bg-[#00A6FB] transition-colors duration-300 mt-8">
      Join as Creator
    </button>
  </div>
</div>
</div>
</div>
  </section>






      
      {/* How It Works */}
      <div className="bg-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="h-8 w-8 text-[#00A6FB]" />,
                title: "1. Find Your Creator",
                description: "Browse profiles and reviews to find the perfect match for your content needs"
              },
              {
                icon: <Clock className="h-8 w-8 text-[#0582CA]" />,
                title: "2. Place Your Order",
                description: "Discuss requirements and timeline with your chosen creator"
              },
              {
                icon: <Shield className="h-8 w-8 text-[#006494]" />,
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
      <div className="py-20 bg-gradient-to-r from-[#003554] to-[#006494]">
        
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 inline-flex ml-25">
          <h2 className="text-3xl font-bold text-white mb-6 ">
            Are You a Content Creator?                    
          </h2>
          <h2 className="text-3xl font-bold text-white mb-6 ml-auto mr-40">
          Are you a Business looking for content?                   
          </h2>
          </div>

          
          <div className="flex max-w mx-auto px-4 sm:px-6 lg:px-8 text-center">


          <p className="text-lg text-white opacity-90 mb-8">
            Join our community of professional creators and start earning doing what you love
          </p>
          <p className="text-lg text-white opacity-90 mb-8 ml-auto mr-10">
            Leverage our community of professional creators to make quality content
          </p>
          </div>

            <div className="flex max-w mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <button className="px-8 py-4 ml-40 bg-white text-[#006494] rounded-lg font-semibold transition-all hover:bg-blue-50 flex items-center">
            Become a Creator
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
          <button className="px-8 py-4 ml-auto mr-50 bg-white text-[#006494] rounded-lg font-semibold transition-all hover:bg-blue-50 flex ">
            Join as a Business
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
                <p className="text-3xl font-bold text-[#00A6FB] mb-2">{stat.number}</p>
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