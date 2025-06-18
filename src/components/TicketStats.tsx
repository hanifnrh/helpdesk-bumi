import { Card } from "@/components/ui/card";
import { Ticket } from "@/types/ticket";
import {
  AlertTriangle,
  CircleCheckBig,
  Clock4,
  FolderOpen,
  OctagonMinus,
  TicketCheck,
} from "lucide-react";

interface TicketStatsProps {
  tickets: Ticket[];
}

export const TicketStats = ({ tickets }: TicketStatsProps) => {
  // Helper function to get status ID (handles both object and number cases)
  const getStatusId = (ticket: Ticket) => {
    if (typeof ticket.status === "object") {
      return ticket.status.id;
    }
    return ticket.status;
  };

  // Helper function to get priority ID (handles both object and number cases)
  const getPriorityId = (ticket: Ticket) => {
    if (typeof ticket.priority === "object") {
      return ticket.priority.id;
    }
    return ticket.priority;
  };

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => getStatusId(t) === 1).length,
    inProgress: tickets.filter((t) => getStatusId(t) === 2).length,
    resolved: tickets.filter((t) => getStatusId(t) === 3).length,
    critical: tickets.filter((t) => getPriorityId(t) === 4).length,
    closed: tickets.filter((t) => getStatusId(t) === 4).length,
  };

  return (
    <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-6 gap-4">
      <Card className="flex items-center justify-between gap-2 p-4">
        <div className="flex flex-col">
          <div className="text-xs sm:text-base flex flex-row items-center space-y-0 pb-2 gap-2">
            Total Tickets
          </div>

          <div className="text-2xl text-left font-bold">{stats.total}</div>
        </div>
        <TicketCheck className="w-6 h-auto text-muted-foreground" />
      </Card>

      <Card className="flex items-center justify-between gap-2 p-4">
        <div className="flex flex-col">
          <div className="text-xs sm:text-base flex flex-row items-center space-y-0 pb-2 gap-2">Open </div>

          <div className="text-2xl text-left font-bold text-blue-500">
            {stats.open}
          </div>
        </div>
        <FolderOpen className="w-6 h-auto text-blue-500" />
      </Card>

      <Card className="flex items-center justify-between gap-2 p-4">
        <div className="flex flex-col">
          <div className="text-xs sm:text-base flex flex-row items-center space-y-0 pb-2 gap-2">
            In Progress
          </div>

          <div className="text-2xl text-left font-bold text-yellow-500">
            {stats.inProgress}
          </div>
        </div>
        <Clock4 className="w-6 h-auto text-yellow-500" />
      </Card>

      <Card className="flex items-center justify-between gap-2 p-4">
        <div className="flex flex-col">
          <div className="text-xs sm:text-base flex flex-row items-center space-y-0 pb-2">
            Resolved
          </div>

          <div className="text-2xl text-left font-bold text-green-500">
            {stats.resolved}
          </div>
        </div>
        <CircleCheckBig className="w-6 h-auto text-green-500" />
      </Card>

      <Card className="flex items-center justify-between gap-2 p-4">
        <div className="flex flex-col">
          <div className="text-xs sm:text-base flex flex-row items-center space-y-0 pb-2">
            Closed
          </div>

          <div className="text-2xl text-left font-bold text-zinc-500">
            {stats.closed}
          </div>
        </div>
        <OctagonMinus className="w-6 h-auto text-zinc-500" />
      </Card>

      <Card className="flex items-center justify-between gap-2 p-4">
        <div className="flex flex-col">
          <div className="text-xs sm:text-base flex flex-row items-center space-y-0 pb-2">
            Critical
          </div>

          <div className="text-2xl text-left font-bold text-red-500">
            {stats.critical}
          </div>
        </div>
        <AlertTriangle className="w-6 h-auto text-red-500" />
      </Card>
    </div>
  );
};
