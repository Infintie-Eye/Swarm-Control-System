import { useState, useEffect } from 'react';
import { BarChart3, Clock, Target, TrendingUp, Calendar, Activity, Zap, Users, MapPin } from 'lucide-react';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';

interface MissionAnalyticsProps {
  missionTime: number;
}

export function MissionAnalytics({ missionTime }: MissionAnalyticsProps) {
  const [missionStats, setMissionStats] = useState({
    totalVictims: 12,
    rescued: 7,
    confirmedSafe: 2,
    pending: 3,
    areaScanned: 75,
    areaPending: 25,
    avgResponseTime: 8.5,
    rescueTime: 12.3,
    efficiency: 87,
    dronesDeployed: 5,
    activeDrones: 4,
    batteryAverage: 73
  });

  const [timelineEvents, setTimelineEvents] = useState([
    { time: '14:32', event: 'Mission Started', type: 'start' },
    { time: '14:35', event: 'First Victim Detected', type: 'detection' },
    { time: '14:41', event: 'RT-Alpha Deployed', type: 'deployment' },
    { time: '14:47', event: 'First Rescue Completed', type: 'rescue' },
    { time: '14:52', event: 'Hazard Area Identified', type: 'hazard' },
    { time: '14:58', event: 'RT-Beta Deployed', type: 'deployment' }
  ]);

  const [realtimeMetrics, setRealtimeMetrics] = useState({
    droneSpeed: 15.2,
    areaPerMinute: 2.3,
    detectionRate: 0.8,
    communicationSignal: 92
  });

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMissionStats(prev => ({
        ...prev,
        areaScanned: Math.min(100, prev.areaScanned + 0.5),
        areaPending: Math.max(0, prev.areaPending - 0.5),
        avgResponseTime: prev.avgResponseTime + (Math.random() - 0.5) * 0.2,
        efficiency: Math.max(75, Math.min(100, prev.efficiency + (Math.random() - 0.5) * 2))
      }));

      setRealtimeMetrics(prev => ({
        droneSpeed: Math.max(10, Math.min(25, prev.droneSpeed + (Math.random() - 0.5) * 2)),
        areaPerMinute: Math.max(1, Math.min(5, prev.areaPerMinute + (Math.random() - 0.5) * 0.5)),
        detectionRate: Math.max(0.3, Math.min(1.5, prev.detectionRate + (Math.random() - 0.5) * 0.1)),
        communicationSignal: Math.max(70, Math.min(100, prev.communicationSignal + (Math.random() - 0.5) * 5))
      }));

      // Add new timeline events occasionally
      if (Math.random() > 0.7) {
        const currentTime = new Date();
        const timeStr = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
        const events = [
          'Victim Movement Detected',
          'Drone Battery Warning',
          'New Hazard Identified',
          'Team Position Updated',
          'Communication Check'
        ];
        const eventTypes = ['detection', 'warning', 'hazard', 'update', 'communication'];
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];

        setTimelineEvents(prev => [
          ...prev,
          { time: timeStr, event: randomEvent, type: randomType }
        ].slice(-8)); // Keep only last 8 events
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getEventColor = (type: string) => {
    switch (type) {
      case 'start': return 'text-blue-400';
      case 'detection': return 'text-yellow-400';
      case 'deployment': return 'text-green-400';
      case 'rescue': return 'text-green-500';
      case 'hazard': return 'text-red-400';
      case 'current': return 'text-white font-bold';
      default: return 'text-gray-400';
    }
  };

  const formatMissionTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="h-full bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-4 pb-2 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-medium">Mission Analytics</h2>
            <Badge variant="outline" className="bg-blue-500/20 border-blue-500 text-blue-400 animate-pulse">
              Live Data
            </Badge>
          </div>
          <div className="text-sm text-gray-300">
            Mission Duration: <span className="text-white font-mono">{formatMissionTime(missionTime)}</span>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 min-h-0 p-4 pt-2">
        <div className="h-full grid grid-cols-12 gap-4">
          {/* Enhanced Key Metrics */}
          <div className="col-span-9 grid grid-cols-5 gap-3 h-full">
            {/* Victims Stats */}
            <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50 hover:border-gray-500/50 transition-colors h-full flex flex-col justify-between">
              <div className="text-sm text-gray-300 mb-1 flex items-center gap-1">
                <Users className="w-3 h-3" />
                Total Victims
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-white">{missionStats.totalVictims}</span>
                <div className="text-xs leading-tight">
                  <div className="text-green-400">✓ {missionStats.rescued}</div>
                  <div className="text-blue-400">◯ {missionStats.confirmedSafe}</div>
                  <div className="text-yellow-400">⏳ {missionStats.pending}</div>
                </div>
              </div>
            </div>

            {/* Area Coverage */}
            <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50 hover:border-gray-500/50 transition-colors h-full flex flex-col justify-between">
              <div className="text-sm text-gray-300 mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Area Scanned
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl font-bold text-white">{missionStats.areaScanned.toFixed(1)}%</span>
                  <TrendingUp className="w-3 h-3 text-green-400" />
                </div>
                <Progress value={missionStats.areaScanned} className="h-1.5" />
                <div className="text-xs text-gray-400 mt-1">{realtimeMetrics.areaPerMinute.toFixed(1)} km²/min</div>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50 hover:border-gray-500/50 transition-colors h-full flex flex-col justify-between">
              <div className="text-sm text-gray-300 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Response Time
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-bold text-white">{missionStats.avgResponseTime.toFixed(1)}m</span>
                </div>
                <div className="text-xs text-gray-400">Rescue: {missionStats.rescueTime}m</div>
              </div>
            </div>

            {/* Mission Efficiency */}
            <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50 hover:border-gray-500/50 transition-colors h-full flex flex-col justify-between">
              <div className="text-sm text-gray-300 mb-1 flex items-center gap-1">
                <Target className="w-3 h-3" />
                Efficiency
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl font-bold text-green-400">{missionStats.efficiency.toFixed(1)}%</span>
                </div>
                <Progress value={missionStats.efficiency} className="h-1.5 [&>div]:bg-green-500" />
                <div className="text-xs text-gray-400">Detection: {realtimeMetrics.detectionRate.toFixed(1)}/min</div>
              </div>
            </div>

            {/* Real-time Performance */}
            <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50 hover:border-gray-500/50 transition-colors h-full flex flex-col justify-between">
              <div className="text-sm text-gray-300 mb-1 flex items-center gap-1">
                <Activity className="w-3 h-3" />
                Live Performance
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Drone Speed:</span>
                  <span className="text-white">{realtimeMetrics.droneSpeed.toFixed(1)} m/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Signal:</span>
                  <span className={`${realtimeMetrics.communicationSignal > 80 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {realtimeMetrics.communicationSignal.toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Drones:</span>
                  <span className="text-blue-400">{missionStats.activeDrones}/{missionStats.dronesDeployed}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Mission Timeline */}
          <div className="col-span-3 h-full">
            <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50 h-full flex flex-col overflow-hidden">
              <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                <Calendar className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-medium text-gray-300">Live Activity Feed</h3>
              </div>
              
              <ScrollArea className="flex-1 min-h-0">
                <div className="space-y-2 pr-2">
                  {timelineEvents.slice(-6).reverse().map((event, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-2 py-1 animate-in slide-in-from-bottom-2 duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="text-xs text-gray-400 w-12 flex-shrink-0 font-mono">{event.time}</div>
                      <div className={`text-xs flex-1 ${getEventColor(event.type)}`}>
                        {event.event}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}