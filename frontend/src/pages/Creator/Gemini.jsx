import React, { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import axios from "axios";

// API utility function with improved error handling
const fetchGeminiResponse = async (prompt, apiKey) => {
  if (!apiKey) throw new Error("API key is not configured");
  if (!prompt.trim()) throw new Error("Prompt cannot be empty");

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        params: { key: apiKey },
        headers: { 
          "Content-Type": "application/json"
        },
        // Use axios default certificate handling
        validateStatus: status => status < 500
      }
    );

    // Check for specific error status codes
    if (response.status === 401) {
      throw new Error('Invalid API key. Please check your Gemini API key configuration.');
    }
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    if (response.status !== 200) {
      throw new Error(`API Error: ${response.data.error?.message || "Unknown API error"}`);
    }

    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Invalid response format from Gemini API");
    }

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    if (error.message.includes('CERTIFICATE_VERIFY_FAILED')) {
      throw new Error('SSL Certificate validation failed. Please check your network connection or try a different network.');
    }
    throw error;
  }
};

// Rest of the component remains the same
const FORM_FIELDS = [
  { 
    id: "jobRole", 
    label: "Job Role", 
    type: "text", 
    required: true,
    placeholder: "e.g., Marketing Manager, Content Strategist",
    validate: (value) => value.length < 3 ? "Job role must be at least 3 characters" : null
  },
  {
    id: "jobDescription",
    label: "Job Description",
    type: "textarea",
    required: true,
    placeholder: "Describe your current role and responsibilities",
    validate: (value) => value.length < 50 ? "Please provide a detailed job description (at least 50 characters)" : null
  },
  {
    id: "whathelpdoyouneed",
    label: "What help do you need",
    type: "textarea",
    required: true,
    placeholder: "Specify the areas where you'd like to improve",
    validate: (value) => value.length < 30 ? "Please provide more details about the help you need (at least 30 characters)" : null
  },
];

const cleanAndParseJSON = (response) => {
  try {
    // First try to parse the entire response as JSON
    try {
      return JSON.parse(response);
    } catch {
      // If that fails, try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
    throw new Error("No valid JSON object found in the response");
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    throw new Error("Invalid response format from API. Please try again.");
  }
};

const MarketingAdvisor = () => {
  const [formData, setFormData] = useState(
    FORM_FIELDS.reduce((acc, field) => {
      acc[field.id] = "";
      return acc;
    }, {})
  );
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[id]) {
      setValidationErrors((prev) => ({ ...prev, [id]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    FORM_FIELDS.forEach(field => {
      if (field.required && !formData[field.id].trim()) {
        errors[field.id] = `${field.label} is required`;
      } else if (field.validate) {
        const error = field.validate(formData[field.id]);
        if (error) errors[field.id] = error;
      }
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generatePrompt = (data) => {
    return `As an expert career advisor, analyze the following details about the user's job role and provide actionable advice to help them improve. Please provide the response in JSON format with the following structure: {
      "summary": "Brief overview of the user's job role and goals",
      "strengths": [],
      "areasForImprovement": [],
      "actionableSteps": [],
      "recommendedResources": []
    }

    User Details:
    - Job Role: ${data.jobRole}
    - Job Description: ${data.jobDescription}
    - Requested Help: ${data.whathelpdoyouneed}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Please configure your Gemini API key in the environment variables");
      }
      
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

    const sections = [
      { title: "Summary", content: data.summary, type: "text" },
      { title: "Strengths", content: data.strengths, type: "list" },
      { title: "Areas for Improvement", content: data.areasForImprovement, type: "list" },
      { title: "Actionable Steps", content: data.actionableSteps, type: "numbered" },
      { title: "Recommended Resources", content: data.recommendedResources, type: "list" }
    ];

    return (
      <div className="space-y-6">
        {sections.map((section, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
            {section.type === "text" ? (
              <p className="text-gray-700">{section.content}</p>
            ) : section.type === "numbered" ? (
              <ol className="list-decimal pl-5">
                {section.content.map((item, i) => (
                  <li key={i} className="text-gray-700 mb-2">{item}</li>
                ))}
              </ol>
            ) : (
              <ul className="list-disc pl-5">
                {section.content.map((item, i) => (
                  <li key={i} className="text-gray-700 mb-2">{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Career Improvement Advisor</h1>
        <p className="text-gray-600">
          Get personalized advice to improve your skills and excel in your job role
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6 sticky top-6">
            {FORM_FIELDS.map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    id={field.id}
                    required={field.required}
                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] ${
                      validationErrors[field.id] ? 'border-red-500' : ''
                    }`}
                    onChange={handleInputChange}
                    value={formData[field.id]}
                    placeholder={field.placeholder}
                  />
                ) : (
                  <input
                    type={field.type}
                    id={field.id}
                    required={field.required}
                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      validationErrors[field.id] ? 'border-red-500' : ''
                    }`}
                    onChange={handleInputChange}
                    value={formData[field.id]}
                    placeholder={field.placeholder}
                  />
                )}
                {validationErrors[field.id] && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors[field.id]}</p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Generating Advice...
                </>
              ) : (
                "Generate Advice"
              )}
            </button>
          </form>
        </div>

        <div className="overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3 mb-6">
              <AlertCircle className="text-red-500 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {response && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start gap-3 mb-6">
              <CheckCircle2 className="text-green-500 flex-shrink-0" />
              <p className="text-green-700">Advice generated successfully!</p>
            </div>
          )}

          {renderResponse(response)}
        </div>
      </div>
    </div>
  );
};

export default MarketingAdvisor;