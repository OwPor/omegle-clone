import React, { useEffect } from 'react';
import HomeDesktop from '../components/Home/HomeDesktop';
import HomeMobile from '../components/Home/HomeMobile';
import { socket } from '../Socket';
import { useChat } from '../contextApi/ChatContext';

const Home = () => {
    const { userId, receiver, isSearching, setReceiver, setIsTyping, setMessage, setIsSearching } = useChat()

    useEffect(() => {
        if (userId && isSearching) {
            socket.emit("unpairing-user", userId, () => {
                setIsSearching(false)
            })
        }

        if (receiver) {
            socket.emit("chat-close", receiver, () => {
                setReceiver("")
                setIsTyping(false)
                setMessage("")
            })
        }
    }, [userId, isSearching, receiver]);

    return (
        <>
            <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
                <HomeDesktop />
            </div>
            {/* mobile */}
            {/* <HomeMobile /> */}
        </>
    )
}

export default Home