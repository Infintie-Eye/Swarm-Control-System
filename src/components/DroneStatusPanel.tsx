import { useState, useEffect } from 'react';
import { Circle, Battery, Wifi, WifiOff, Eye, AlertCircle, RefreshCw, Settings, Play, Pause, RotateCcw } from 'lucide-react';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export function DroneStatusPanel() {
  const [drones, setDrones] = useState([
    { id: 'D-001', status: 'Connected', battery: 87, health: 'Good', signal: 95, altitude: 120, speed: 15 },
    { id: 'D-002', status: 'Connected', battery: 62, health: 'Good', signal: 88, altitude: 85, speed: 12 },
    { id: 'D-003', status: 'Low Battery', battery: 8, health: 'Critical', signal: 45, altitude: 50, speed: 8 },
    { id: 'D-004', status: 'Offline', battery: 0, health: 'Offline', signal: 0, altitude: 0, speed: 0 },
    { id: 'D-005', status: 'Connected', battery: 94, health: 'Good', signal: 92, altitude: 150, speed: 18 },
    { id: 'D-006', status: 'Connected', battery: 76, health: 'Good', signal: 89, altitude: 110, speed: 14 },
    { id: 'D-007', status: 'Charging', battery: 45, health: 'Good', signal: 0, altitude: 0, speed: 0 },
  ]);

  const [swarmStats, setSwarmStats] = useState({
    deployed: 4,
    available: 12,
    total: 16,
    charging: 1
  });

  const [liveFeedEnabled, setLiveFeedEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedDrone, setSelectedDrone] = useState<string | null>(null);

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setDrones(prev => prev.map(drone => {
        if (drone.status === 'Offline' || drone.status === 'Charging') return drone;
        
        const batteryChange = Math.random() > 0.7 ? (Math.random() > 0.5 ? -1 : 0) : 0;
        const newBattery = Math.max(0, Math.min(100, drone.battery + batteryChange));
        
        return {
          ...drone,
          battery: newBattery,
          signal: Math.max(0, Math.min(100, drone.signal + (Math.random() - 0.5) * 5)),
          speed: Math.max(0, Math.min(25, drone.speed + (Math.random() - 0.5) * 2)),
          status: newBattery < 15 ? 'Low Battery' : newBattery > 0 ? 'Connected' : 'Offline',
          health: newBattery < 15 ? 'Critical' : newBattery < 30 ? 'Warning' : 'Good'
        };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Connected': return 'text-green-400';
      case 'Low Battery': return 'text-yellow-400';
      case 'Charging': return 'text-blue-400';
      default: return 'text-red-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Connected': return <Wifi className="w-4 h-4" />;
      case 'Low Battery': return <Battery className="w-4 h-4" />;
      case 'Charging': return <Battery className="w-4 h-4 animate-pulse" />;
      default: return <WifiOff className="w-4 h-4" />;
    }
  };

  const recallDrone = (droneId: string) => {
    setDrones(prev => prev.map(drone => 
      drone.id === droneId 
        ? { ...drone, status: 'Returning', speed: 20 }
        : drone
    ));
  };

  const deployDrone = (droneId: string) => {
    setDrones(prev => prev.map(drone => 
      drone.id === droneId 
        ? { ...drone, status: 'Connected', altitude: 100, speed: 15 }
        : drone
    ));
  };

  return (
    <div className="h-full bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Circle className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-medium">Drone & Swarm Status</h2>
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={autoRefresh ? 'text-green-400' : 'text-gray-400'}
                >
                  {autoRefresh ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {autoRefresh ? 'Pause Updates' : 'Resume Updates'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Swarm Overview */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3 text-gray-300">Swarm Overview</h3>
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center bg-gray-700/20 rounded p-2">
            <div className="text-xl font-bold text-green-400">{swarmStats.deployed}</div>
            <div className="text-xs text-gray-400">Deployed</div>
          </div>
          <div className="text-center bg-gray-700/20 rounded p-2">
            <div className="text-xl font-bold text-blue-400">{swarmStats.available}</div>
            <div className="text-xs text-gray-400">Available</div>
          </div>
          <div className="text-center bg-gray-700/20 rounded p-2">
            <div className="text-xl font-bold text-yellow-400">{swarmStats.charging}</div>
            <div className="text-xs text-gray-400">Charging</div>
          </div>
          <div className="text-center bg-gray-700/20 rounded p-2">
            <div className="text-xl font-bold text-white">{swarmStats.total}</div>
            <div className="text-xs text-gray-400">Total</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Live Feed Switcher</span>
            <Switch 
              checked={liveFeedEnabled}
              onCheckedChange={setLiveFeedEnabled}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Formation Control</span>
            <Button variant="outline" size="sm" className="text-xs">
              Auto Formation
            </Button>
          </div>
        </div>
        <div className="text-xs text-gray-400 mt-2">
          Mother Drone + {swarmStats.deployed} Legions Active
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Individual Drone Status */}
      <div className="flex-1 min-h-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-300">Individual Drones</h3>
          <Button variant="outline" size="sm" className="text-xs">
            Deploy All Available
          </Button>
        </div>
        
        <ScrollArea className="h-full">
          <div className="space-y-3 pr-4">
            {drones.map((drone) => (
              <div 
                key={drone.id} 
                className={`bg-gray-700/30 rounded-lg p-3 border transition-all duration-200 cursor-pointer hover:bg-gray-700/50 ${
                  selectedDrone === drone.id ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600/50'
                }`}
                onClick={() => setSelectedDrone(selectedDrone === drone.id ? null : drone.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{drone.id}</span>
                  <div className={`flex items-center gap-1 ${getStatusColor(drone.status)}`}>
                    {getStatusIcon(drone.status)}
                    <span className="text-xs">{drone.status}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Battery</span>
                    <span className={drone.battery < 20 ? 'text-red-400' : 'text-white'}>
                      {drone.battery}%
                    </span>
                  </div>
                  <Progress 
                    value={drone.battery} 
                    className={`h-2 ${drone.battery < 20 ? '[&>div]:bg-red-500' : drone.battery < 50 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'}`}
                  />
                  
                  {selectedDrone === drone.id && (
                    <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Signal:</span>
                          <span className="text-white">{drone.signal}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Altitude:</span>
                          <span className="text-white">{drone.altitude}m</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Speed:</span>
                          <span className="text-white">{drone.speed} m/s</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Health:</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs px-1 py-0 ${
                              drone.health === 'Good' ? 'border-green-500 text-green-400' :
                              drone.health === 'Warning' ? 'border-yellow-500 text-yellow-400' :
                              drone.health === 'Critical' ? 'border-red-500 text-red-400' :
                              'border-gray-500 text-gray-400'
                            }`}
                          >
                            {drone.health}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        {drone.status === 'Connected' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 text-xs"
                            onClick={(e: { stopPropagation: () => void; }) => {
                              e.stopPropagation();
                              recallDrone(drone.id);
                            }}
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Recall
                          </Button>
                        )}
                        {(drone.status === 'Offline' || drone.status === 'Charging') && drone.battery > 20 && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 text-xs"
                            onClick={(e: { stopPropagation: () => void; }) => {
                              e.stopPropagation();
                              deployDrone(drone.id);
                            }}
                          >
                            Deploy
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="text-xs">
                          <Settings className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                {drone.battery < 20 && drone.status !== 'Charging' && (
                  <div className="flex items-center gap-2 mt-2 text-red-400">
                    <AlertCircle className="w-4 h-4 animate-pulse" />
                    <span className="text-xs">Low Power Alert</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}