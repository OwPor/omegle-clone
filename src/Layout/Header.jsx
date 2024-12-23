import React, { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from "../components/ui/button"
import { useChat } from '../contextApi/ChatContext'
import OmegleLogo from "../assets/Omegle2.png"

const Header = () => {
    const [isDark, setIsDark] = useState(false);
    const { onlineUsers } = useChat();

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 flex h-14 items-center justify-between">
                <div className="flex items-center gap-6">
                    <a href="/" className="flex items-center space-x-2">
                        <img src={OmegleLogo} alt="Omegle Logo" className="h-12" />
                    </a>
                    <p className="hidden md:block text-2xl font-bold -rotate-3 dark:text-white">
                        Talk to strangers!
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        onClick={toggleTheme}
                        className="p-2 rounded-md"
                    >
                        {isDark ? 
                            <Sun className="h-5 w-5" /> : 
                            <Moon className="h-5 w-5" />
                        }
                    </Button>

                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-blue-400">
                            {onlineUsers.length}+
                        </span>
                        <span className="text-blue-300">Live users</span>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header