import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useChat } from './context/ChatContext';
import { v4 as uuidv4 } from 'uuid';
// import beepSound from "./assets/ping-82822.mp3"

const URL = process.env.REACT_APP_BASE_URL

export const socket = io(URL, {
    autoConnect: false,
    reconnectionAttempts: 3
});

const Socket = () => {
    const { setUserId, setIsConnected, setMessages, setOnlineUsers, receiver, setReceiver, setIsSearching, setIsTyping } = useChat()

    useEffect(() => {
        socket.connect();
        console.log("socket connected");
        return () => {
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
        setUserId(uniqueId)
        socket.emit("new-online-user", uniqueId, (error) => {
            if (error) {
                return alert(error);
            }
        });

        socket.on("get-online-users", (users) => {
            setOnlineUsers(users);
            if (receiver !== undefined && !users.find((user) => user.userId === receiver)) {
                setReceiver("")
                setIsTyping(false)
            }
        });

        socket.on("send-message", (message) => {
            setMessages((previous) => [
                ...previous,
                { stranger: message },
            ]);
            setIsTyping(false)
        });

        socket.on("user-paired", (receiver) => {
            setReceiver(receiver)
            // const audio = new Audio(beepSound);
            // audio.play();
            // setIsSearching(false)
        })

        socket.on("chat-close", () => {
            setReceiver("")
        })

        socket.on("typing", () => {
            setIsTyping(true)
        })

        return () => {
            socket.off("get-online-users");
            socket.off("send-message");
            socket.off("new-online-user");
            socket.off("user-paired")
        };
    }, []);
}

export default Socket