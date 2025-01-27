import React, { useEffect, useState } from 'react';
import { getSocket } from './SocketManager';

const CreatorOngoingChat = () => {
    const room = localStorage.getItem("roomCode");
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const socket = getSocket();

    useEffect(() => {
        if (!socket) return;

        setIsConnected(socket.connected);

        socket.emit("join-room", { room });

        socket.on("connect", () => {
            setIsConnected(true);
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
        });

        const messageHandler = (data) => {
            console.log("Received message:", data);
            setChat(prev => [...prev, {
                message: data.message,
                username: data.username
            }]);
        };

        socket.on("send-message", messageHandler);

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("send-message", messageHandler);
        };
    }, [socket, room]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!socket || !message.trim() || !isConnected) return;

        socket.emit("send-message", { room, message });
        setMessage('');
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <h1 className="text-2xl">Room: {room}</h1>
                <p className={`text-sm ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                    {isConnected ? 'Connected' : 'Disconnected'}
                </p>
            </div>

            <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto mb-4 border rounded p-4">
                {chat.map((payload, id) => (
                    <p key={id} className="p-2 border rounded">
                        <span className="font-bold">{payload.username}</span>: {payload.message}
                    </p>
                ))}
            </div>

            <form onSubmit={sendMessage} className="flex gap-2">
                <input
                    type="text"
                    name="chat"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 border p-2 rounded"
                    placeholder="Type a message..."
                    disabled={!isConnected}
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                    disabled={!isConnected}
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default CreatorOngoingChat;