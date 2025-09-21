import { useState, useEffect } from 'react';
import { Map, Navigation, Users, Flame, Droplets, Shield, Home, ZoomIn, ZoomOut, RotateCcw, Layers, Search, Plus, Minus } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';

export function CentralMap() {
  const [mapLayers, setMapLayers] = useState([
    { name: 'Victims', active: true, color: 'red', count: 12 },
    { name: 'Drones', active: true, color: 'blue', count: 5 },
    { name: 'Hazards', active: true, color: 'yellow', count: 3 },
    { name: 'Rescue Teams', active: true, color: 'green', count: 2 },
    { name: 'Safe Zones', active: false, color: 'purple', count: 4 }
  ]);

  const [victims, setVictims] = useState([
    { id: 'V-001', x: 25, y: 30, status: 'critical', confidence: 94, lastSeen: '2m ago' },
    { id: 'V-002', x: 45, y: 60, status: 'injured', confidence: 87, lastSeen: '5m ago' },
    { id: 'V-003', x: 70, y: 40, status: 'deceased', confidence: 91, lastSeen: '8m ago' },
    { id: 'V-004', x: 15, y: 70, status: 'critical', confidence: 89, lastSeen: '1m ago' }
  ]);

  const [drones, setDrones] = useState([
    { id: 'D-001', x: 30, y: 35, battery: 87, scanning: true },
    { id: 'D-002', x: 50, y: 50, battery: 62, scanning: true },
    { id: 'D-003', x: 65, y: 45, battery: 8, scanning: false },
    { id: 'D-005', x: 20, y: 65, battery: 94, scanning: true }
  ]);

  const [hazards] = useState([
    { id: 'H-001', x: 35, y: 25, type: 'fire', severity: 'high' },
    { id: 'H-002', x: 60, y: 70, type: 'flood', severity: 'medium' },
    { id: 'H-003', x: 80, y: 30, type: 'collapse', severity: 'high' }
  ]);

  const [rescueTeams, setRescueTeams] = useState([
    { id: 'RT-Alpha', x: 10, y: 80, status: 'available' },
    { id: 'RT-Beta', x: 85, y: 15, status: 'en-route' }
  ]);

  const [safeZones] = useState([
    { id: 'SZ-001', x: 5, y: 85, width: 15, height: 12 },
    { id: 'SZ-002', x: 80, y: 5, width: 18, height: 15 }
  ]);

  const [zoomLevel, setZoomLevel] = useState([100]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState({ x: 50, y: 50 });
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Simulate real-time drone movement
  useEffect(() => {
    const interval = setInterval(() => {
      setDrones(prev => prev.map(drone => ({
        ...drone,
        x: Math.max(5, Math.min(95, drone.x + (Math.random() - 0.5) * 3)),
        y: Math.max(5, Math.min(95, drone.y + (Math.random() - 0.5) * 3))
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const toggleLayer = (layerName: string) => {
    setMapLayers(prev => prev.map(layer => 
      layer.name === layerName ? { ...layer, active: !layer.active } : layer
    ));
  };

  const getVictimColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500';
      case 'injured': return 'bg-yellow-500';
      case 'deceased': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  const resetView = () => {
    setMapCenter({ x: 50, y: 50 });
    setZoomLevel([100]);
  };

  const filteredVictims = victims.filter(victim => 
    searchQuery === '' || victim.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg flex flex-col overflow-hidden">
      {/* Fixed Map Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-medium">Central Live 3D Map</h2>
            <Badge variant="outline" className="bg-green-500/20 border-green-500 text-green-400 animate-pulse">
              Digital Twin Active
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Search Toggle */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowSearch(!showSearch)}
              className={showSearch ? 'text-blue-400' : 'text-gray-400'}
            >
              <Search className="w-4 h-4" />
            </Button>
            
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-gray-700/50 rounded px-2 py-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setZoomLevel([Math.max(25, zoomLevel[0] - 25)])}
                className="p-1 h-auto"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="text-xs text-gray-300 px-2">{zoomLevel[0]}%</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setZoomLevel([Math.min(400, zoomLevel[0] + 25)])}
                className="p-1 h-auto"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetView}
              className="border-gray-600 text-gray-300"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="animate-in slide-in-from-top-2 duration-200">
            <Input
              placeholder="Search victims, drones, teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-700 border-gray-600"
            />
          </div>
        )}
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Enhanced Interactive Layer Toggles */}
        <div className="w-52 flex-shrink-0 border-r border-gray-700/50 flex flex-col overflow-hidden">
          <div className="flex-shrink-0 p-4 pb-2">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-medium text-gray-300">Interactive Layers</h3>
            </div>
          </div>
          
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="px-4 pb-4 space-y-3">
                {mapLayers.map((layer) => (
                  <div key={layer.name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full transition-all ${
                          layer.color === 'red' ? 'bg-red-500' :
                          layer.color === 'blue' ? 'bg-blue-500' :
                          layer.color === 'yellow' ? 'bg-yellow-500' :
                          layer.color === 'green' ? 'bg-green-500' :
                          'bg-purple-500'
                        } ${layer.active ? 'opacity-100' : 'opacity-40'}`} />
                        <span className={`text-sm transition-colors ${layer.active ? 'text-gray-300' : 'text-gray-500'}`}>
                          {layer.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{layer.count}</span>
                        <input 
                          type="checkbox" 
                          checked={layer.active}
                          onChange={() => toggleLayer(layer.name)}
                          className="w-4 h-4 rounded border-gray-600 bg-gray-700 cursor-pointer"
                        />
                      </div>
                    </div>
                    
                    {layer.active && (
                      <div className="ml-5 text-xs space-y-1 animate-in slide-in-from-left-2 duration-200">
                        {layer.name === 'Victims' && (
                          <div className="text-gray-400">
                            <div>Critical: {victims.filter(v => v.status === 'critical').length}</div>
                            <div>Injured: {victims.filter(v => v.status === 'injured').length}</div>
                          </div>
                        )}
                        {layer.name === 'Drones' && (
                          <div className="text-gray-400">
                            <div>Active: {drones.filter(d => d.scanning).length}</div>
                            <div>Low Battery: {drones.filter(d => d.battery < 20).length}</div>
                          </div>
                        )}
                        {layer.name === 'Hazards' && (
                          <div className="text-gray-400">
                            <div>High Risk: {hazards.filter(h => h.severity === 'high').length}</div>
                            <div>Medium Risk: {hazards.filter(h => h.severity === 'medium').length}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Fixed Zoom Slider */}
          <div className="flex-shrink-0 p-4 pt-2 border-t border-gray-700/50">
            <div className="text-xs text-gray-400 mb-2">Zoom Level</div>
            <Slider
              value={zoomLevel}
              onValueChange={setZoomLevel}
              max={400}
              min={25}
              step={25}
              className="w-full"
            />
          </div>
        </div>

        {/* Enhanced Main Map Area */}
        <div className="flex-1 relative bg-gray-900/30 overflow-hidden">
          {/* Interactive Map Grid */}
          <div 
            className="absolute inset-0 transition-opacity duration-200"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: `${20 * (zoomLevel[0] / 100)}px ${20 * (zoomLevel[0] / 100)}px`,
              opacity: zoomLevel[0] > 100 ? 0.2 : 0.1
            }}
          />

          {/* Disaster Zone with Animation */}
          <div className="absolute inset-4 border-2 border-dashed border-red-400/30 rounded-lg animate-pulse">
            <div className="absolute top-2 left-2 text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded">
              DISASTER ZONE - ACTIVE
            </div>
          </div>

          {/* Map Content Container with Zoom */}
          <div 
            className="absolute inset-0 transition-transform duration-300 ease-out"
            style={{ 
              transform: `scale(${zoomLevel[0] / 100}) translate(${(mapCenter.x - 50) * -2}px, ${(mapCenter.y - 50) * -2}px)`
            }}
          >
            {/* Safe Zones */}
            {mapLayers.find(l => l.name === 'Safe Zones')?.active && safeZones.map((zone) => (
              <div
                key={zone.id}
                className="absolute border-2 border-green-400/50 bg-green-400/10 rounded-lg flex items-center justify-center transition-all hover:bg-green-400/20 cursor-pointer"
                style={{
                  left: `${zone.x}%`,
                  top: `${zone.y}%`,
                  width: `${zone.width}%`,
                  height: `${zone.height}%`
                }}
                onClick={() => setSelectedItem({ type: 'safeZone', data: zone })}
              >
                <Shield className="w-4 h-4 text-green-400" />
                <div className="absolute -top-6 left-2 text-xs text-green-400 font-medium">
                  {zone.id}
                </div>
              </div>
            ))}

            {/* Victims with Enhanced Interaction */}
            {mapLayers.find(l => l.name === 'Victims')?.active && filteredVictims.map((victim) => (
              <Dialog key={victim.id}>
                <DialogTrigger asChild>
                  <div
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all hover:scale-110"
                    style={{ left: `${victim.x}%`, top: `${victim.y}%` }}
                  >
                    <div className={`w-4 h-4 rounded-full ${getVictimColor(victim.status)} animate-pulse shadow-lg`} />
                    <div className="absolute w-8 h-8 border-2 border-current rounded-full animate-ping opacity-20" />
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800/90 backdrop-blur text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity z-10">
                      {victim.id} - {victim.status} ({victim.confidence}%)
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="bg-gray-800 border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">Victim Details - {victim.id}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 text-white">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-400">Status</div>
                        <Badge className={getVictimColor(victim.status)}>{victim.status}</Badge>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">AI Confidence</div>
                        <div className="text-lg font-bold">{victim.confidence}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Location</div>
                        <div>X: {victim.x}%, Y: {victim.y}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Last Seen</div>
                        <div>{victim.lastSeen}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1">Assign Rescue Team</Button>
                      <Button variant="outline" className="flex-1">Mark as Priority</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}

            {/* Drones with Real-time Movement */}
            {mapLayers.find(l => l.name === 'Drones')?.active && drones.map((drone) => (
              <div
                key={drone.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all duration-1000 hover:scale-110"
                style={{ left: `${drone.x}%`, top: `${drone.y}%` }}
                onClick={() => setSelectedItem({ type: 'drone', data: drone })}
              >
                <div className={`w-3 h-3 bg-blue-500 rotate-45 transition-all ${drone.scanning ? 'animate-bounce' : ''}`} />
                <div className={`absolute w-8 h-8 border border-blue-400/30 rounded-full transition-all ${drone.scanning ? 'animate-ping' : ''}`} />
                {drone.battery < 20 && (
                  <div className="absolute w-10 h-10 border-2 border-red-400 rounded-full animate-pulse" />
                )}
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800/90 backdrop-blur text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity z-10">
                  {drone.id} - {drone.scanning ? 'Scanning' : 'Idle'} ({drone.battery}%)
                </div>
              </div>
            ))}

            {/* Interactive Hazards */}
            {mapLayers.find(l => l.name === 'Hazards')?.active && hazards.map((hazard) => (
              <div
                key={hazard.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all hover:scale-110"
                style={{ left: `${hazard.x}%`, top: `${hazard.y}%` }}
                onClick={() => setSelectedItem({ type: 'hazard', data: hazard })}
              >
                {hazard.type === 'fire' && <Flame className="w-5 h-5 text-red-500 animate-pulse" />}
                {hazard.type === 'flood' && <Droplets className="w-5 h-5 text-blue-500 animate-pulse" />}
                {hazard.type === 'collapse' && <Home className="w-5 h-5 text-yellow-500 animate-pulse" />}
                <div className={`absolute w-12 h-12 rounded-full animate-pulse opacity-20 ${
                  hazard.severity === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800/90 backdrop-blur text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap capitalize transition-opacity z-10">
                  {hazard.type} Hazard - {hazard.severity} risk
                </div>
              </div>
            ))}

            {/* Rescue Teams with Status */}
            {mapLayers.find(l => l.name === 'Rescue Teams')?.active && rescueTeams.map((team) => (
              <div
                key={team.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all hover:scale-110"
                style={{ left: `${team.x}%`, top: `${team.y}%` }}
                onClick={() => setSelectedItem({ type: 'team', data: team })}
              >
                <Users className={`w-5 h-5 ${team.status === 'available' ? 'text-green-500' : 'text-yellow-500'}`} />
                <div className={`absolute w-6 h-6 border rounded-full ${team.status === 'available' ? 'border-green-400/50' : 'border-yellow-400/50 animate-pulse'}`} />
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800/90 backdrop-blur text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity z-10">
                  {team.id} - {team.status}
                </div>
              </div>
            ))}
          </div>

          {/* Selection Info Overlay */}
          {selectedItem && (
            <div className="absolute top-4 right-4 bg-gray-800/90 backdrop-blur border border-gray-700 rounded-lg p-3 animate-in slide-in-from-right-2 duration-200">
              <div className="text-sm font-medium text-white mb-2">
                {selectedItem.type.charAt(0).toUpperCase() + selectedItem.type.slice(1)} Selected
              </div>
              <div className="text-xs text-gray-300 space-y-1">
                <div>ID: {selectedItem.data.id}</div>
                {selectedItem.data.status && <div>Status: {selectedItem.data.status}</div>}
                {selectedItem.data.battery && <div>Battery: {selectedItem.data.battery}%</div>}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedItem(null)}
                className="mt-2 w-full text-xs"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Map Footer with Coordinates */}
      <div className="p-3 border-t border-gray-700/50 flex justify-between text-xs text-gray-400">
        <span>Coordinates: 40.7589° N, 73.9851° W</span>
        <span>Scale: 1:5000 | Updated: Live</span>
      </div>
    </div>
  );
}