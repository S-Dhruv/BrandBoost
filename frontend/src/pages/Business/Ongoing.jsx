import React, { useContext, useRef, useEffect } from 'react';
import { SocketContext } from '../../util/SocketProvider';
import { useNavigate } from 'react-router-dom';

const Ongoing = () => {
  const nav = useNavigate();
  const givenRoomCode = useRef(null);
  const { socket, connected } = useContext(SocketContext);

  useEffect(() => {
    if (!connected) {
      console.log('Socket not connected');
    }
  }, [connected]);

  const handleJoinRoom = () => {
    if (!connected || !socket) {
      console.error('Cannot join room: Socket not connected');
      return;
    }

    const room = givenRoomCode.current.value;
    if (room) {
      socket.emit('join-room', { room });
      console.log(`Joining room: ${room}`);
      localStorage.setItem('room',room);

      nav('/business/dashboard/ongoing/workspace');
    } else {
      console.error('Room code is required');
    }
  };

  return (
    <div>
      <form>
        <input 
          type="text" 
          placeholder="Enter your room code" 
          ref={givenRoomCode}
          disabled={!connected}
        />
        <button 
          type="button" 
          onClick={handleJoinRoom}
          disabled={!connected}
        >
          Join Room
        </button>
      </form>
      {!connected && (
        <p style={{ color: 'red' }}>
          Not connected to server. Please check your authentication.
        </p>
      )}
    </div>
  );
};

export default Ongoing;