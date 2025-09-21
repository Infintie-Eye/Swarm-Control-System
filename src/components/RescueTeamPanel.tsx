import { Users, Navigation, Route, MessageSquare, Clock } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';

export function RescueTeamPanel() {
  const rescueTeams = [
    {
      id: 'RT-Alpha',
      members: 4,
      location: 'Base Camp',
      status: 'Available',
      eta: null,
      assignedVictim: null,
      route: 'Standby',
      lastUpdate: '2m ago'
    },
    {
      id: 'RT-Beta',
      members: 3,
      location: 'Sector B3',
      status: 'En Route',
      eta: '4 min',
      assignedVictim: 'V-002',
      route: 'AI Recommended Path',
      lastUpdate: '30s ago'
    },
    {
      id: 'RT-Charlie',
      members: 5,
      location: 'Sector A7',
      status: 'Rescuing',
      eta: null,
      assignedVictim: 'V-001',
      route: 'Direct Path',
      lastUpdate: '1m ago'
    }
  ];

  const communications = [
    {
      id: 1,
      team: 'RT-Beta',
      message: 'Approaching victim location',
      timestamp: '30s ago'
    },
    {
      id: 2,
      team: 'RT-Charlie',
      message: 'Victim secured, requesting medical',
      timestamp: '1m ago'
    },
    {
      id: 3,
      team: 'RT-Alpha',
      message: 'Standing by for assignment',
      timestamp: '2m ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-500/20 border-green-500 text-green-400';
      case 'En Route': return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
      case 'Rescuing': return 'bg-red-500/20 border-red-500 text-red-400';
      default: return 'bg-gray-500/20 border-gray-500 text-gray-400';
    }
  };

  return (
    <div className="h-full bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-lg flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-700/50">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-medium">Rescue Team Coordination</h2>
        </div>
        <div className="text-sm text-gray-300">
          3 Teams • 12 Members • Live GPS Tracking
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {/* Teams Section */}
            <div>
              <h3 className="text-sm font-medium mb-3 text-gray-300">Active Teams</h3>
              <div className="space-y-3">
                {rescueTeams.map((team) => (
                  <div key={team.id} className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
                    {/* Team Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{team.id}</span>
                        <Badge className={`${getStatusColor(team.status)} text-xs`}>
                          {team.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-400">{team.members} members</div>
                    </div>

                    {/* Location & Assignment */}
                    <div className="space-y-1 mb-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Navigation className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-300">{team.location}</span>
                      </div>
                      {team.assignedVictim && (
                        <div className="text-yellow-400">
                          → Assigned to {team.assignedVictim}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Route className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-300">{team.route}</span>
                      </div>
                    </div>

                    {/* ETA & Actions */}
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-400">
                        Updated {team.lastUpdate}
                      </div>
                      {team.eta && (
                        <div className="text-xs text-yellow-400 font-medium">
                          ETA: {team.eta}
                        </div>
                      )}
                    </div>

                    {/* Progress for En Route teams */}
                    {team.status === 'En Route' && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">Progress to target</span>
                          <span className="text-gray-300">65%</span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                    )}

                    {/* Quick Actions */}
                    {team.status === 'Available' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full mt-2 border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Quick Assign
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Communications Log */}
            <div>
              <h3 className="text-sm font-medium mb-3 text-gray-300 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Communication Logs
              </h3>
              <div className="space-y-2">
                {communications.map((comm) => (
                  <div key={comm.id} className="bg-gray-700/20 rounded p-2 border-l-2 border-blue-500">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-blue-400">{comm.team}</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {comm.timestamp}
                      </span>
                    </div>
                    <div className="text-sm text-gray-300">{comm.message}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Fixed Footer */}
      <div className="flex-shrink-0 p-3 border-t border-gray-700/50 flex gap-2">
        <Button size="sm" variant="outline" className="flex-1 border-gray-600 text-gray-300">
          Broadcast All
        </Button>
        <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
          Deploy New Team
        </Button>
      </div>
    </div>
  );
}