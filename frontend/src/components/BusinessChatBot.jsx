import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

const BusinessChatBot = () => {
  const chatInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Gemini API key - replace with env variable in production
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedChats = localStorage.getItem("businesschats");
    if (savedChats) {
      setChatMessages(JSON.parse(savedChats));
    }
  }, []);

  // Save chats to localStorage whenever chatMessages changes
  useEffect(() => {
    localStorage.setItem("businesschats", JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Auto-scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user message to chat
    const newUserMessage = { role: "user", parts: [{ text: userInput }] };
    setChatMessages((prev) => [...prev, newUserMessage]);
    setUserInput("");
    chatInputRef.current?.focus(); // Focus input after sending
    setIsLoading(true);

    try {
      const history = [...chatMessages, newUserMessage];
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contents: history }),
        }
      );

      const data = await response.json();
      let botResponseText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't generate a response at this time.";

      // Add model response to chat
      const modelResponse = { role: "model", parts: [{ text: botResponseText }] };
      setChatMessages((prev) => [...prev, modelResponse]);
    } catch (error) {
      console.error("Error sending message to Gemini API:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: "Sorry, I encountered an error. Please try again." }],
          isError: true, // Flag for error styling
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg  p-4 flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Business Assistant</h2>

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto mb-4 space-y-4 min-h-[400px] max-h-[600px] p-4 border border-gray-200 rounded-md bg-gray-50"
      >
        {chatMessages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet. Start a conversation with the business assistant!</p>
          </div>
        ) : (
          chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-[80%] ${
                msg.role === "user"
                  ? "ml-auto bg-blue-500 text-white"
                  : msg.isError
                  ? "mr-auto bg-red-100 border border-red-200 text-red-800"
                  : "mr-auto bg-white border border-gray-200 text-gray-800"
              }`}
            >
              <p className="whitespace-pre-wrap">
                <ReactMarkdown>{msg.parts[0]?.text}</ReactMarkdown>
              </p>
            </div>
          ))
        )}

        {isLoading && (
          <div className="mr-auto bg-white border border-gray-200 text-gray-800 p-3 rounded-lg flex items-center space-x-2">
            <div className="flex space-x-1">
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
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
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // Prevent any default behavior
              sendMessage();
            }
          }}
          placeholder="Ask anything about your business..."
          className="flex-1 px-4 py-2 mb-4 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !userInput.trim()}
          className="px-4 py-2 mb-3 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          aria-label="Send message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BusinessChatBot;