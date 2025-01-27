import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeSocket, closeSocket } from './SocketManager';

const Ongoing = () => {
  const [room, setRoom] = useState(localStorage.getItem("roomCode") || "");
  const roomRef = useRef(null);
  const nav = useNavigate();
  const tokenCode = localStorage.getItem("token");

  useEffect(() => {
    const socket = initializeSocket(tokenCode);
    
    socket.on("join-room", ({ room, username }) => {
      console.log(`${username} joined room ${room}`);
      setRoom(room);
    });

    return () => {
      socket.off("join-room");
    };
  }, [tokenCode]);

  const handleCreateRoom = async () => {
    try {
      const response = await fetch("http://localhost:3000/creator/dashboard/ongoing/room/create", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenCode}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      localStorage.setItem("roomCode", data.roomCode);
      console.log("Room created:", data);
      nav("/creator/dashboard/ongoing/chat");
    } catch (err) {
      console.error("Error creating room:", err);
    }
  };

  const handleJoinRoom = async () => {
    try {
      const response = await fetch("http://localhost:3000/creator/dashboard/ongoing/room/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenCode}`,
        },
        body: JSON.stringify({ roomCode: roomRef.current.value }),
      });
      const data = await response.json();
      console.log("Join room response:", data);
      
      if (response.ok) {
        localStorage.setItem("roomCode", roomRef.current.value);
        nav("/creator/dashboard/ongoing/chat");
      }
    } catch (err) {
      console.error("Error joining room:", err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Ongoing</h1>
      <div className="space-y-4">
        <button 
          type="button" 
          onClick={handleCreateRoom}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Room
        </button>
        
        <div className="flex gap-2">
          <input 
            type="text" 
            name="room" 
            ref={roomRef}
            className="border p-2 rounded" 
            placeholder="Enter room code"
          />
          <button 
            type="button" 
            onClick={handleJoinRoom}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default Ongoing;