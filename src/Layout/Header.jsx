import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from "../components/ui/button"
import { useChat } from '../contextApi/ChatContext'
import { useTheme } from '../components/ThemeProvider'
import OwmegleLogo from "../assets/Owmegle.png"

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const { onlineUsers } = useChat();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121212] transition-colors duration-200">
            <div className="container mx-auto px-4 flex h-14 items-center justify-between">
                <div className="flex items-center gap-6">
                    <a href="/" className="flex items-center gap-2">
                        <img src={OwmegleLogo} alt="Owmegle Logo" className="h-12" />
                        <span className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-200">
                            Owmegle
                        </span>
                    </a>
                    <p className="hidden md:block text-2xl font-bold -rotate-3 text-gray-800 dark:text-gray-100">
                        Meet Someone New!
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        onClick={toggleTheme}
                        className="p-2 rounded-md dark:bg-[#1E1E1E] dark:hover:bg-[#2D2D2D] transition-colors duration-200"
                        variant="outline"
                    >
                        {theme === 'dark' ? 
                            <Sun className="h-5 w-5" /> : 
                            <Moon className="h-5 w-5" />
                        }
                    </Button>

                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-blue-400 dark:text-blue-300">
                            {onlineUsers.length}+
                        </span>
                        <span className="text-blue-300 dark:text-blue-200">Live users</span>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header