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
import { useEffect } from "react";

interface AdminTicketCardProps {
    ticket: Ticket;
    onClick: (ticket: Ticket) => void;
    onStatusChange: (ticketId: string, status: number) => void;
    onAssigneeChange: (ticketId: string, assignee: number) => void;
}

// Map status IDs to display values
const statusMap: Record<number, { text: string; color: string }> = {
    1: { text: "OPEN", color: "bg-blue-100 text-blue-500 hover:bg-blue-200 hover:text-blue-700 cursor-pointer transition-all" },
    2: { text: "IN PROGRESS", color: "bg-yellow-100 text-yellow-500 hover:bg-yellow-200 hover:text-yellow-700 cursor-pointer transition-all" },
    3: { text: "RESOLVED", color: "bg-green-100 text-green-500 hover:bg-green-200 hover:text-green-700 cursor-pointer transition-all" },
    4: { text: "CLOSED", color: "bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-700 cursor-pointer transition-all" },
};

// Map priority IDs to display values
const priorityMap: Record<number, { text: string; color: string }> = {
    1: { text: "LOW", color: "bg-green-100 text-green-500 hover:bg-green-200 hover:text-green-700 cursor-pointer transition-all" },
    2: { text: "MEDIUM", color: "bg-blue-100 text-blue-500 hover:bg-blue-200 hover:text-blue-700 cursor-pointer transition-all" },
    3: { text: "HIGH", color: "bg-yellow-100 text-yellow-500 hover:bg-yellow-200 hover:text-yellow-700 cursor-pointer transition-all" },
    4: { text: "CRITICAL", color: "bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-700 cursor-pointer transition-all" },
};

export const AdminTicketCard = ({
    ticket,
    onClick,
    onStatusChange,
    onAssigneeChange,
}: AdminTicketCardProps) => {

    const getDisplayName = (field: any) => {
        if (!field) return "N/A";
        if (typeof field === "object") {
            if ("category_name" in field) return field.category_name;
            if ("assignee_name" in field) return field.assignee_name;
            return field.name || field.status_name || field.priority_name || "N/A";
        }
        return field.toString();
    };

    const getStatusId = () => {
        if (!ticket.status) return 1;
        if (typeof ticket.status === "object") return ticket.status.id;
        return ticket.status;
    };

    const getPriorityId = () => {
        if (!ticket.priority) return 2;
        if (typeof ticket.priority === "object") return ticket.priority.id;
        return ticket.priority;
    };

    const getAssigneeId = () => {
        if (!ticket.assignee) return "0";
        if (typeof ticket.assignee === "object")
            return ticket.assignee.id.toString();
        return ticket.assignee.toString();
    };

    useEffect(() => {
        if (ticket) {
            console.log("Ticket profile data:", ticket.profile);
            console.log("Full ticket data:", ticket);
        }
    }, [ticket]);

    const tags = ticket.tags ? ticket.tags.split(",").map((t) => t.trim()) : [];
    const statusId = getStatusId();
    const priorityId = getPriorityId();
    const assigneeId = getAssigneeId();
    const reporterName =
        ticket.profile && typeof ticket.profile === "object"
            ? ticket.profile.name
            : typeof ticket.profile === "string"
                ? ticket.profile
                : "Unknown";

    const handleStatusChange = (value: string) => {
        onStatusChange(ticket.id, parseInt(value));
    };

    const handleAssigneeChange = (value: string) => {
        const assigneeId = value ? parseInt(value) : null;
        onAssigneeChange(ticket.id, assigneeId);
    };

    return (
        <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div
                        className="flex-1 cursor-pointer"
                        onClick={() => onClick(ticket)}
                    >
                        <CardTitle className="text-lg text-gray-900 group-hover:text-blue-600 transition-all">
                            {ticket.title || ticket.subject || "No title"}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {ticket.description || "No description provided"}
                        </p>
                    </div>
                    <Badge
                        className={`${priorityMap[priorityId]?.color || "bg-gray-100 text-gray-800"
                            } font-semibold ml-3`}
                    >
                        {priorityMap[priorityId]?.text || "N/A"}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-3">
                {/* Category and Tags */}
                <div className="flex items-center justify-between">
                    <Badge
                        className={`${statusMap[statusId]?.color || "bg-gray-100 text-gray-800"
                            } font-semibold`}
                    >
                        {statusMap[statusId]?.text || "N/A"}
                    </Badge>
                    <span className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded">
                        {getDisplayName(ticket.category)}
                    </span>
                </div>

                {tags.length > 0 && (
                    <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3 text-gray-400" />
                        {tags.slice(0, 2).map((tag, index) => (
                            <span
                                key={index}
                                className="text-xs bg-zinc-100 text-zinc-800 px-2 py-1 rounded"
                            >
                                {tag}
                            </span>
                        ))}
                        {tags.length > 2 && (
                            <span className="text-xs text-gray-500">
                                +{tags.length - 2}
                            </span>
                        )}
                    </div>
                )}

                {/* Reporter and Date */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{reporterName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                            {ticket.created_at
                                ? format(new Date(ticket.created_at), "MMM dd, yyyy")
                                : "No date"}
                        </span>
                    </div>
                </div>

                {/* Status and Assignee Dropdowns */}
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Select
                            value={statusId.toString()}
                            onValueChange={handleStatusChange}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Open</SelectItem>
                                <SelectItem value="2">In Progress</SelectItem>
                                <SelectItem value="3">Resolved</SelectItem>
                                <SelectItem value="4">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Select value={assigneeId} onValueChange={handleAssigneeChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select assignee" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Unassigned</SelectItem>
                                <SelectItem value="2">ICT Department</SelectItem>
                                <SelectItem value="3">General Affair</SelectItem>
                                <SelectItem value="4">Human Capital</SelectItem>
                                <SelectItem value="5">Others</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
};