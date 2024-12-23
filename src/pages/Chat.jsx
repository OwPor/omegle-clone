import React from 'react'
import { Helmet } from 'react-helmet';
import Messages from '../components/Chat/Messages';
import MessageInput from '../components/Chat/MessageInput';
import { useChat } from '../contextApi/ChatContext';
import { Card } from "../components/ui/card"

const Chat = () => {
    const { receiver } = useChat()

    return (
        <div className="container mx-auto p-4">
            <Helmet>
                <title>
                    {receiver && receiver !== "" 
                        ? "Omegle: Connected to stranger"
                        : "Omegle: Talk to strangers!"}
                </title>
            </Helmet>
            
            <Card className="max-w-4xl mx-auto bg-white dark:bg-gray-900">
                <Messages />
                <MessageInput />
            </Card>
        </div>
    )
}

export default Chat