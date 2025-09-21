import { useState, useEffect } from 'react';
import { AlertTriangle, Info, Zap, Bell, X, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

export function AlertsPanel() {
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'critical', message: 'Drone D-003 Battery Critical (8%)', time: '2m ago', dismissed: false },
    { id: 2, type: 'important', message: 'New Victim Detected - Sector A7', time: '5m ago', dismissed: false },
    { id: 3, type: 'info', message: 'Rescue Team Alpha En Route', time: '12m ago', dismissed: false },
    { id: 4, type: 'critical', message: 'Communication Lost with D-004', time: '15m ago', dismissed: false },
    { id: 5, type: 'important', message: 'Weather Alert: High Winds Detected', time: '18m ago', dismissed: false },
  ]);

  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimated, setIsAnimated] = useState(true);

  // Auto-rotate alerts
  useEffect(() => {
    if (!isAnimated) return;
    
    const timer = setInterval(() => {
      const visibleAlerts = getFilteredAlerts();
      if (visibleAlerts.length > 3) {
        setCurrentPage((prev) => (prev + 1) % Math.ceil(visibleAlerts.length / 3));
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [alerts, filter, isAnimated]);

  const getFilteredAlerts = () => {
    return alerts.filter(alert => !alert.dismissed && (filter === 'all' || alert.type === filter));
  };

  const dismissAlert = (id: number) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, dismissed: true } : alert
    ));
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-500/20 border-red-500 text-red-400 animate-pulse';
      case 'important': return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
      default: return 'bg-blue-500/20 border-blue-500 text-blue-400';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'important': return <Zap className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const visibleAlerts = getFilteredAlerts();
  const alertsToShow = visibleAlerts.slice(currentPage * 3, (currentPage + 1) * 3);
  const totalPages = Math.ceil(visibleAlerts.length / 3);

  return (
    <div className="h-full bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-4 pb-2 border-b border-gray-700/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-medium">Real-time Alerts & Notifications</h2>
            <Badge variant="outline" className="bg-green-500/20 border-green-500 text-green-400">
              {visibleAlerts.length} Active
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Filter Dropdown */}
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white"
            >
              <option value="all">All</option>
              <option value="critical">Critical</option>
              <option value="important">Important</option>
              <option value="info">Info</option>
            </select>

            {/* Auto-rotate toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAnimated(!isAnimated)}
              className={`text-xs ${isAnimated ? 'text-green-400' : 'text-gray-400'}`}
            >
              Auto
            </Button>

            {/* Navigation */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="text-gray-400 hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-xs text-gray-400 px-2">
                  {currentPage + 1}/{totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="text-gray-400 hover:text-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Scrollable Content Area */}
      <div className="flex-1 min-h-0 p-4 pt-2">
        <ScrollArea className="h-full">
          <div className="flex flex-wrap gap-3">
            {alertsToShow.length > 0 ? (
              alertsToShow.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${getAlertColor(alert.type)} min-w-fit whitespace-nowrap transition-all duration-300 hover:scale-105 group cursor-pointer`}
                >
                  {getAlertIcon(alert.type)}
                  <span className="font-medium">{alert.message}</span>
                  <span className="text-xs opacity-70">{alert.time}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      dismissAlert(alert.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto text-gray-400 hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-sm">No alerts matching current filter</div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}