import { TicketCard } from "@/components/TicketCard";
import { TicketFilters } from "@/components/TicketFilters";
import { TicketForm } from "@/components/TicketForm";
import { TicketModal } from "@/components/TicketModal";
import { TicketStats } from "@/components/TicketStats";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "@/components/UserManagement";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { useTickets } from "@/hooks/useTickets";
import { Ticket } from "@/types/ticket";
import { LogOut, Plus, Ticket as TicketIcon, Users } from "lucide-react";
import { useMemo, useState } from "react";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const {
    tickets,
    loading,
    createTicket,
    updateTicketStatus,
    updateTicketAssignee,
  } = useTickets();
  const { toast } = useToast();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("tickets");
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    priority: "all",
    category: "all",
  });

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        ticket.description
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        ticket.reporter.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus =
        filters.status === "all" || ticket.status === filters.status;
      const matchesPriority =
        filters.priority === "all" || ticket.priority === filters.priority;
      const matchesCategory =
        filters.category === "all" || ticket.category === filters.category;

      return (
        matchesSearch && matchesStatus && matchesPriority && matchesCategory
      );
    });
  }, [tickets, filters]);

  const handleCreateTicket = (ticketData: any) => {
    const ticketWithUser = {
      ...ticketData,
      reporter: user?.name || "Unknown",
      reporterEmail: user?.email || "",
      reporterPhone: user?.phone || "",
      reporterId: user?.id || "",
    };
    createTicket(ticketWithUser);
    toast({
      title: "Ticket Created",
      description: "Your ticket has been successfully created.",
    });
    setActiveTab("tickets");
  };

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleStatusChange = (ticketId: string, status: Ticket["status"]) => {
    updateTicketStatus(ticketId, status);
    toast({
      title: "Status Updated",
      description: `Ticket status changed to ${status}.`,
    });
  };

  const handleAssigneeChange = (ticketId: string, assignee: string) => {
    updateTicketAssignee(ticketId, assignee);
    toast({
      title: "Assignee Updated",
      description: `Ticket assigned to ${assignee}.`,
    });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      priority: "all",
      category: "all",
    });
  };

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-center space-y-4 flex-1">
            <div className="flex items-center justify-center gap-3">
              <TicketIcon className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
                Bumi Auto Helpdesk System
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Admin Dashboard - Manage and track all support tickets
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p>{profile?.name}</p>
              <p>{profile?.role}</p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <TicketStats tickets={tickets} />

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-auto grid-cols-3 bg-white border border-blue-200">
              <TabsTrigger
                value="tickets"
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <TicketIcon className="h-4 w-4" />
                All Tickets ({filteredTickets.length})
              </TabsTrigger>
              <TabsTrigger
                value="create"
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Plus className="h-4 w-4" />
                Create Ticket
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Users className="h-4 w-4" />
                User Management
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="tickets" className="space-y-6">
            {/* Filters */}
            <TicketFilters
              onSearchChange={(search) =>
                setFilters((prev) => ({ ...prev, search }))
              }
              onStatusFilter={(status) =>
                setFilters((prev) => ({ ...prev, status }))
              }
              onPriorityFilter={(priority) =>
                setFilters((prev) => ({ ...prev, priority }))
              }
              onCategoryFilter={(category) =>
                setFilters((prev) => ({ ...prev, category }))
              }
              activeFilters={filters}
              onClearFilters={clearFilters}
            />

            {/* Tickets Grid */}
            {filteredTickets.length === 0 ? (
              <div className="text-center py-12">
                <TicketIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tickets found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters to see more tickets.
                </p>
                <Button
                  onClick={() => setActiveTab("create")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Ticket
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onStatusChange={handleStatusChange}
                    onAssigneeChange={handleAssigneeChange}
                    onClick={handleTicketClick}
                    isAdmin={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="create">
            <TicketForm onSubmit={handleCreateTicket} loading={loading} />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
        </Tabs>

        {/* Ticket Modal */}
        <TicketModal
          ticket={selectedTicket}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onStatusChange={handleStatusChange}
          onAssigneeChange={handleAssigneeChange}
          isAdmin={true}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
