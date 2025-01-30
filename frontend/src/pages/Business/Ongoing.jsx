import React, { useContext, useRef, useEffect } from "react";
import { SocketContext } from "../../util/SocketProvider";
import { useNavigate } from "react-router-dom";
import OngoingNew from "./OngoingNew";
import ModernNavbar from '../../components/ModernNavbar';
import  WaveDecoration  from "../../components/WaveDecoration";

const Ongoing = () => {
  const nav = useNavigate();
  const givenRoomCode = useRef(null);
  const { socket, connected } = useContext(SocketContext);

  useEffect(() => {
    if (!connected) {
      console.log("Socket not connected");
    }
  }, [connected]);

  const handleJoinRoom = () => {
    if (!connected || !socket) {
      console.error("Cannot join room: Socket not connected");
      return;
    }

    const room = givenRoomCode.current.value;
    if (room) {
      socket.emit("join-room", { room });
      console.log(`Joining room: ${room}`);
      localStorage.setItem('room',room);

      nav('/business/dashboard/ongoing/workspace');
    } else {
      console.error("Room code is required");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#081A42] pt-20">
      <ModernNavbar />
      <WaveDecoration />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-[#081A42] via-[#0F3A68] to-transparent"></div>
        <div className="absolute -right-48 top-48 w-96 h-96 bg-[#328AB0]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -left-48 bottom-48 w-96 h-96 bg-[#42A4E0]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 w-96 h-96 bg-[#1D78A0]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#328AB0]/20">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#42A4E0] to-[#1D78A0] text-transparent bg-clip-text">
              Join a Room
            </h2>
            <p className="mt-2 text-[#081A42]">Enter your room code to join</p>
          </div>

          <form className="space-y-6">
            <div className="relative group">
              <input
                type="text"
                placeholder="Enter your room code"
                ref={givenRoomCode}
                disabled={!connected}
                className="w-full px-5 py-4 rounded-2xl bg-[#F9FAFB] border-2 border-[#328AB0]/20 text-[#081A42] placeholder-[#A1C6D2] focus:outline-none focus:border-[#42A4E0] transition-all duration-300 group-hover:border-[#42A4E0]/50"
                required
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#42A4E0]/20 to-[#1D78A0]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur"></div>
            </div>

            <button
              type="button"
              onClick={handleJoinRoom}
              disabled={!connected}
              className="w-full bg-[#42A4E0] text-white py-4 rounded-2xl hover:bg-[#1D78A0] focus:outline-none transition-colors duration-300 disabled:opacity-50"
            >
              Join Room
            </button>
          </form>

          {!connected && (
            <p className="mt-4 text-center text-red-500">
              Not connected to server. Please check your authentication.
            </p>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default Ongoing;
