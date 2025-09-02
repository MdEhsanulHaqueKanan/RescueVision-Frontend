// App.tsx (The Final, Complete, and Correct Version)

import React, { useState } from 'react';
import MainPanel from './components/MainPanel';
import ChatPanel from './components/ChatPanel';
import DetectionsPanel from './components/DetectionsPanel';
import { DetectionEvent } from './types';

const App: React.FC = () => {
  // This state will hold the full list of events for the entire video.
  const [detectionEvents, setDetectionEvents] = useState<DetectionEvent[]>([]);
  
  // This state will hold the one event the user has clicked on.
  const [selectedEvent, setSelectedEvent] = useState<DetectionEvent | null>(null);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 lg:p-6">
      <main className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-[calc(100vh-2rem)] lg:h-[calc(100vh-3rem)]">
        {/* Left Main Panel */}
        <div className="lg:w-[65%] h-full">
          <MainPanel 
            onProcessingComplete={setDetectionEvents}
            selectedEvent={selectedEvent}
            onEventSelect={setSelectedEvent} // <-- THE ONLY CHANGE IS ADDING THIS LINE
          />
        </div>
        
        {/* Right Side Panels */}
        <div className="lg:w-[35%] flex flex-col gap-4 lg:gap-6 h-full">
          <div className="h-3/5">
            <ChatPanel />
          </div>
          <div className="h-2/5">
            <DetectionsPanel 
              events={detectionEvents}
              onEventSelect={setSelectedEvent}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;