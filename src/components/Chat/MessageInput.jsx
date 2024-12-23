import React, { useEffect } from 'react'
import { useChat } from '../../contextApi/ChatContext'
import { socket } from '../../Socket'
import { useNavigate } from 'react-router-dom'
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Send, StopCircle, Plus } from "lucide-react"

const MessageInput = () => {
    const { 
        userId, 
        onlineUsers, 
        isSearching, 
        setIsSearching, 
        receiver, 
        setReceiver, 
        setMessages, 
        isSending, 
        setIsSending, 
        message, 
        setMessage, 
        setIsTyping 
    } = useChat()
    const navigate = useNavigate()

    const newChat = () => {
        setIsSearching(true)
        setMessages([])
        socket.emit("pairing-user", userId, (error) => {
            return
        })
    }

    const sendMessage = () => {
        if (isSending || message === "") return
        setIsSending(true)
        socket.emit("send-message", receiver, message, () => {
            setMessage("")
        })
    }

    const disconnectChat = () => {
        if (receiver) {
            socket.emit("chat-close", receiver, () => {
                setReceiver("")
                setIsTyping(false)
                setMessage("")
            })
        } else {
            socket.emit("unpairing-user", userId, () => {
                setIsSearching(false)
            })
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            sendMessage()
        }
    }

    const typingHandle = (e) => {
        if (e.target.value !== "") {
            socket.emit("typing", receiver)
        } else {
            socket.emit("typing stop", receiver)
        }
    }

    useEffect(() => {
        if (userId && onlineUsers.find((user) => user.userId === userId)) {
            newChat()
        } else {
            navigate("/")
        }
    }, [])

    return (
        <div className="p-4 border-t dark:border-[#1E1E1E] bg-white dark:bg-[#121212] transition-colors duration-200">
            <div className="flex gap-2 max-w-4xl mx-auto">
                <Button
                    variant={receiver || isSearching ? "destructive" : "default"}
                    className="w-24 dark:bg-opacity-90 dark:hover:bg-opacity-100"
                    onClick={receiver || isSearching ? disconnectChat : newChat}
                    disabled={isSearching && !receiver}
                >
                    {receiver || isSearching ? (
                        <>
                            <StopCircle className="w-4 h-4 mr-2" />
                            Stop
                        </>
                    ) : (
                        <>
                            <Plus className="w-4 h-4 mr-2" />
                            New
                        </>
                    )}
                </Button>

                <Input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 dark:bg-[#1E1E1E] dark:text-gray-100 dark:border-[#2D2D2D] dark:placeholder-gray-400 dark:focus:border-gray-500"
                    onChange={(e) => {
                        setMessage(e.target.value)
                        typingHandle(e)
                    }}
                    value={message}
                    onKeyDown={handleKeyPress}
                    disabled={!receiver}
                />

                <Button
                    className="w-24 dark:bg-opacity-90 dark:hover:bg-opacity-100"
                    onClick={sendMessage}
                    disabled={!receiver || isSending}
                >
                    <Send className="w-4 h-4 mr-2" />
                    Send
                </Button>
            </div>
        </div>
    )
}

export default MessageInput