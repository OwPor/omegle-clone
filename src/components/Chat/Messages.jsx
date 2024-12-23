import React, { useEffect, useRef } from 'react'
import { useChat } from '../../contextApi/ChatContext'
import { socket } from '../../Socket'
import html2canvas from 'html2canvas'
import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"
import { Loader2 } from "lucide-react"

const Messages = () => {
    const { userId, isSearching, setIsSearching, receiver, messages, setMessages, isTyping } = useChat()
    const messagesRef = useRef()

    const newChat = () => {
        setIsSearching(true)
        setMessages([])
        socket.emit("pairing-user", userId, (error) => {
            if (error) return alert(error)
        })
    }

    const takeScreenshot = () => {
        const element = document.getElementById('savedchat')
        html2canvas(element).then((canvas) => {
            const screenshot = canvas.toDataURL('image/png')
            const downloadLink = document.createElement('a')
            downloadLink.href = screenshot
            downloadLink.download = 'omegle-chat.png'
            document.body.appendChild(downloadLink)
            downloadLink.click()
            document.body.removeChild(downloadLink)
        })
    }

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight
        }
    }, [messages])

    return (
        <ScrollArea 
            id='savedchat' 
            className="h-[70vh] p-4" 
            ref={messagesRef}
        >
            {!isSearching && !receiver && receiver !== "" && (
                <div className="space-y-4 text-center">
                    <h2 className="text-2xl font-bold">Omegle: talk to strangers</h2>
                    <Button onClick={newChat}>Start a new conversation</Button>
                </div>
            )}

            {receiver && (
                <p className="text-center text-muted-foreground mb-4">
                    You're now chatting with a random stranger.
                </p>
            )}

            <div className="space-y-4">
                {messages.map((message, index) => (
                    <div key={index} 
                        className={`flex ${message?.stranger ? "justify-start" : "justify-end"}`}
                    >
                        <div className={`max-w-[80%] rounded-lg p-3 ${
                            message?.stranger 
                                ? "bg-gray-100 dark:bg-gray-800" 
                                : "bg-blue-100 dark:bg-blue-900"
                        }`}>
                            <p className={`font-bold ${
                                message?.stranger ? "text-red-500" : "text-blue-500"
                            }`}>
                                {message?.stranger ? "Stranger:" : "You:"}
                            </p>
                            <p className="mt-1">{message?.stranger ? message.stranger : message.you}</p>
                        </div>
                    </div>
                ))}
            </div>

            {isTyping && (
                <p className="text-muted-foreground italic mt-2">
                    Stranger is typing...
                </p>
            )}

            {isSearching && (
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p className="hidden md:block">
                        Looking for someone you can chat with...
                    </p>
                    <p className="md:hidden">
                        Connecting to server...
                    </p>
                </div>
            )}

            {!isSearching && !receiver && receiver === "" && (
                <div className="space-y-6 mt-4">
                    <p className="text-gray-500 font-medium text-center">
                        Your conversational partner has disconnected
                    </p>
                    
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-2">
                            <Button onClick={newChat}>
                                Start a new conversation
                            </Button>
                            <span className="text-muted-foreground">or</span>
                            <Button variant="outline" onClick={takeScreenshot}>
                                Save this log
                            </Button>
                            <span className="text-muted-foreground">or</span>
                            <Button variant="link">
                                Send us feedback
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </ScrollArea>
    )
}

export default Messages