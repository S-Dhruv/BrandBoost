import React, { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../../util/SocketProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

const BusinessWorkspace = () => {
  const nav = useNavigate();
  const location = useLocation();
  const messageRef = useRef(null);
  const chatContainerRef = useRef(null);
  const { socket, connected } = useContext(SocketContext);

  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [room, setRoom] = useState("");

  // Load saved data from localStorage on initial render
  useEffect(() => {
    const savedRoom = localStorage.getItem("room");
    const savedMessages = localStorage.getItem("chatMessages");
    const savedUsers = localStorage.getItem("roomUsers");
    
    if (savedRoom) setRoom(savedRoom);
    if (savedMessages) setMessages(JSON.parse(savedMessages));
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    
    if (!savedRoom) {
      console.log("No room found in localStorage, redirecting");
      nav("/business/dashboard/ongoing");
    }
  }, [nav]);

  // Reconnection and state management effect
  useEffect(() => {
    if (!room) {
      setIsLoading(true);
      return;
    }

    if (!connected || !socket) {
      console.log("Socket not connected, waiting...");
      setIsLoading(true);
      return;
    }

    setIsLoading(false);
    
    // Attempt to rejoin room on connection or reconnection
    console.log(`Attempting to join/rejoin room: ${room}`);
    socket.emit("join-room", { room });
    
  }, [connected, socket, room, nav]);

  // Socket event listeners
  useEffect(() => {
    if (!connected || !socket) {
      return;
    }

    console.log("Setting up socket event listeners");

    const handleNewMessage = (message) => {
      console.log("New message received:", message);
      setMessages((prev) => {
        const updatedMessages = [...prev, message];
        localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
        return updatedMessages;
      });
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    };

    const handleRoomHistory = ({ messages: roomMessages, users: roomUsers }) => {
      console.log("Room history received:", { roomMessages, users: roomUsers });
      
      // Only replace messages if we don't have any cached messages
      // This preserves messages between page reloads
      if (messages.length === 0) {
        setMessages(roomMessages);
        localStorage.setItem("chatMessages", JSON.stringify(roomMessages));
      } else {
        // If we have cached messages, check if we received any newer messages from server
        // This is useful for syncing with server after reconnection
        const existingMessageIds = new Set(messages.map(m => m.id));
        const newMessages = roomMessages.filter(m => !existingMessageIds.has(m.id));
        
        if (newMessages.length > 0) {
          // Add only new messages that aren't in our current list
          setMessages(prev => {
            const combined = [...prev, ...newMessages];
            // Sort by timestamp if available
            combined.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            localStorage.setItem("chatMessages", JSON.stringify(combined));
            return combined;
          });
        }
      }
      
      // Set users directly from server data, ensuring no duplicates by using a Map
      const uniqueUsers = Array.from(
        new Map(roomUsers.map(user => [user.username, user])).values()
      );
      
      setUsers(uniqueUsers);
      localStorage.setItem("roomUsers", JSON.stringify(uniqueUsers));
      
      // Scroll to bottom after loading history
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100);
    };

    const handleUserJoined = (user) => {
      console.log("User joined:", user);
      setUsers((prev) => {
        // Check if user already exists in the array
        if (!prev.some((u) => u.username === user.username)) {
          const updatedUsers = [...prev, user];
          localStorage.setItem("roomUsers", JSON.stringify(updatedUsers));
          return updatedUsers;
        }
        return prev;
      });
    };

    const handleUserLeft = (user) => {
      console.log("User left:", user);
      setUsers((prev) => {
        const updatedUsers = prev.filter((u) => u?.username !== user.username);
        localStorage.setItem("roomUsers", JSON.stringify(updatedUsers));
        return updatedUsers;
      });
    };

    const handleError = ({ message }) => {
      console.error("Socket error:", message);
      toast.error(`Error: ${message}`);
    };

    const handleErrorMessage = ({ status, message }) => {
      console.error(`Error ${status}: ${message}`);
      toast.error(message);
      // If room access is denied, redirect
      if (status === "404") {
        cleanupAndRedirect();
      }
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
      setIsLoading(true);
    };

    const handleReconnect = () => {
      console.log("Socket reconnected");
      if (room) {
        socket.emit("join-room", { room });
      }
    };

    // Register all event listeners
    socket.on("new-message", handleNewMessage);
    socket.on("room-history", handleRoomHistory);
    socket.on("user-joined", handleUserJoined);
    socket.on("user-left", handleUserLeft);
    socket.on("error", handleError);
    socket.on("error-message", handleErrorMessage);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect", handleReconnect);

    return () => {
      // Cleanup all event listeners
      socket.off("new-message", handleNewMessage);
      socket.off("room-history", handleRoomHistory);
      socket.off("user-joined", handleUserJoined);
      socket.off("user-left", handleUserLeft);
      socket.off("error", handleError);
      socket.off("error-message", handleErrorMessage);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect", handleReconnect);
    };
  }, [socket, connected, room, messages]);

  const cleanupAndRedirect = () => {
    // Clear all room-related data from localStorage
    localStorage.removeItem("room");
    localStorage.removeItem("chatMessages");
    localStorage.removeItem("roomUsers");
    
    // Reset state
    setMessages([]);
    setUsers([]);
    setRoom("");
    
    // Redirect
    nav("/business/dashboard/ongoing");
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const message = messageRef.current.value.trim();
    if (!message) return;
    
    if (socket && connected && room) {
      socket.emit("send-message", {
        room,
        message
      });
      toast.success("Message sent!");
      messageRef.current.value = "";
    } else {
      toast.error("Cannot send message - connection issue");
      console.error("Socket not connected or room not available");
    }
  };

  const handleLeaveRoom = () => {
    if (socket && connected && room) {
      socket.emit("leave-room", { room });
      cleanupAndRedirect();
    } else {
      cleanupAndRedirect();
    }
  };

  const handleTodo = () => {
    nav("/business/dashboard/ongoing/workspace/todo");
  };

  // Loading state UI
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#081A42] flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-lg text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#42A4E0] to-[#1D78A0] text-transparent bg-clip-text mb-4">
            Connecting to Chat Room
          </h2>
          <div className="animate-pulse flex space-x-4 mb-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-[#328AB0]/20 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-[#328AB0]/20 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
          <button
            onClick={cleanupAndRedirect}
            className="px-6 py-2 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors duration-300"
          >
            Cancel and Return
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#081A42] relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-[#081A42] via-[#0F3A68] to-transparent"></div>
        <div className="absolute -right-48 top-48 w-96 h-96 bg-[#328AB0]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -left-48 bottom-48 w-96 h-96 bg-[#42A4E0]/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col h-screen p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#42A4E0] to-[#1D78A0] text-transparent bg-clip-text">
            Chat Room
          </h2>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-white text-sm mr-4">{connected ? 'Connected' : 'Disconnected'}</span>
            <button
              onClick={handleLeaveRoom}
              className="px-6 py-2 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors duration-300"
            >
              Leave Room
            </button>
          </div>
        </div>

        <div className="flex flex-1 gap-4 mb-4">
          {/* Chat messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 p-6 overflow-y-auto bg-white rounded-3xl shadow-lg border border-[#328AB0]/20"
          >
            {messages.length === 0 ? (
              <div className="flex justify-center items-center h-full text-gray-400">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-4 ${
                    msg.sender === socket.username ? "text-right" : "text-left"
                  }`}
                >
                  <div className="inline-block max-w-[80%]">
                    <p className="text-sm text-[#081A42]/70 mb-1">
                      {msg.sender} ({msg.userType})
                    </p>
                    <div
                      className={`p-3 rounded-2xl ${
                        msg.sender === socket.username
                          ? "bg-[#42A4E0] text-white"
                          : "bg-[#F9FAFB] text-[#081A42]"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <p className="text-xs text-[#A1C6D2] mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Users list */}
          <div className="w-72 p-6 bg-white rounded-3xl shadow-lg border border-[#328AB0]/20">
            <h3 className="font-bold text-lg bg-gradient-to-r from-[#42A4E0] to-[#1D78A0] text-transparent bg-clip-text mb-4">
              Users in Room
            </h3>
            {users.length === 0 ? (
              <div className="text-gray-400">No users connected</div>
            ) : (
              users.map((user, idx) => (
                <div
                  key={idx}
                  className="mb-3 text-[#081A42] p-2 rounded-xl bg-[#F9FAFB]"
                >
                  {user?.username} ({user?.userType})
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message input and buttons */}
        <div className="space-y-4">
          <form
            onSubmit={handleSendMessage}
            className="p-4 bg-white/90 rounded-3xl shadow-lg border border-[#328AB0]/20"
          >
            <div className="flex gap-3">
              <input
                type="text"
                ref={messageRef}
                placeholder="Type a message..."
                className="flex-1 px-5 py-4 rounded-2xl bg-[#F9FAFB] border-2 border-[#328AB0]/20 text-[#081A42] placeholder-[#A1C6D2] focus:outline-none focus:border-[#42A4E0] transition-all duration-300"
                disabled={!connected}
              />
              <button
                type="submit"
                className={`px-8 py-4 ${
                  connected 
                    ? "bg-[#42A4E0] hover:bg-[#1D78A0]" 
                    : "bg-gray-400 cursor-not-allowed"
                } text-white rounded-2xl transition-colors duration-300`}
                disabled={!connected}
              >
                Send
              </button>
            </div>
          </form>

          <div className="text-center">
            <div className="text-white mb-2">
              Head to your mini task for today!
            </div>
            <button
              type="button"
              onClick={handleTodo}
              className="px-8 py-4 bg-[#42A4E0] text-white rounded-2xl hover:bg-[#1D78A0] transition-colors duration-300"
            >
              Head to task manager
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessWorkspace;