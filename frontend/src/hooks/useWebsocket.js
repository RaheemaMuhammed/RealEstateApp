// src/hooks/useWebSocket.js
import { useEffect, useState } from "react";

const useWebSocket = (token, onMessageReceived) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (token) {
      const newSocket = new WebSocket(`ws://127.0.0.1:8000/ws/notifications/?token=${token}`);
      
      newSocket.onopen = () => {
        console.log("WebSocket connection opened.");
      };

      newSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received notification:", data);
        if (onMessageReceived) {
          onMessageReceived(data);
        }
      };

      newSocket.onerror = (error) => {
        console.log("WebSocket error:", error);
      };

      newSocket.onclose = () => {
        console.log("WebSocket connection closed.");
      };

      setSocket(newSocket);

      // Cleanup function to close the socket
      return () => {
        newSocket.close();
      };
    }
  }, [token]);

  return socket;
};

export default useWebSocket;
