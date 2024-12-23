import React from 'react'
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { Alert, AlertDescription } from "../ui/alert"
import { InfoIcon, MessageSquare, Video } from "lucide-react"
import { useNavigate } from 'react-router-dom'

const HomeDesktop = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <div className="p-6 space-y-8">
          {/* Mobile notice */}
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm font-medium text-center">
              You don't need an app to use Omegle on your phone or tablet! The web site works great on mobile.
            </p>
          </div>

          {/* Video monitoring alert */}
          <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <InfoIcon className="h-5 w-5 text-blue-500" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="text-xl font-semibold text-center">
                  {/* Video is monitored. Keep it clean! */}
                  Video is not available yet. Text chat only.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <strong>18+:</strong>
                  <span className="text-red-500 dark:text-red-400">
                    (Adult) (Unmoderated Section)
                  </span>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          {/* Chat buttons */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">Start Chatting</h2>
            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate('/chat')}
                className="w-32 space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Text</span>
              </Button>
              <span className="text-muted-foreground">or</span>
              <Button
                variant="secondary"
                size="lg"
                disabled
                className="w-32 space-x-2"
              >
                <Video className="w-4 h-4" />
                <span>Video</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default HomeDesktop