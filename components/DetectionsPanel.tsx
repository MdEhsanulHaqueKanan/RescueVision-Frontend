// components/DetectionsPanel.tsx (The Final, Definitive Version)

import React from 'react';
import PersonIcon from './icons/PersonIcon';
import { DetectionEvent } from '../types';

const DetectionItem: React.FC<{ event: DetectionEvent; onSelect: () => void }> = ({ event, onSelect }) => (
  <li 
    onClick={onSelect}
    className="group flex items-center gap-4 p-3 rounded-md transition-all duration-200 hover:bg-cyan-400/20 cursor-pointer"
  >
    <div className="p-2 bg-gray-700 rounded-full group-hover:bg-cyan-400 transition-colors duration-200">
      <PersonIcon className="w-5 h-5 text-cyan-400 group-hover:text-gray-900 transition-colors duration-200" />
    </div>
    <div className="flex-grow">
      <p className="font-semibold text-white group-hover:text-cyan-300">
        Survivor (Confidence: {Math.round(event.confidence * 100)}%)
      </p>
      <p className="text-xs text-gray-400">
        Timestamp: {new Date(event.timestamp * 1000).toISOString().substr(14, 5)}
      </p>
    </div>
  </li>
);

interface DetectionsPanelProps {
  events: DetectionEvent[];
  onEventSelect: (event: DetectionEvent) => void;
}

const DetectionsPanel: React.FC<DetectionsPanelProps> = ({ events, onEventSelect }) => {
  return (
    <div className="bg-gray-900/50 border border-cyan-400/30 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.1)] h-full flex flex-col">
      <h2 className="text-lg font-bold text-cyan-400 p-4 border-b border-cyan-400/30">
        Detections Log
      </h2>
      <div className="flex-grow p-2 overflow-y-auto">
        <ul className="space-y-1">
          {events.map((event, index) => (
            <DetectionItem 
              key={`${event.timestamp}-${index}`} 
              event={event} 
              onSelect={() => onEventSelect(event)} 
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DetectionsPanel;