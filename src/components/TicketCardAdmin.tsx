import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Ticket } from "@/types/ticket";
import { format } from "date-fns";
import { Calendar, Tag, User } from "lucide-react";

interface TicketCardAdminProps {
    ticket: Ticket;
    onStatusChange: (ticketId: string, status: number) => void;
    onAssigneeChange: (ticketId: string, assignee: number) => void;
    onClick: (ticket: Ticket) => void;
    isAdmin?: boolean;
}

// Map status IDs to display values
const statusMap: Record<number, { text: string; color: string }> = {
    1: { text: "OPEN", color: "bg-blue-100 text-blue-500" },
    2: {
        text: "IN PROGRESS",
        color: "bg-yellow-100 text-yellow-500",
    },
    3: {
        text: "RESOLVED",
        color: "bg-green-100 text-green-500",
    },
    4: { text: "CLOSED", color: "bg-gray-100 text-gray-500" },
};

// Map priority IDs to display values
const priorityMap: Record<number, { text: string; color: string }> = {
    1: { text: "LOW", color: "bg-green-100 text-green-500" },
    2: { text: "MEDIUM", color: "bg-blue-100 text-blue-500" },
    3: { text: "HIGH", color: "bg-orange-100 text-orange-500" },
    4: { text: "CRITICAL", color: "bg-red-100 text-red-500" },
};

export const TicketCardAdmin = ({
    ticket,
    onStatusChange,
    onAssigneeChange,
    onClick,
    isAdmin = false,
}: TicketCardAdminProps) => {
    // Helper to get display name from relation (could be ID or joined object)
    const getDisplayName = (field: any) => {
        if (!field) return "N/A";
        if (typeof field === "object") return field.name || "N/A";
        return field.toString();
    };

    const tags = ticket.tags ? ticket.tags.split(",").map((t) => t.trim()) : [];

    // Get status info - handle both ID and joined object
    const statusInfo =
        typeof ticket.status === "object"
            ? statusMap[ticket.status.id] || statusMap[1]
            : statusMap[ticket.status] || statusMap[1];

    // Get priority info - handle both ID, joined object, and null cases
    const priorityInfo = (() => {
        if (!ticket.priority) return null;

        if (typeof ticket.priority === "object") {
            return priorityMap[ticket.priority.id] || null;
        }

        return priorityMap[ticket.priority] || null;
    })();

    return (
        <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1" onClick={() => onClick(ticket)}>
                        <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {ticket.title || "No title"}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {ticket.description || "No description provided"}
                        </p>
                    </div>
                    <Badge
                        className={`${priorityInfo?.color || "bg-gray-100 text-gray-800"
                            } font-medium ml-3`}
                    >
                        {priorityInfo?.text || "N/A"}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                <div className="space-y-3">
                    {/* Status and Category */}
                    <div className="flex items-center justify-between">
                        <Badge className={statusInfo.color}>{statusInfo.text}</Badge>
                        <span className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded">
                            {getDisplayName(ticket.category)}
                        </span>
                    </div>

                    {/* Tags */}
                    {tags.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                            <Tag className="h-3 w-3 text-gray-400" />
                            {tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="text-xs bg-zinc-100 text-zinc-800 px-2 py-1 rounded"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Reporter and Date */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>
                                {typeof ticket.profile === "object"
                                    ? ticket.profile.name
                                    : "User"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{format(new Date(ticket.created_at), "MMM dd, yyyy")}</span>
                        </div>
                    </div>

                    {/* Status and Assignee Controls - Only for Admin */}
                    {isAdmin && (
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                            <Select
                                value={
                                    typeof ticket.status === "object"
                                        ? ticket.status.id.toString()
                                        : ticket.status?.toString()
                                }
                                onValueChange={(status) =>
                                    onStatusChange(ticket.id, parseInt(status))
                                }
                            >
                                <SelectTrigger className="h-8 text-xs bg-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                                    {Object.entries(statusMap).map(([id, { text }]) => (
                                        <SelectItem key={id} value={id}>
                                            {text}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={
                                    typeof ticket.assignee === "object"
                                        ? ticket.assignee.id.toString()
                                        : ticket.assignee?.toString() || "0"
                                }
                                onValueChange={(assignee) =>
                                    onAssigneeChange(ticket.id, parseInt(assignee))
                                }
                            >
                                <SelectTrigger className="h-8 text-xs bg-white flex-1">
                                    <SelectValue placeholder="Assign to..." />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                                    <SelectItem value="0">Unassigned</SelectItem>
                                    {/* These should come from your assignees dropdown options */}
                                    <SelectItem value="1">ICT Department</SelectItem>
                                    <SelectItem value="2">General Affair</SelectItem>
                                    <SelectItem value="3">Human Capital</SelectItem>
                                    <SelectItem value="4">Others</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
