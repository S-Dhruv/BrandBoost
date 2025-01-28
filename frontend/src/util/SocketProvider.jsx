import { io } from 'socket.io-client';
import { createContext, useEffect, useRef, useState } from 'react';

export const SocketContext = createContext({ socket: null, connected: false });

export const SocketProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    socketRef.current = io('http://localhost:3000', {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
      setConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      setConnected(false);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const value = {
    socket: socketRef.current,
    connected
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};