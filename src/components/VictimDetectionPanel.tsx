import { useState, useEffect } from 'react';
import { Search, Clock, MapPin, Brain, Filter, SortAsc, Eye, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function VictimDetectionPanel() {
  const [victims, setVictims] = useState([
    {
      id: 'V-001',
      location: 'Sector A7',
      status: 'Critical',
      condition: 'Unconscious',
      aiConfidence: 94,
      rescueStatus: 'Pending',
      priority: 1,
      detectedTime: '3m ago',
      vitals: { heartRate: 45, breathing: 'weak' },
      assignedTeam: null
    },
    {
      id: 'V-002',
      location: 'Sector B3',
      status: 'Injured',
      condition: 'Conscious, Trapped',
      aiConfidence: 87,
      rescueStatus: 'In Progress',
      priority: 2,
      detectedTime: '8m ago',
      vitals: { heartRate: 78, breathing: 'stable' },
      assignedTeam: 'RT-Beta'
    },
    {
      id: 'V-003',
      location: 'Sector C1',
      status: 'Deceased',
      condition: 'No Vital Signs',
      aiConfidence: 91,
      rescueStatus: 'Confirmed',
      priority: 3,
      detectedTime: '15m ago',
      vitals: { heartRate: 0, breathing: 'none' },
      assignedTeam: null
    },
    {
      id: 'V-004',
      location: 'Sector A9',
      status: 'Critical',
      condition: 'Weak Vitals',
      aiConfidence: 89,
      rescueStatus: 'Pending',
      priority: 1,
      detectedTime: '1m ago',
      vitals: { heartRate: 52, breathing: 'irregular' },
      assignedTeam: null
    },
    {
      id: 'V-005',
      location: 'Sector D2',
      status: 'Stable',
      condition: 'Minor Injuries',
      aiConfidence: 76,
      rescueStatus: 'Rescued',
      priority: 4,
      detectedTime: '22m ago',
      vitals: { heartRate: 82, breathing: 'normal' },
      assignedTeam: 'RT-Alpha'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [selectedVictim, setSelectedVictim] = useState<string | null>(null);

  // Auto-refresh victim data
  useEffect(() => {
    const interval = setInterval(() => {
      setVictims(prev => prev.map(victim => {
        if (victim.status === 'Deceased' || victim.rescueStatus === 'Rescued') return victim;
        
        // Simulate vitals changes for alive victims
        const heartRateChange = Math.random() > 0.8 ? (Math.random() - 0.5) * 10 : 0;
        const newHeartRate = Math.max(0, Math.min(120, victim.vitals.heartRate + heartRateChange));
        
        return {
          ...victim,
          vitals: {
            ...victim.vitals,
            heartRate: newHeartRate
          },
          aiConfidence: Math.max(70, Math.min(99, victim.aiConfidence + (Math.random() - 0.5) * 2))
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const filteredAndSortedVictims = () => {
    let filtered = victims.filter(victim => {
      const matchesSearch = victim.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           victim.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || victim.status.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          return a.priority - b.priority;
        case 'confidence':
          return b.aiConfidence - a.aiConfidence;
        case 'time':
          return parseInt(a.detectedTime) - parseInt(b.detectedTime);
        default:
          return 0;
      }
    });
  };

  const assignTeam = (victimId: string) => {
    setVictims(prev => prev.map(victim => 
      victim.id === victimId 
        ? { ...victim, rescueStatus: 'In Progress', assignedTeam: 'RT-Charlie' }
        : victim
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critical': return 'bg-red-500/20 border-red-500 text-red-400';
      case 'Injured': return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
      case 'Deceased': return 'bg-gray-500/20 border-gray-500 text-gray-400';
      default: return 'bg-blue-500/20 border-blue-500 text-blue-400';
    }
  };

  const getRescueStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-red-500/20 border-red-500 text-red-400';
      case 'In Progress': return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
      case 'Rescued': return 'bg-green-500/20 border-green-500 text-green-400';
      case 'Confirmed Safe': return 'bg-blue-500/20 border-blue-500 text-blue-400';
      default: return 'bg-gray-500/20 border-gray-500 text-gray-400';
    }
  };

  const visibleVictims = filteredAndSortedVictims();

  return (
    <div className="h-full bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg flex flex-col">
      {/* Enhanced Header */}
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-medium">Victim Detection & Rescue Queue</h2>
          </div>
          <Badge variant="outline" className="bg-blue-500/20 border-blue-500 text-blue-400">
            AI Scanning
          </Badge>
        </div>

        {/* Search and Filters */}
        <div className="space-y-2 mb-3">
          <div className="flex gap-2">
            <Input
              placeholder="Search victims..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-gray-700 border-gray-600 text-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="injured">Injured</SelectItem>
                <SelectItem value="stable">Stable</SelectItem>
                <SelectItem value="deceased">Deceased</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <SortAsc className="w-4 h-4 text-gray-400" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-36 bg-gray-700 border-gray-600 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="confidence">AI Confidence</SelectItem>
                <SelectItem value="time">Detection Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex gap-4 text-sm text-gray-300">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Critical: {victims.filter(v => v.status === 'Critical').length}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span>Injured: {victims.filter(v => v.status === 'Injured').length}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Stable: {victims.filter(v => v.status === 'Stable').length}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-500" />
            <span>Deceased: {victims.filter(v => v.status === 'Deceased').length}</span>
          </div>
        </div>
      </div>

      {/* Enhanced Victims List */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-3">
            {visibleVictims.map((victim) => (
              <div 
                key={victim.id} 
                className={`bg-gray-700/30 rounded-lg p-3 border transition-all duration-200 cursor-pointer hover:bg-gray-700/50 ${
                  selectedVictim === victim.id ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600/50'
                }`}
                onClick={() => setSelectedVictim(selectedVictim === victim.id ? null : victim.id)}
              >
                {/* Header Row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{victim.id}</span>
                    <Badge className={`${getStatusColor(victim.status)} text-xs`}>
                      {victim.status}
                    </Badge>
                    {victim.priority === 1 && (
                      <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-purple-400">{victim.aiConfidence.toFixed(1)}%</span>
                  </div>
                </div>

                {/* Location & Condition */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{victim.location}</span>
                  </div>
                  <div className="text-sm text-gray-300">{victim.condition}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>Detected {victim.detectedTime}</span>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedVictim === victim.id && (
                  <div className="space-y-3 mb-3 animate-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="text-gray-400">Vitals</div>
                        <div className="text-white">
                          HR: <span className={victim.vitals.heartRate > 0 ? victim.vitals.heartRate < 60 ? 'text-yellow-400' : 'text-green-400' : 'text-red-400'}>
                            {victim.vitals.heartRate} bpm
                          </span>
                        </div>
                        <div className="text-white">
                          Breathing: <span className={
                            victim.vitals.breathing === 'normal' ? 'text-green-400' :
                            victim.vitals.breathing === 'stable' ? 'text-yellow-400' :
                            victim.vitals.breathing === 'weak' || victim.vitals.breathing === 'irregular' ? 'text-orange-400' :
                            'text-red-400'
                          }>
                            {victim.vitals.breathing}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-gray-400">Assignment</div>
                        {victim.assignedTeam ? (
                          <div className="text-green-400">{victim.assignedTeam}</div>
                        ) : (
                          <div className="text-gray-400">Unassigned</div>
                        )}
                        <div className="text-xs text-gray-400">
                          Priority Level {victim.priority}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rescue Status & Priority */}
                <div className="flex items-center justify-between">
                  <Badge className={`${getRescueStatusColor(victim.rescueStatus)} text-xs`}>
                    {victim.rescueStatus}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Priority:</span>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      victim.priority === 1 ? 'bg-red-500 text-white animate-pulse' :
                      victim.priority === 2 ? 'bg-yellow-500 text-black' :
                      victim.priority === 3 ? 'bg-orange-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {victim.priority}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-3">
                  {victim.rescueStatus === 'Pending' && (
                    <Button 
                      size="sm" 
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        assignTeam(victim.id);
                      }}
                    >
                      Assign Team
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-400 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Focus on victim in map
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Enhanced Footer Stats */}
      <div className="p-3 border-t border-gray-700/50 text-xs text-gray-400">
        <div className="flex justify-between items-center">
          <span>Showing {visibleVictims.length} of {victims.length} detected</span>
          <div className="flex items-center gap-4">
            <span>Avg Confidence: {(victims.reduce((acc, v) => acc + v.aiConfidence, 0) / victims.length).toFixed(1)}%</span>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-400" />
              <span>{victims.filter(v => v.rescueStatus === 'Rescued').length} Rescued</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}