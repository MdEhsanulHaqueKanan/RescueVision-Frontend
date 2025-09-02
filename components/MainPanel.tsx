// components/MainPanel.tsx (The Final, Complete, and Correct Version with UX Polish)

import React, { useState, useRef, useEffect } from 'react';
import UploadIcon from './icons/UploadIcon';
import { DetectionEvent } from '../types';
import PlayIcon from './icons/PlayIcon';
import PauseIcon from './icons/PauseIcon';

const PanelContainer: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-gray-900/50 border border-cyan-400/30 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.1)] h-full flex flex-col">
    <h2 className="text-lg font-bold text-cyan-400 p-4 border-b border-cyan-400/30">{title}</h2>
    <div className="p-4 flex-grow flex flex-col">{children}</div>
  </div>
);

// Define the component's props, including the new onEventSelect function
interface MainPanelProps {
  onProcessingComplete: (events: DetectionEvent[]) => void;
  selectedEvent: DetectionEvent | null;
  onEventSelect: (event: DetectionEvent | null) => void; 
}

const MainPanel: React.FC<MainPanelProps> = ({ onProcessingComplete, selectedEvent, onEventSelect }) => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onEventSelect(null); // Clear any selected event from a previous video
    setVideoSrc(URL.createObjectURL(file));
    setIsProcessing(true);
    onProcessingComplete([]);

    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await fetch('http://127.0.0.1:5002/api/process_video', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        onProcessingComplete(data.events);
      } else {
        console.error("Failed to process video");
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const drawBoundingBox = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context || !canvas) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    if (!video || !selectedEvent || video.videoWidth === 0 || isPlaying) {
      return; 
    }

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const videoAspectRatio = video.videoWidth / video.videoHeight;
    const canvasAspectRatio = canvas.width / canvas.height;
    let renderWidth = canvas.width;
    let renderHeight = canvas.height;
    let xOffset = 0;
    let yOffset = 0;

    if (videoAspectRatio > canvasAspectRatio) {
      renderHeight = canvas.width / videoAspectRatio;
      yOffset = (canvas.height - renderHeight) / 2;
    } else {
      renderWidth = canvas.height * videoAspectRatio;
      xOffset = (canvas.width - renderWidth) / 2;
    }

    const scaleX = renderWidth / video.videoWidth;
    const scaleY = renderHeight / video.videoHeight;
    const [x1, y1, x2, y2] = selectedEvent.box;
    
    context.strokeStyle = '#22d3ee';
    context.lineWidth = 3;
    context.strokeRect((x1 * scaleX) + xOffset, (y1 * scaleY) + yOffset, (x2 - x1) * scaleX, (y2 - y1) * scaleY);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video && selectedEvent) {
      video.currentTime = selectedEvent.timestamp;
      video.pause();
    }
    setTimeout(drawBoundingBox, 100); 
  }, [selectedEvent]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // --- THE FINAL UX POLISH ---
    const handlePlay = () => {
        setIsPlaying(true);
        onEventSelect(null); // Clear the selected event and the box when playing starts
    };
    
    const handlePauseOrEnd = () => {
        setIsPlaying(false);
        drawBoundingBox(); // Re-draw the box for the current event when paused
    };
    
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedData = () => { setDuration(video.duration); drawBoundingBox(); };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePauseOrEnd);
    video.addEventListener('ended', handlePauseOrEnd);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadeddata', handleLoadedData);
    
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePauseOrEnd);
      video.removeEventListener('ended', handlePauseOrEnd);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [videoSrc, selectedEvent, onEventSelect]); // Add onEventSelect to the dependency array

  const togglePlayPause = () => { if (videoRef.current) { videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause(); }};
  const formatTime = (time: number) => { const minutes = Math.floor(time / 60); const seconds = Math.floor(time % 60); return `${minutes}:${seconds.toString().padStart(2, '0')}`; };

  return (
    <PanelContainer title="Live Mission Feed">
      <div className="flex justify-center mb-4">
        <label htmlFor="drone-footage-upload" className={`inline-flex items-center gap-3 px-6 py-3 bg-cyan-400 text-gray-900 font-bold rounded-lg cursor-pointer hover:bg-cyan-300 transition-transform duration-200 hover:scale-105 shadow-lg shadow-cyan-500/20 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <UploadIcon className="w-5 h-5" />
          {isProcessing ? 'PROCESSING...' : 'Upload Drone Footage'}
        </label>
        <input id="drone-footage-upload" type="file" className="hidden" accept="video/*" onChange={handleFileChange} disabled={isProcessing} />
      </div>

      <div className="relative flex-grow w-full bg-black rounded-md overflow-hidden border-2 border-gray-700">
        <video ref={videoRef} src={videoSrc || ''} className="absolute inset-0 w-full h-full object-contain"></video>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none"></canvas>
        {!videoSrc && !isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center z-20"><p className="text-gray-500 text-2xl font-semibold">DRONE FEED OFFLINE</p></div>
        )}
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/50 backdrop-blur-sm">
            <p className="text-cyan-400 text-2xl font-semibold animate-pulse">ANALYZING FOOTAGE...</p>
          </div>
        )}
      </div>
      
      {videoSrc && (
        <div className="flex items-center gap-4 mt-4 text-white">
          <button onClick={togglePlayPause} className="p-2 rounded-full bg-cyan-400/80 hover:bg-cyan-400 text-gray-900">
            {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
          </button>
          <div className="font-mono text-sm">{formatTime(currentTime)} / {formatTime(duration)}</div>
          <div className="flex-grow bg-gray-700 h-1.5 rounded-full"><div className="bg-cyan-400 h-full rounded-full" style={{ width: `${(duration ? (currentTime / duration) * 100 : 0)}%` }}></div></div>
        </div>
      )}
    </PanelContainer>
  );
};

export default MainPanel;