import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import ReactMarkdown from "react-markdown";
import { 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  BadgeInfo, 
  ArrowRight, 
  Target, 
  DollarSign, 
  Users, 
  BarChart, 
  TrendingUp
} from "lucide-react";
import axios from "axios";

// API utility function
const fetchGeminiResponse = async (prompt) => {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) throw new Error("API key is not configured");
  if (!prompt.trim()) throw new Error("Prompt cannot be empty");

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        params: { key: GEMINI_API_KEY },
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Invalid response format");
    }

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `API Error: ${
          error.response.data.error?.message || "Unknown API error"
        }`
      );
    }
    throw error;
  }
};

// Form field configuration
const FORM_FIELDS = [
  { 
    id: "businessName", 
    label: "Business Name", 
    type: "text", 
    required: true,
    icon: <BadgeInfo size={18} />,
    placeholder: "e.g., Acme Solutions"
  },
  { 
    id: "industry", 
    label: "Industry", 
    type: "text", 
    required: true,
    icon: <BarChart size={18} />,
    placeholder: "e.g., Software, E-commerce, Healthcare" 
  },
  {
    id: "targetAudience",
    label: "Target Audience",
    type: "text",
    required: true,
    icon: <Target size={18} />,
    placeholder: "e.g., Small business owners, Millennials, Parents"
  },
  {
    id: "currentRevenue",
    label: "Current Monthly Revenue",
    type: "number",
    required: true,
    icon: <DollarSign size={18} />,
    placeholder: "e.g., 5000"
  },
  {
    id: "marketingBudget",
    label: "Monthly Marketing Budget",
    type: "number",
    required: true,
    icon: <DollarSign size={18} />,
    placeholder: "e.g., 1000"
  },
  { 
    id: "goals", 
    label: "Business Goals", 
    type: "textarea", 
    required: true,
    icon: <TrendingUp size={18} />,
    placeholder: "e.g., Increase customer base by 20%, Expand to new markets"
  },
  {
    id: "competitors",
    label: "Main Competitors",
    type: "text",
    required: true,
    icon: <Users size={18} />,
    placeholder: "e.g., CompanyA, CompanyB, CompanyC"
  },
  {
    id: "currentMarketing",
    label: "Current Marketing Channels",
    type: "textarea",
    required: true,
    icon: <ArrowRight size={18} />,
    placeholder: "e.g., Social media, Email newsletters, SEO"
  },
  {
    id: "uniqueValue",
    label: "Unique Value Proposition",
    type: "textarea",
    required: true,
    icon: <BadgeInfo size={18} />,
    placeholder: "What makes your business stand out from competitors?"
  },
  {
    id: "challenges",
    label: "Current Marketing Challenges",
    type: "textarea",
    required: false,
    icon: <AlertCircle size={18} />,
    placeholder: "e.g., Low conversion rates, Limited brand recognition"
  },
  {
    id: "pastSuccesses",
    label: "Past Marketing Successes",
    type: "textarea",
    required: false,
    icon: <CheckCircle2 size={18} />,
    placeholder: "What marketing initiatives have worked well for you?"
  }
];

// Define FormField component outside MarketingStrategy
const FormField = memo(({ field, value, onChange }) => {
  return (
    <div className="mb-6">
      <label
        htmlFor={field.id}
        className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
      >
        <span className="text-blue-500">{field.icon}</span>
        {field.label} {field.required && <span className="text-red-500">*</span>}
      </label>
      
      {field.type === "textarea" ? (
        <textarea
          id={field.id}
          required={field.required}
          placeholder={field.placeholder}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] resize-y"
          onChange={onChange}
          value={value || ""}
        />
      ) : (
        <input
          type={field.type}
          id={field.id}
          required={field.required}
          placeholder={field.placeholder}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onChange={onChange}
          value={value || ""}
        />
      )}
    </div>
  );
});

