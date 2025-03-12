import { useEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css";
import Quill from "quill";
import ModernNavbar from "../../components/ModernNavbar";
import ReactMarkdown from "react-markdown";


const links = {
    business: {
      jobs: "/business/dashboard/jobs",
      posts: "/business/dashboard/post",
      requests: "/business/dashboard/requests",
      ongoing: "/business/dashboard/ongoing",
    },
    creator: {
      jobs: "/creator/dashboard/jobs",
      posts: "/creator/dashboard/post",
      requests: "/creator/dashboard/requests",
      ongoing: "/creator/dashboard/ongoing",
    },
  };

const CreatorDashboard2 = () => {
  const editorRef = useRef(null);
  const chatInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [content, setContent] = useState("");
  const [improvedContent, setImprovedContent] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFixingText, setIsFixingText] = useState(false);
  const [quillInstance, setQuillInstance] = useState(null);



  const userType = localStorage.getItem("role")

  const userLinks = (userType === "creator" ? links.creator : links.business);



  
  // Gemini API key - replace with env variable in production
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedChats = localStorage.getItem("creatorchats");
    if (savedChats) {
      setChatMessages(JSON.parse(savedChats));
    }
  }, []);

  // Save chats to localStorage whenever chatMessages changes
  useEffect(() => {
    localStorage.setItem("creatorchats", JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Initialize Quill editor
  useEffect(() => {
    if (!editorRef.current) return;

    // Remove any existing editor instance first
    while (editorRef.current.firstChild) {
      editorRef.current.removeChild(editorRef.current.firstChild);
    }

    const quill = new Quill(editorRef.current, {
      theme: "snow",
      placeholder: "Start writing your content here...",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ color: [] }, { background: [] }],
          ["link", "image"],
          ["clean"],
        ],
      },
    });

    setQuillInstance(quill);

    // Event listener for text changes
    quill.on("text-change", () => {
      setContent(quill.root.innerHTML);
      // Reset improved content when editor content changes
      setImprovedContent("");
    });

    return () => {
      // Cleanup
    };
  }, []);

  // Auto-scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;
  
    // Add user message to chat in the correct format
    const newUserMessage = { role: "user", parts: [{ text: userInput }] };
    setChatMessages((prev) => [...prev, newUserMessage]);
    setUserInput("");
    setIsLoading(true);
  
    try {
      // Use chatMessages directly as they're already in the correct format
      const history = [...chatMessages]; // Create a copy to avoid mutations
      
      // Add the new message to history
      history.push(newUserMessage);
  
      // Make the API request with properly formatted content
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: history
        })
      });
  
      const data = await response.json();
      
      // Extract response text from the API response
      let botResponseText = '';
      if (data && data.candidates && data.candidates[0] && 
          data.candidates[0].content && data.candidates[0].content.parts) {
        botResponseText = data.candidates[0].content.parts[0].text;
      } else {
        botResponseText = "Sorry, I couldn't generate a response at this time.";
      }
      
      // Add model response to chat in the correct format
      const modelResponse = { role: "model", parts: [{ text: botResponseText }] };
      setChatMessages((prev) => [...prev, modelResponse]);
    } catch (error) {
      console.error("Error sending message to Gemini API:", error);
      // Add error message in the correct format
      setChatMessages((prev) => [
        ...prev,
        { role: "model", parts: [{ text: "Sorry, I encountered an error. Please try again." }] }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fix text in editor using Gemini API
  const fixEditorContent = async () => {
    if (!content) return;
    
    setIsFixingText(true);
    setIsLoading(true);
    
    try {
      // Actual Gemini API integration for fixing text using the format provided
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `Fix all grammatical mistakes and improve the overall clarity of the following text and respond with nothing else in the form of plain text : ${content}` }]
            }
          ]
        })
      });

      const data = await response.json();
      
      // Extract response text from the API response
      if (data && data.candidates && data.candidates[0] && 
          data.candidates[0].content && data.candidates[0].content.parts) {
        const fixedContent = data.candidates[0].content.parts[0].text;
        setImprovedContent(fixedContent);
      } else {
        setImprovedContent("Sorry, I couldn't process your text at this time.");
      }
    } catch (error) {
      console.error("Error fixing content with Gemini API:", error);
      setImprovedContent("Sorry, I encountered an error while fixing your text. Please try again.");
    } finally {
      setIsFixingText(false);
      setIsLoading(false);
    }
  };

  // Function to apply the improved content to the editor
  const applyImprovedContent = () => {
    if (!improvedContent || !quillInstance) return;
    
    // Update the Quill editor content
    quillInstance.root.innerHTML = improvedContent;
    setContent(improvedContent);
  };

  return (
    <div className="min-h-screen bg-[#081A42] z- relative">
      <ModernNavbar {...userLinks} />
      
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">Creator Dashboard</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left side - Quill Editor */}
          <div className="md:w-1/2 bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Content Editor</h2>
            <div className="bg-white border border-gray-200 rounded-md">
              <div ref={editorRef} className="min-h-[300px]" />
            </div>
            
            <div className="mt-4 flex space-x-4">
              <button
                onClick={fixEditorContent}
                disabled={isLoading || !content}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center disabled:bg-purple-300"
              >
                {isFixingText ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Fixing...
                  </>
                ) : (
                  <>Fix with AI</>
                )}
              </button>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Preview:</h3>
              <div className="p-4 border border-gray-200 rounded-md bg-gray-50 min-h-[100px] prose max-w-none">
                {improvedContent ? (
                  <>
                    <div className="whitespace-pre-wrap">{improvedContent}</div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={applyImprovedContent}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                      >
                        Apply Changes
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500 italic">
                    {content ? "Use 'Fix with AI' to get improved content" : "No content to preview"}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right side - Ideation Chatbot */}
          <div className="md:w-1/2 bg-white rounded-lg shadow-lg p-4 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Ideation Assistant</h2>
            
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto mb-4 space-y-4 min-h-[400px] max-h-[600px] p-4 border border-gray-200 rounded-md bg-gray-50"
            >
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>No messages yet. Start a conversation with the ideation assistant!</p>
                </div>
              ) : (
                chatMessages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg max-w-[80%] ${
                      msg.role === "user" 
                        ? "ml-auto bg-blue-500 text-white" 
                        : "mr-auto bg-white border border-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="whitespace-pre-wrap"><ReactMarkdown>{msg.parts[0]?.text}</ReactMarkdown></p>
                  </div>
                ))
              )}
              
              {isLoading && !isFixingText && (
                <div className="mr-auto bg-white border border-gray-200 text-gray-800 p-3 rounded-lg flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              )}
            </div>
            
            <div className="flex">
              <input
                ref={chatInputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask anything for content ideas..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !userInput.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard2;