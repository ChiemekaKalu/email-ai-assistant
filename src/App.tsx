import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Calendar } from 'lucide-react';

interface Email {
  id: number;
  subject: string;
  sender: string;
  preview: string;
  importance: 'high' | 'low';
  summary: string;
  suggestedResponse: string | null;
}

interface Event {
  id: number;
  title: string;
  time: string;
  type: string;
}

function App() {
  const [emails] = useState<Email[]>([
    {
      id: 1,
      subject: "Project Update Meeting",
      sender: "sarah@company.com",
      preview: "Hi team, following up on our discussion...",
      importance: "high",
      summary: "Request for project status update and meeting scheduling for next week.",
      suggestedResponse: "Thank you for following up. I'm available for the meeting next Tuesday at 2 PM. I'll prepare the status update beforehand."
    },
    {
      id: 2,
      subject: "Office Newsletter",
      sender: "communications@company.com",
      preview: "Monthly updates and announcements...",
      importance: "low",
      summary: "Regular monthly newsletter with company updates and events.",
      suggestedResponse: null
    }
  ]);

  const [events] = useState<Event[]>([
    {
      id: 1,
      title: "Team Sync",
      time: "2:00 PM",
      type: "meeting"
    },
    {
      id: 2,
      title: "Project Deadline",
      time: "5:00 PM",
      type: "deadline"
    }
  ]);

  return (
    <div className="w-full min-h-screen bg-white p-4">
      <Tabs defaultValue="inbox" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="important">Important</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox">
          <div className="space-y-4">
            {emails.map(email => (
              <Card key={email.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      {email.subject}
                    </CardTitle>
                    {email.importance === "high" && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{email.sender}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <strong>Summary:</strong> {email.summary}
                    </div>
                    {email.suggestedResponse && (
                      <div className="text-sm">
                        <strong>Suggested Response:</strong>
                        <p className="text-gray-600 mt-1 text-xs">
                          {email.suggestedResponse}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="important">
          <div className="space-y-4">
            {emails
              .filter(email => email.importance === "high")
              .map(email => (
                <Card key={email.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        {email.subject}
                      </CardTitle>
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    </div>
                    <p className="text-xs text-gray-500">{email.sender}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <strong>Summary:</strong> {email.summary}
                      </div>
                      {email.suggestedResponse && (
                        <div className="text-sm">
                          <strong>Suggested Response:</strong>
                          <p className="text-gray-600 mt-1 text-xs">
                            {email.suggestedResponse}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <div className="space-y-4">
            {events.map(event => (
              <Card key={event.id}>
                <CardContent className="py-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-gray-500">{event.time}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;