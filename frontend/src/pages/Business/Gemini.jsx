import React, { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import axios from "axios";

// API utility function
const fetchGeminiResponse = async (prompt, apiKey) => {
  if (!apiKey) throw new Error("API key is not configured");
  if (!prompt.trim()) throw new Error("Prompt cannot be empty");

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        params: { key: apiKey },
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

// Form field configuration for easy maintenance
const FORM_FIELDS = [
  { id: "businessName", label: "Business Name", type: "text", required: true },
  { id: "industry", label: "Industry", type: "text", required: true },
  {
    id: "targetAudience",
    label: "Target Audience",
    type: "text",
    required: true,
  },
  {
    id: "currentRevenue",
    label: "Current Monthly Revenue",
    type: "number",
    required: true,
  },
  {
    id: "marketingBudget",
    label: "Monthly Marketing Budget",
    type: "number",
    required: true,
  },
  { id: "goals", label: "Business Goals", type: "textarea", required: true },
  {
    id: "competitors",
    label: "Main Competitors",
    type: "text",
    required: true,
  },
  {
    id: "currentMarketing",
    label: "Current Marketing Channels",
    type: "textarea",
    required: true,
  },
  {
    id: "uniqueValue",
    label: "Unique Value Proposition",
    type: "textarea",
    required: true,
  },
];

const cleanAndParseJSON = (response) => {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("No valid JSON object found in the response");
    }
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    throw new Error("Invalid JSON response from API");
  }
};
const MarketingAdvisor = () => {
  const [formData, setFormData] = useState({});
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const generatePrompt = (data) => {
    return `As an expert marketing strategist, analyze the following business details and provide a comprehensive marketing strategy. Please provide the response in JSON format with the following structure: {
      "summary": "Brief overview of the business situation",
      "targetMarketAnalysis": {
        "primaryAudience": "",
        "audienceNeeds": [],
        "reachStrategy": ""
      },
      "recommendedChannels": [
        {
          "channel": "",
          "reason": "",
          "estimatedROI": "",
          "implementationSteps": []
        }
      ],
      "budgetAllocation": {
        "channel": "amount"
      },
      "timeline": {
        "phase1": "",
        "phase2": "",
        "phase3": ""
      },
      "kpis": [],
      "additionalRecommendations": []
    }

    Business Details:
    - Business Name: ${data.businessName}
    - Industry: ${data.industry}
    - Target Audience: ${data.targetAudience}
    - Current Monthly Revenue: ${data.currentRevenue}
    - Marketing Budget: ${data.marketingBudget}
    - Business Goals: ${data.goals}
    - Main Competitors: ${data.competitors}
    - Current Marketing Channels: ${data.currentMarketing}
    - Unique Value Proposition: ${data.uniqueValue}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const prompt = generatePrompt(formData);
      const generatedText = await fetchGeminiResponse(prompt, apiKey);
      const cleanedResponse = cleanAndParseJSON(generatedText);
      setResponse(cleanedResponse);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderResponse = (data) => {
    if (!data) return null;

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Strategy Summary</h3>
          <p className="text-gray-700">{data.summary}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Target Market Analysis</h3>
          <div className="space-y-4">
            <p>
              <span className="font-medium">Primary Audience:</span>{" "}
              {data.targetMarketAnalysis.primaryAudience}
            </p>
            <div>
              <p className="font-medium mb-2">Audience Needs:</p>
              <ul className="list-disc pl-5">
                {data.targetMarketAnalysis.audienceNeeds.map((need, i) => (
                  <li key={i} className="text-gray-700">
                    {need}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">
            Recommended Marketing Channels
          </h3>
          <div className="space-y-6">
            {data.recommendedChannels.map((channel, i) => (
              <div key={i} className="border-b pb-4 last:border-b-0 last:pb-0">
                <h4 className="font-medium text-lg mb-2">{channel.channel}</h4>
                <p className="text-gray-700 mb-2">{channel.reason}</p>
                <p className="text-gray-600 mb-2">
                  Estimated ROI: {channel.estimatedROI}
                </p>
                <div>
                  <p className="font-medium mb-1">Implementation Steps:</p>
                  <ol className="list-decimal pl-5">
                    {channel.implementationSteps.map((step, j) => (
                      <li key={j} className="text-gray-700">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Budget Allocation</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(data.budgetAllocation).map(([channel, amount]) => (
              <div key={channel} className="flex justify-between items-center">
                <span className="font-medium">{channel}:</span>
                <span className="text-gray-700">${amount}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">
            Implementation Timeline
          </h3>
          <div className="space-y-4">
            {Object.entries(data.timeline).map(([phase, description]) => (
              <div key={phase} className="flex gap-4">
                <span className="font-medium min-w-[100px] capitalize">
                  {phase}:
                </span>
                <span className="text-gray-700">{description}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">
            Key Performance Indicators
          </h3>
          <ul className="list-disc pl-5 space-y-2">
            {data.kpis.map((kpi, i) => (
              <li key={i} className="text-gray-700">
                {kpi}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 shadow-[0_0_20px_5px_rgba(0,166,251,0.5)]">
      <div className="text-center mb-8 ">
        <h1 className="text-2xl font-bold mb-6 text-[#00A6FB]">Marketing Strategy Advisor</h1>
        <p className="text-gray-600">
          Get personalized marketing strategies for your business
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start ">
        <div>
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md space-y-6 sticky top-6 shadow-[0_0_20px_5px_rgba(0,166,251,0.5)]">
            {FORM_FIELDS.map((field) => (
              <div key={field.id}>
                <label
                  htmlFor={field.id}
                  className="block text-sm font-medium text-gray-700 mb-1 ">
                  {field.label}{" "}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    id={field.id}
                    required={field.required}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] "
                    onChange={handleInputChange}
                    value={formData[field.id] || ""}
                  />
                ) : (
                  <input
                    type={field.type}
                    id={field.id}
                    required={field.required}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent "
                    onChange={handleInputChange}
                    value={formData[field.id] || ""}
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 ">
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Generating Strategy...
                </>
              ) : (
                "Generate Marketing Strategy"
              )}
            </button>
          </form>
        </div>

        <div className="h-screen sticky top-6 overflow-hidden">
          <div className="h-full overflow-y-auto pr-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3 mb-6 ">
                <AlertCircle className="text-red-500 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {response && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start gap-3 mb-6 ">
                <CheckCircle2 className="text-green-500 flex-shrink-0" />
                <p className="text-green-700">
                  Strategy generated successfully!
                </p>
              </div>
            )}

            {renderResponse(response)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingAdvisor;
