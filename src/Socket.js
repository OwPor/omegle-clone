import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { useChat } from './contextApi/ChatContext';

const URL = process.env.REACT_APP_BASE_URL;

export const socket = io(URL, {
    autoConnect: false,
    reconnectionAttempts: 3
});

const Socket = () => {
    const { 
        setUserId, 
        setIsConnected, 
        setMessages, 
        setOnlineUsers, 
        setReceiver, 
        setIsSearching, 
        setIsTyping, 
        setMessage, 
        setIsSending 
    } = useChat();

    const resetChatState = () => {
        setReceiver("");
        setMessage("");
        setIsTyping(false);
        setIsSearching(false);
        setMessages([]);
    };

    useEffect(() => {
        socket.connect();
        console.log("socket connected");
        
        return () => {
            socket.emit("offline");
            socket.disconnect();
            console.log("socket disconnected");
        };
    }, []);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
            resetChatState();
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        };
    }, [setIsConnected]);

    useEffect(() => {
        const uniqueId = uuidv4();
        setUserId(uniqueId);
        
        socket.emit("new-online-user", uniqueId, (error) => {
            if (error) {
                return console.log(error);
            }
        });

        socket.on("get-online-users", (users) => {
            setOnlineUsers(users);
        });

        socket.on("send-message", (message) => {
            setMessages((previous) => [
                ...previous,
                { stranger: message },
            ]);
            setIsTyping(false);
        });

        socket.on("receive-message", (message) => {
            setMessages((previous) => [
                ...previous,
                { you: message },
            ]);
            setIsSending(false);
        });

        socket.on("user-paired", (receiver) => {
            setReceiver(receiver);
            setIsSearching(false);
        });

        socket.on("chat-close", () => {
            resetChatState();
        });

        socket.on("user-disconnected", (data) => {
            console.log(`${data.userId} has disconnected`);
            resetChatState();
            // Optionally show a notification to the user
            // alert(data.message);
        });

        socket.on("typing", () => {
            setIsTyping(true);
        });

        socket.on("typing stop", () => {
            setIsTyping(false);
        });

        // Handle window/tab close
        const handleBeforeUnload = () => {
            socket.emit("screen-off");
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            socket.off("get-online-users");
            socket.off("send-message");
            socket.off("receive-message");
            socket.off("user-paired");
            socket.off("chat-close");
            socket.off("user-disconnected");
            socket.off("typing");
            socket.off("typing stop");
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    // Handle visibility change (tab switching)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                socket.emit("screen-off");
            } else {
                // Reconnect logic if needed
                const uniqueId = uuidv4();
                setUserId(uniqueId);
                socket.emit("new-online-user", uniqueId, (error) => {
                    if (error) {
                        console.error(error);
                    }
                });
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    return null;
};

export default Socket;