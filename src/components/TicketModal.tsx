import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ticket } from '@/types/ticket';
import { Calendar, User, Tag, Clock, Edit } from 'lucide-react';
import { format } from 'date-fns';

interface TicketModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (ticketId: string, status: Ticket['status']) => void;
  onAssigneeChange: (ticketId: string, assignee: string) => void;
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

export const TicketModal = ({ ticket, isOpen, onClose, onStatusChange, onAssigneeChange, isAdmin = false }: TicketModalProps) => {
  if (!ticket) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 pr-8">
            {ticket.subject || ticket.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with Priority and Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className={`${priorityColors[ticket.priority]} font-medium`}>
                {ticket.priority.toUpperCase()} PRIORITY
              </Badge>
              <Badge className={statusColors[ticket.status]}>
                {ticket.status.replace('-', ' ').toUpperCase()}
              </Badge>
              <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                {ticket.category}
              </span>
            </div>
            <span className="text-sm text-gray-500">#{ticket.ticketID || ticket.id}</span>
          </div>

          {/* Ticket Information Grid - Hide code field */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-600">Branch:</span>
              <p className="text-sm text-gray-900">{ticket.branch || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-600">Services:</span>
              <p className="text-sm text-gray-900">{ticket.services || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-600">Sub-Category:</span>
              <p className="text-sm text-gray-900">{ticket.subCategory || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-600">Network/System:</span>
              <p className="text-sm text-gray-900">{ticket.network || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-600">Timestamp:</span>
              <p className="text-sm text-gray-900">{ticket.timestamp ? format(ticket.timestamp, 'MMM dd, yyyy HH:mm') : 'N/A'}</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Description</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
            </div>
          </div>

          {/* File Attachment */}
          {ticket.ticketFile && (
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Attachment</h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">📎 {ticket.ticketFile.name}</p>
              </div>
            </div>
          )}

          {/* Tags */}
          {ticket.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {ticket.tags.map((tag, index) => (
                  <span key={index} className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Ticket Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Reporter:</span>
                  <span className="font-medium">{ticket.reporter}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600 ml-6">Email:</span>
                  <span className="font-medium">{ticket.reporterEmail}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600 ml-6">Phone:</span>
                  <span className="font-medium">{ticket.reporterPhone}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Assignee:</span>
                  <span className="font-medium">{ticket.assignee || 'Unassigned'}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">{format(ticket.createdAt, 'MMM dd, yyyy HH:mm')}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Updated:</span>
                  <span className="font-medium">{format(ticket.updatedAt, 'MMM dd, yyyy HH:mm')}</span>
                </div>
              </div>
            </div>

            {/* Actions - Only for Admin */}
            {isAdmin && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Actions</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Status</label>
                    <Select value={ticket.status} onValueChange={(status) => onStatusChange(ticket.id, status as Ticket['status'])}>
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Assignee</label>
                    <Select value={ticket.assignee || 'unassigned'} onValueChange={(assignee) => onAssigneeChange(ticket.id, assignee)}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select assignee" />
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
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
