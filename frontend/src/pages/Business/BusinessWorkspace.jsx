import React, { useContext, useEffect, useRef, useState } from 'react';
import { SocketContext } from '../../util/SocketProvider';
import { useNavigate } from 'react-router-dom';

const BusinessWorkspace = () => {
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

  const handleLeaveRoom = () => {
    socket.emit('leave-room', { room });
    nav('/business/dashboard/ongoing'); 
  };

  const handleTodo = ()=>{
    nav('/business/dashboard/ongoing/workspace/todo')
  }
  return (
    <>
    <div className="flex flex-col h-screen">
      <div className="p-4 bg-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold">Chat Room</h2>
        <button 
          onClick={handleLeaveRoom}
          className="px-4 py-2 bg-red-500 text-white rounded"
          >
          Leave Room
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat messages */}
        <div 
          ref={chatContainerRef}
          className="flex-1 p-4 overflow-y-auto"
          >
          {messages.map((msg, idx) => (
            <div 
            key={idx}
            className={`mb-4 ${
              msg.sender === socket.username ? 'text-right' : 'text-left'
            }`}
            >
              <div className="inline-block">
                <p className="text-sm text-gray-600">
                  {msg.sender} ({msg.userType})
                </p>
                <div className={`p-3 rounded-lg ${
                  msg.sender === socket.username 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200'
                }`}>
                  {msg.content}
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Users list */}
        <div className="w-64 bg-gray-50 p-4 overflow-y-auto">
          <h3 className="font-bold mb-4">Users in Room</h3>
          {users.map((user, idx) => (
            <div key={idx} className="mb-2">
              {user.username} ({user.userType})
            </div>
          ))}
        </div>
      </div>

      {/* Message input */}
      <form 
        onSubmit={handleSendMessage}
        className="p-4 bg-white border-t"
        >
        <div className="flex gap-2">
          <input
            type="text"
            ref={messageRef}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded"
            />
          <button 
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded"
            >
            Send
          </button>
        </div>
      </form>
    </div>
    <div>Head to your mini task for today!</div>
    <button type="button" className='bg-cyan-500' onClick={handleTodo}>Head to task manager</button>
    </>

  );
};

export default BusinessWorkspace;