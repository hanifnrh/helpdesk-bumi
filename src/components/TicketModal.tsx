import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ticket } from "@/types/ticket";
import { format } from "date-fns";
import { Calendar, FileText, Tag, User } from "lucide-react";

interface TicketModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (ticketId: string, status: number) => void;
  onAssigneeChange?: (ticketId: string, assignee: number) => void;
  isAdmin?: boolean;
}

export const TicketModal = ({
  ticket,
  isOpen,
  onClose,
  onStatusChange = () => {},
  onAssigneeChange = () => {},
  isAdmin = false,
}: TicketModalProps) => {
  if (!ticket) return null;

  // Helper function to get display name
  const getDisplayName = (field: any) => {
    if (!field) return "N/A";
    if (typeof field === "object") {
      if ("category_name" in field) return field.category_name;
      if ("priority_name" in field) return field.priority_name;
      if ("status_name" in field) return field.status_name;
      if ("assignee_name" in field) return field.assignee_name;
      if ("branch_name" in field) return field.branch_name;
      if ("service_name" in field) return field.service_name;
      if ("subcategory_name" in field) return field.subcategory_name;
      if ("network_name" in field) return field.network_name;
      return field.name || "N/A";
    }
    return field.toString();
  };

  // Get status color based on status ID
  const getStatusColor = (statusId: number) => {
    switch (statusId) {
      case 1:
        return "bg-blue-100 text-blue-500 hover:bg-blue-200 hover:text-blue-700 cursor-pointer";
      case 2:
        return "bg-yellow-100 text-yellow-500 hover:bg-yellow-200 hover:text-yellow-700 cursor-pointer";
      case 3:
        return "bg-green-100 text-green-500 hover:bg-green-200 hover:text-green-700 cursor-pointer";
      case 4:
        return "bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-700 cursor-pointer";
      default:
        return "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 cursor-pointer";
    }
  };

  // Get priority color based on priority ID
  const getPriorityColor = (priorityId: number) => {
    switch (priorityId) {
      case 1:
        return "bg-green-100 text-green-500 hover:bg-green-200 hover:text-green-700 cursor-pointer";
      case 2:
        return "bg-blue-100 text-blue-500 hover:bg-blue-200 hover:text-blue-700 cursor-pointer";
      case 3:
        return "bg-orange-100 text-orange-500 hover:bg-orange-200 hover:text-orange-700 cursor-pointer";
      case 4:
        return "bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-700 cursor-pointer";
      default:
        return "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 cursor-pointer";
    }
  };

  // Get status text based on status ID
  const getStatusText = (statusId: number) => {
    switch (statusId) {
      case 1:
        return "OPEN";
      case 2:
        return "IN PROGRESS";
      case 3:
        return "RESOLVED";
      case 4:
        return "CLOSED";
      default:
        return "N/A";
    }
  };

  // Get priority text based on priority ID
  const getPriorityText = (priorityId: number) => {
    switch (priorityId) {
      case 1:
        return "LOW";
      case 2:
        return "MEDIUM";
      case 3:
        return "HIGH";
      case 4:
        return "CRITICAL";
      default:
        return "N/A";
    }
  };

  // Get tags array
  const tags = ticket.tags ? ticket.tags.split(",").map((t) => t.trim()) : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dmsans-regular">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 pr-8">
            {ticket.subject || ticket.title || "No Title"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with Priority and Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge
                className={`${getPriorityColor(
                  typeof ticket.priority === "object"
                    ? ticket.priority.id
                    : ticket.priority
                )} `}
              >
                {getPriorityText(
                  typeof ticket.priority === "object"
                    ? ticket.priority.id
                    : ticket.priority
                )}{" "}
                PRIORITY
              </Badge>
              <Badge
                className={getStatusColor(
                  typeof ticket.status === "object"
                    ? ticket.status.id
                    : ticket.status
                )}
              >
                {getStatusText(
                  typeof ticket.status === "object"
                    ? ticket.status.id
                    : ticket.status
                )}
              </Badge>
              <span className="text-sm text-zinc-500 bg-zinc-100 hover:text-zinc-700 hover:bg-zinc-200 px-3 py-1 rounded-full cursor-pointer">
                {getDisplayName(ticket.category)}
              </span>
            </div>
            <span className="text-sm text-gray-500 uppercase">
              #{ticket.id.slice(0, 8)}
            </span>
          </div>

          {/* Ticket Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-600">Branch:</span>
              <p className="text-sm text-gray-900">
                {getDisplayName(ticket.branch)}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-600">
                Services:
              </span>
              <p className="text-sm text-gray-900">
                {getDisplayName(ticket.services)}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-600">
                Sub-Category:
              </span>
              <p className="text-sm text-gray-900">
                {getDisplayName(ticket.subcategory)}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-600">
                Network/System:
              </span>
              <p className="text-sm text-gray-900">
                {getDisplayName(ticket.network)}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-600">
                Created:
              </span>
              <p className="text-sm text-gray-900">
                {format(new Date(ticket.created_at), "MMM dd, yyyy HH:mm")}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Description</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">
                {ticket.description || "No description provided"}
              </p>
            </div>
          </div>

          {/* File Attachment */}
          {ticket.attachment && (
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Attachment</h3>
              <div className="bg-gray-50 hover:bg-blue-100 cursor-pointer p-3 text-blue-600 rounded-lg flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <a
                  href={ticket.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm"
                >
                  View Attachment
                </a>
              </div>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="space-y-2 cursor-pointer">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-sm bg-orange-100 text-orange-500 px-3 py-1 rounded-full"
                  >
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
                  <span className="font-medium">
                    {typeof ticket.profile === "object"
                      ? ticket.profile.name
                      : "User"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Assignee:</span>
                  <span className="font-medium">
                    {getDisplayName(ticket.assignee) || "Unassigned"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">
                    {format(new Date(ticket.created_at), "MMM dd, yyyy HH:mm")}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions - Only for Admin */}
            {isAdmin && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Actions</h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">
                      Status
                    </label>
                    <Select
                      value={(typeof ticket.status === "object"
                        ? ticket.status.id
                        : ticket.status
                      )?.toString()}
                      onValueChange={(value) =>
                        onStatusChange(ticket.id, parseInt(value))
                      }
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="1">Open</SelectItem>
                        <SelectItem value="2">In Progress</SelectItem>
                        <SelectItem value="3">Resolved</SelectItem>
                        <SelectItem value="4">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 block mb-1">
                      Assignee
                    </label>
                    <Select
                      value={
                        (typeof ticket.assignee === "object"
                          ? ticket.assignee.id
                          : ticket.assignee
                        )?.toString() || "0"
                      }
                      onValueChange={(value) =>
                        onAssigneeChange(ticket.id, parseInt(value))
                      }
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="0">Unassigned</SelectItem>
                        <SelectItem value="1">ICT Department</SelectItem>
                        <SelectItem value="2">General Affair</SelectItem>
                        <SelectItem value="3">Human Capital</SelectItem>
                        <SelectItem value="4">Others</SelectItem>
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
