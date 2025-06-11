import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ticket } from '@/types/ticket';
import { Calendar, User, Tag, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface TicketCardProps {
  ticket: Ticket;
  onStatusChange: (ticketId: string, status: Ticket['status']) => void;
  onAssigneeChange: (ticketId: string, assignee: string) => void;
  onClick: (ticket: Ticket) => void;
  isAdmin?: boolean;
}

const statusColors = {
  open: 'bg-blue-100 text-blue-800 border-blue-200',
  'in-progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  resolved: 'bg-green-100 text-green-800 border-green-200',
  closed: 'bg-gray-100 text-gray-800 border-gray-200'
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
};

export const TicketCard = ({ ticket, onStatusChange, onAssigneeChange, onClick, isAdmin = false }: TicketCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1" onClick={() => onClick(ticket)}>
            <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {ticket.title}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {ticket.description}
            </p>
          </div>
          <Badge className={`${priorityColors[ticket.priority]} font-medium ml-3`}>
            {ticket.priority.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Status and Category */}
          <div className="flex items-center justify-between">
            <Badge className={statusColors[ticket.status]}>
              {ticket.status.replace('-', ' ').toUpperCase()}
            </Badge>
            <span className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded">
              {ticket.category}
            </span>
          </div>

          {/* Tags */}
          {ticket.tags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              <Tag className="h-3 w-3 text-gray-400" />
              {ticket.tags.map((tag, index) => (
                <span key={index} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Reporter and Date */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{ticket.reporter}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{format(ticket.createdAt, 'MMM dd, yyyy')}</span>
            </div>
          </div>

          {/* Status and Assignee Controls - Only for Admin */}
          {isAdmin && (
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <Select value={ticket.status} onValueChange={(status) => onStatusChange(ticket.id, status as Ticket['status'])}>
                <SelectTrigger className="h-8 text-xs bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={ticket.assignee || 'unassigned'} onValueChange={(assignee) => onAssigneeChange(ticket.id, assignee)}>
                <SelectTrigger className="h-8 text-xs bg-white flex-1">
                  <SelectValue placeholder="Assign to..." />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  <SelectItem value="ICT Department">ICT Department</SelectItem>
                  <SelectItem value="General Affair">General Affair</SelectItem>
                  <SelectItem value="Human Capital">Human Capital</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
