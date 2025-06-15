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
import { Calendar, FileText, Mail, Phone, Tag, User } from "lucide-react";
import { useEffect, useState } from "react";

interface AdminTicketModalProps {
    ticket: Ticket | null;
    isOpen: boolean;
    onClose: () => void;
    onStatusChange: (ticketId: string, status: number) => void;
    onAssigneeChange: (ticketId: string, assignee: number) => void;
    dropdownOptions?: {
        assignees?: any[];
        statuses?: any[];
    };
}

export const AdminTicketModal = ({
    ticket: initialTicket,
    isOpen,
    onClose,
    onStatusChange,
    onAssigneeChange,
    dropdownOptions,
}: AdminTicketModalProps) => {

    const [ticket, setTicket] = useState(initialTicket);
    useEffect(() => {
        setTicket(initialTicket);
    }, [initialTicket]);

    if (!ticket) return null;
    const getDisplayName = (field: any) => {
        if (!field) return "N/A";

        // Handle string or number directly
        if (typeof field !== "object") return field.toString();

        // Handle object cases
        if ("category_name" in field) return field.category_name || "N/A";
        if ("priority_name" in field) return field.priority_name || "N/A";
        if ("status_name" in field) return field.status_name || "N/A";
        if ("assignee_name" in field) return field.assignee_name || "N/A";
        if ("branch_name" in field) return field.branch_name || "N/A";
        if ("service_name" in field) return field.service_name || "N/A";
        if ("subcategory_name" in field) return field.subcategory_name || "N/A";
        if ("network_name" in field) return field.network_name || "N/A";
        if ("name" in field) return field.name || "N/A";
        if ("email" in field) return field.email || "N/A";
        if ("phone" in field) return field.phone || "N/A";

        return "N/A";
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

    const tags = ticket.tags ? ticket.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

    const currentStatusId = ticket.status
        ? (typeof ticket.status === "object" ? ticket.status.id : ticket.status)
        : 0;

    const currentAssigneeId = ticket.assignee
        ? (typeof ticket.assignee === "object" ? ticket.assignee.id : ticket.assignee)
        : 0;

    const formatPhoneForWa = (phone: string) => {
        if (!phone) return "";
        const cleaned = phone.replace(/\D/g, "");
        if (cleaned.startsWith("62")) return cleaned;
        if (cleaned.startsWith("0")) return `62${cleaned.slice(1)}`;
        return cleaned;
    };

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
                                        ? ticket.priority?.id || 0
                                        : ticket.priority || 0
                                )} `}
                            >
                                {getPriorityText(
                                    typeof ticket.priority === "object"
                                        ? ticket.priority?.id || 0
                                        : ticket.priority || 0
                                )}{" "}
                                PRIORITY
                            </Badge>
                            <Badge className={getStatusColor(currentStatusId)}>
                                {getStatusText(currentStatusId)}
                            </Badge>
                            <span className="text-sm text-zinc-500 bg-zinc-100 hover:text-zinc-700 hover:bg-zinc-200 px-3 py-1 rounded-full cursor-pointer">
                                {getDisplayName(ticket.category)}
                            </span>
                        </div>
                        <span className="text-sm text-gray-500 uppercase">
                            #{ticket.id?.slice(0, 8) || "N/A"}
                        </span>
                    </div>

                    {/* Ticket Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-1">
                            <span className="text-sm font-medium ">Branch:</span>
                            <p className="text-sm text-gray-900">
                                {getDisplayName(ticket.branch)}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-sm font-medium ">
                                Services:
                            </span>
                            <p className="text-sm text-gray-900">
                                {getDisplayName(ticket.services)}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-sm font-medium ">
                                Sub-Category:
                            </span>
                            <p className="text-sm text-gray-900">
                                {getDisplayName(ticket.subcategory)}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-sm font-medium ">
                                Network/System:
                            </span>
                            <p className="text-sm text-gray-900">
                                {getDisplayName(ticket.network)}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-sm font-medium ">
                                Created:
                            </span>
                            <p className="text-sm text-gray-900">
                                {ticket.created_at
                                    ? format(new Date(ticket.created_at), "MMM dd, yyyy HH:mm")
                                    : "N/A"}
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
                                <div className="flex items-start justify-start gap-2 text-sm ">
                                    <div className="flex items-start gap-2">
                                        <User className="h-4 w-4 text-gray-400" />
                                    </div>

                                    <div className="flex flex-col items-start gap-3">
                                        <div className="flex items-center gap-2">
                                            <div className="">Reporter:</div>
                                            <p className="text-zinc-700 cursor-pointer">
                                                {getDisplayName(ticket.profile.name)}
                                            </p>
                                        </div>
                                        <a
                                            href={`mailto:${ticket.profile.email}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm group hover:underline hover:text-blue-600 transition-all cursor-pointer"
                                        >
                                            Email:
                                            <span className="text-zinc-700 group-hover:text-blue-600 transition-all">
                                                {getDisplayName(ticket.profile.email)}
                                            </span>
                                            <Mail className="h-4 w-4 text-zinc-700 group-hover:text-blue-600" />
                                        </a>

                                        <a
                                            href={`https://wa.me/${formatPhoneForWa(ticket.profile.phone)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm group hover:underline hover:text-blue-600 transition-all"
                                        >
                                            Phone:
                                            <span className="text-zinc-700 group-hover:text-blue-600 transition-all">
                                                {getDisplayName(ticket.profile.phone)}
                                            </span>
                                            <Phone className="h-4 w-4 text-zinc-700 group-hover:text-blue-600" />
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm ">
                                    <User className="h-4 w-4 text-gray-400" />
                                    <span className="">Assignee:</span>
                                    <span className="font-medium">
                                        {getDisplayName(ticket.assignee) || "Unassigned"}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-sm ">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span className="">Created:</span>
                                    <span className="font-medium">
                                        {ticket.created_at
                                            ? format(new Date(ticket.created_at), "MMM dd, yyyy HH:mm")
                                            : "N/A"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm ">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span className="">Updated:</span>
                                    <span className="font-medium">
                                        {ticket.updated_at
                                            ? format(new Date(ticket.updated_at), "MMM dd, yyyy HH:mm")
                                            : "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Admin Actions */}
                        <div className="space-y-4">
                            <h3 className="font-medium text-gray-900">Admin Actions</h3>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm  block mb-1">Status</label>
                                    <Select
                                        value={currentStatusId.toString()}
                                        onValueChange={(value) => onStatusChange(ticket.id, parseInt(value))}
                                    >
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {dropdownOptions?.statuses
                                                ?.sort((a, b) => a.id - b.id)
                                                .map((status) => (
                                                    <SelectItem key={status.id} value={status.id.toString()}>
                                                        {status.name || status.status_name}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-sm  block mb-1">
                                        Assignee
                                    </label>
                                    <Select
                                        value={currentAssigneeId?.toString() || "0"}
                                        onValueChange={(value) =>
                                            onAssigneeChange(ticket.id, parseInt(value))
                                        }
                                    >
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="Select assignee" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border border-gray-200 shadow-lg">
                                            {dropdownOptions?.assignees
                                                ?.sort((a, b) => a.id - b.id)
                                                .map((assignee) => (
                                                    <SelectItem key={assignee.id} value={assignee.id.toString()}>
                                                        {assignee.name}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};