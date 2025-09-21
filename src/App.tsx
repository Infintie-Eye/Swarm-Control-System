import { useState, useEffect } from "react";
import { AlertsPanel } from "./components/AlertsPanel";
import { DroneStatusPanel } from "./components/DroneStatusPanel";
import { VictimDetectionPanel } from "./components/VictimDetectionPanel";
import { RescueTeamPanel } from "./components/RescueTeamPanel";
import { MissionAnalytics } from "./components/MissionAnalytics";
import { CentralMap } from "./components/CentralMap";
import { Settings, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";

export default function App() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [missionTime, setMissionTime] = useState(0);

  // Real-time clock and mission timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setMissionTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatMissionTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Global Dark Theme Container */}
      <div className="h-full flex flex-col">
        {/* Enhanced Top Bar - Alerts & System Status - Fixed Height */}
        <div className="h-24 flex-shrink-0 p-4 pb-0">
          <div className="h-full flex gap-4">
            <div className="flex-1 h-full">
              <AlertsPanel />
            </div>

            {/* System Status */}
            <div className="w-80 h-full bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-xs text-gray-400">
                    Current Time
                  </div>
                  <div className="font-mono text-sm">
                    {currentTime.toLocaleTimeString()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400">
                    Mission Time
                  </div>
                  <div className="font-mono text-sm text-green-400">
                    {formatMissionTime(missionTime)}
                  </div>
                </div>
                <Badge className="bg-green-500/20 border-green-500 text-green-400">
                  LIVE
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="text-gray-400 hover:text-white"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid - Fixed Height */}
        <div className="flex-1 p-4 pt-2 pb-2 min-h-0">
          <div className="h-full grid grid-cols-12 gap-4">
            {/* Left Sidebar - Drone & Swarm Status - Fixed Width */}
            <div className="col-span-3 h-full">
              <DroneStatusPanel />
            </div>

            {/* Central Map - Main Section - Fixed Area */}
            <div className="col-span-6 h-full">
              <CentralMap />
            </div>

            {/* Right Sidebar - Victim Detection & Rescue Team - Fixed Width */}
            <div className="col-span-3 h-full flex flex-col gap-4">
              <div className="h-1/2 min-h-0">
                <VictimDetectionPanel />
              </div>
              <div className="h-1/2 min-h-0">
                <RescueTeamPanel />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Panel - Mission Analytics - Fixed Height */}
        <div className="h-40 flex-shrink-0 p-4 pt-0">
          <div className="h-full">
            <MissionAnalytics missionTime={missionTime} />
          </div>
        </div>
      </div>
    </div>
  );
}