const MarketingStrategy = () => {
  const initialFormData = FORM_FIELDS.reduce((acc, field) => {
    acc[field.id] = "";
    return acc;
  }, {});
  
  const [formData, setFormData] = useState(initialFormData);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const resultRef = useRef(null);

  const handleInputChange = useCallback((e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  }, []);

  const generatePrompt = (data) => {
    return `As an expert marketing strategist, analyze the following business details and provide a comprehensive marketing strategy. Format your response in Markdown, with clear headings, bullet points, and sections to make it easy to read and implement.

    Business Details:
    - Business Name: ${data.businessName || "N/A"}
    - Industry: ${data.industry || "N/A"}
    - Target Audience: ${data.targetAudience || "N/A"}
    - Current Monthly Revenue: $${data.currentRevenue || "N/A"}
    - Marketing Budget: $${data.marketingBudget || "N/A"}
    - Business Goals: ${data.goals || "N/A"}
    - Main Competitors: ${data.competitors || "N/A"}
    - Current Marketing Channels: ${data.currentMarketing || "N/A"}
    - Unique Value Proposition: ${data.uniqueValue || "N/A"}
    ${data.challenges ? `- Current Marketing Challenges: ${data.challenges}` : ""}
    ${data.pastSuccesses ? `- Past Marketing Successes: ${data.pastSuccesses}` : ""}

    Please provide a comprehensive marketing strategy that includes:
    
    1. Executive Summary - A brief overview of the current situation and strategy approach
    2. Target Market Analysis - Detailed breakdown of the target audience, their needs, and how to reach them
    3. Recommended Marketing Channels - Prioritized list of channels with specific reasoning, potential ROI, and implementation steps
    4. Budget Allocation - How to distribute the marketing budget across channels
    5. Content Strategy - Types of content to create and topics to focus on
    6. Implementation Timeline - 30, 60, and 90-day action plan
    7. Key Performance Indicators - Metrics to track success
    8. Competitive Positioning - How to stand out from competitors
    9. Additional Recommendations - Any other strategic advice

    Be specific, practical, and actionable. Provide examples where helpful.`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const prompt = generatePrompt(formData);
      const generatedText = await fetchGeminiResponse(prompt);
      setResponse(generatedText);
      
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Loading bubbles animation
  const LoadingBubbles = () => (
    <div className="flex justify-center items-center gap-2 py-8">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Marketing Strategy Generator
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Fill in your business details below to receive a personalized, comprehensive marketing strategy powered by AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="bg-white p-0 rounded-xl shadow-lg h-full max-h-[800px] overflow-hidden flex flex-col">
            <div className="sticky top-0 bg-white p-8 pb-4 z-20 ">
              <h2 className="text-2xl font-semibold text-gray-800">Business Information</h2>
            </div>
            
            <div className="overflow-y-auto p-8 pt-4 flex-1">
              <form onSubmit={handleSubmit} className="space-y-4">
                {FORM_FIELDS.map((field) => (
                  <FormField 
                    key={field.id} 
                    field={field} 
                    value={formData[field.id]} 
                    onChange={handleInputChange} 
                  />
                ))}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-8 bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium text-lg shadow-md"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Generating Your Strategy...
                    </>
                  ) : (
                    "Generate Marketing Strategy"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div ref={resultRef} className="relative">
          <div className="bg-white p-0 rounded-xl shadow-lg h-[800px] overflow-hidden flex flex-col">
            <div className="sticky top-0 bg-white p-8 pb-4 z-20 ">
              <h2 className="text-2xl font-semibold text-gray-800">Your Marketing Strategy</h2>
            </div>
            
            <div className="overflow-y-auto p-8 pt-4 flex-1">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-6">
                  <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {loading && (
                <div className="text-center py-12">
                  <div className="mb-6">
                    <LoadingBubbles />
                  </div>
                  <p className="text-gray-600 italic">
                    Analyzing your business and crafting a personalized marketing strategy...
                  </p>
                </div>
              )}

              {response && !loading && (
                <div className="prose prose-blue max-w-none">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 mb-6">
                    <CheckCircle2 className="text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-green-700 m-0">
                      Strategy generated successfully! Review the detailed plan below.
                    </p>
                  </div>
                  
                  <div className="markdown-content">
                    <ReactMarkdown>{response}</ReactMarkdown>
                  </div>
                </div>
              )}

              {!response && !loading && !error && (
                <div className="text-center py-12 text-gray-500">
                  <svg
                    className="mx-auto h-24 w-24 text-gray-300 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <p className="text-lg">
                    Fill out the form to generate your marketing strategy
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingStrategy;