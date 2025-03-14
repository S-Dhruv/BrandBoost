import { useEffect, useRef, useState } from "react";
import ModernNavbar from "../../components/ModernNavbar";
import Editor from "../../components/Editor"; // Import your custom Editor component
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

  const userType = localStorage.getItem("role");
  const userLinks = userType === "creator" ? links.creator : links.business;

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
      const history = [...chatMessages];
      history.push(newUserMessage);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: history,
          }),
        }
      );

      const data = await response.json();

      let botResponseText = "";
      if (
        data &&
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts
      ) {
        botResponseText = data.candidates[0].content.parts[0].text;
      } else {
        botResponseText = "Sorry, I couldn't generate a response at this time.";
      }

      const modelResponse = { role: "model", parts: [{ text: botResponseText }] };
      setChatMessages((prev) => [...prev, modelResponse]);
    } catch (error) {
      console.error("Error sending message to Gemini API:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: "Sorry, I encountered an error. Please try again." }],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const fixEditorContent = async () => {
    if (!content) return;

    setIsFixingText(true);
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Fix all grammatical mistakes and improve the overall clarity of the following text and respond with nothing else in the form of plain text : ${content}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (
        data &&
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts
      ) {
        const fixedContent = data.candidates[0].content.parts[0].text;
        setImprovedContent(fixedContent);
      } else {
        setImprovedContent("Sorry, I couldn't process your text at this time.");
      }
    } catch (error) {
      console.error("Error fixing content with Gemini API:", error);
      setImprovedContent(
        "Sorry, I encountered an error while fixing your text. Please try again."
      );
    } finally {
      setIsFixingText(false);
      setIsLoading(false);
    }
  };

  const applyImprovedContent = () => {
    if (!improvedContent || !editorRef.current) return;

    // Assuming the Editor component has a setText method
    editorRef.current.setText(improvedContent);
    setContent(improvedContent);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#081A42]">
  <ModernNavbar {...userLinks} />
  {/* Main content with fixed height and no scrolling */}
  <div className="w-full max-w-[98%] mx-auto flex-1 flex flex-col pt-20 pb-8 overflow-hidden">
    <h1 className="text-3xl font-bold text-center mb-6 text-white">Creator Dashboard</h1>
    <div className="flex flex-col md:flex-row gap-4 flex-1 overflow-hidden">
      {/* Content Editor Section */}
      <div className="md:w-4/6 w-full bg-white rounded-lg shadow-lg p-4 flex flex-col overflow-hidden">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 flex-shrink-0">Content Editor</h2>
        {/* Editor container - only this should scroll */}
        <div className="flex-1 flex flex-col border border-gray-200 rounded-md overflow-hidden min-h-0">
          <div className="flex-1 overflow-auto">
            <Editor
              ref={editorRef}
              placeholder="Start writing your content here..."
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 flex-shrink-0">
          <button
            onClick={fixEditorContent}
            disabled={isLoading || !content}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center disabled:bg-purple-300"
          >
            {isFixingText ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Fixing...
              </>
            ) : (
              <>Fix with AI</>
            )}
          </button>
        </div>
        <div className="mt-4 flex-shrink-0">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Preview:</h3>
          <div className="p-4 border border-gray-200 rounded-md bg-gray-50 max-h-48 overflow-auto">
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
      
      {/* Ideation Assistant Section */}
      <div className="md:w-2/6 w-full bg-white rounded-lg shadow-lg p-4 flex flex-col overflow-hidden mt-4 md:mt-0">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 flex-shrink-0">Ideation Assistant</h2>
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 border border-gray-200 rounded-md bg-gray-50 min-h-0"
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
                  msg.role === "user" ? "ml-auto bg-blue-500 text-white" : "mr-auto bg-white border border-gray-200 text-gray-800"
                }`}
              >
                <p className="whitespace-pre-wrap">
                  <ReactMarkdown>{msg.parts[0]?.text}</ReactMarkdown>
                </p>
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
        <div className="flex flex-shrink-0">
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                clipRule="evenodd"
              />
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