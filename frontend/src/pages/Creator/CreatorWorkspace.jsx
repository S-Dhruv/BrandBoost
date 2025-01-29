import React, { useContext, useEffect, useRef, useState } from 'react';
import { SocketContext } from '../../util/SocketProvider';
import { useNavigate } from 'react-router-dom';

const CreatorWorkspace = () => {
  const nav = useNavigate();
  const messageRef = useRef(null);
  const chatContainerRef = useRef(null);
  const { socket, connected } = useContext(SocketContext);
  
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [room, setRoom] = useState(localStorage.getItem('room'));

  useEffect(() => {
    if (!connected || !socket) {
      nav('/'); 
      return;
    }

    socket.on('new-message', (message) => {
      setMessages(prev => [...prev, message]);
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    });

    socket.on('room-history', ({ messages: roomMessages, users: roomUsers }) => {
      setMessages(roomMessages);
      setUsers(roomUsers);
    });

    socket.on('user-joined', (user) => {
      setUsers(prev => [...prev, user]);
    });

    socket.on('user-left', (user) => {
      setUsers(prev => prev.filter(u => u.username !== user.username));
    });
    socket.on('error', ({ message }) => {
      console.error('Socket error:', message);
    });

    return () => {
      socket.off('new-message');
      socket.off('room-history');
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('error');
    };
  }, [socket, connected, nav]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageRef.current.value.trim()) return;
    socket.emit('send-message', {
      room,
      message: messageRef.current.value
    });
    messageRef.current.value = '';
  };

  const handleTodo = () => {
    nav('/creator/dashboard/ongoing/workspace/todo')
  };

  const handleLeaveRoom = () => {
    socket.emit('leave-room', { room });
    nav('/creator/dashboard/ongoing'); 
  };

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
          <button 
            onClick={handleLeaveRoom}
            className="px-6 py-2 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors duration-300"
          >
            Leave Room
          </button>
        </div>

        <div className="flex flex-1 gap-4 mb-4">
          {/* Chat messages */}
          <div 
            ref={chatContainerRef}
            className="flex-1 p-6 overflow-y-auto bg-white rounded-3xl shadow-lg border border-[#328AB0]/20"
          >
            {messages.map((msg, idx) => (
              <div 
                key={idx}
                className={`mb-4 ${msg.sender === socket.username ? 'text-right' : 'text-left'}`}
              >
                <div className="inline-block max-w-[80%]">
                  <p className="text-sm text-[#081A42]/70 mb-1">
                    {msg.sender} ({msg.userType})
                  </p>
                  <div className={`p-3 rounded-2xl ${
                    msg.sender === socket.username 
                      ? 'bg-[#42A4E0] text-white' 
                      : 'bg-[#F9FAFB] text-[#081A42]'
                  }`}>
                    {msg.content}
                  </div>
                  <p className="text-xs text-[#A1C6D2] mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Users list */}
          <div className="w-72 p-6 bg-white rounded-3xl shadow-lg border border-[#328AB0]/20">
            <h3 className="font-bold text-lg bg-gradient-to-r from-[#42A4E0] to-[#1D78A0] text-transparent bg-clip-text mb-4">
              Users in Room
            </h3>
            {users.map((user, idx) => (
              <div key={idx} className="mb-3 text-[#081A42] p-2 rounded-xl bg-[#F9FAFB]">
                {user.username} ({user.userType})
              </div>
            ))}
          </div>
        </div>

        {/* Message input and buttons */}
        <div className="space-y-4">
          <form 
            className="p-4 bg-white rounded-3xl shadow-lg border border-[#328AB0]/20"
          >
            <div className="flex gap-3">
              <input
                type="text"
                ref={messageRef}
                placeholder="Type a message..."
                className="flex-1 px-5 py-4 rounded-2xl bg-[#F9FAFB] border-2 border-[#328AB0]/20 text-[#081A42] placeholder-[#A1C6D2] focus:outline-none focus:border-[#42A4E0] transition-all duration-300"
              />
              <button 
                onClick={handleSendMessage}
                type="button"
                className="px-8 py-4 bg-[#42A4E0] text-white rounded-2xl hover:bg-[#1D78A0] transition-colors duration-300"
              >
                Send
              </button>
            </div>
          </form>

          <div className="text-center">
            <div className="text-white mb-2">Head to your mini task for today!</div>
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

export default CreatorWorkspace;