import { TicketCard } from "@/components/TicketCard";
import { TicketFilters } from "@/components/TicketFilters";
import { TicketForm } from "@/components/TicketForm";
import { TicketModal } from "@/components/TicketModal";
import { TicketStats } from "@/components/TicketStats";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { useTickets } from "@/hooks/useTickets";
import { supabase } from "@/lib/utils/supabase";
import { Ticket } from "@/types/ticket";
import { LogOut, Plus, Ticket as TicketIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("tickets");
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    priority: "all",
    category: "all",
  });
  const {
    tickets,
    loading: ticketsLoading,
    createTicket,
    dropdownOptions,
  } = useTickets(user?.id);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Search filter
      const title = ticket.title || "";
      const description = ticket.description || "";
      const profileName =
        typeof ticket.profile === "object" ? ticket.profile?.name || "" : "";

      const matchesSearch =
        filters.search === "" ||
        title.toLowerCase().includes(filters.search.toLowerCase()) ||
        description.toLowerCase().includes(filters.search.toLowerCase()) ||
        profileName.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory = (() => {
        if (filters.category === "all") return true;

        const categoryName =
          typeof ticket.category === "object"
            ? ticket.category?.name?.toLowerCase()
            : dropdownOptions.categories
                .find((c) => c.id === ticket.category)
                ?.name.toLowerCase() || "";

        return categoryName === filters.category.toLowerCase();
      })();

      const matchesStatus = (() => {
        if (filters.status === "all") return true;

        const statusName =
          typeof ticket.status === "object"
            ? ticket.status?.name?.toLowerCase()
            : dropdownOptions.statuses
                .find((s) => s.id === ticket.status)
                ?.name.toLowerCase() || "";

        return statusName === filters.status.toLowerCase();
      })();

      const matchesPriority = (() => {
        if (filters.priority === "all") return true;

        const priorityName =
          typeof ticket.priority === "object"
            ? ticket.priority?.priority_name?.toLowerCase()
            : dropdownOptions.priorities
                .find((p) => p.id === ticket.priority)
                ?.name.toLowerCase() || "";

        return priorityName === filters.priority.toLowerCase();
      })();

      return (
        matchesSearch && matchesStatus && matchesPriority && matchesCategory
      );
    });
  }, [
    tickets,
    filters,
    dropdownOptions.priorities,
    dropdownOptions.categories,
  ]);

  const handleCreateTicket = async (ticketData: any) => {
    setLoading(true);
    try {
      // Get current user ID
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const ticketWithProfile = {
        ...ticketData,
        profile: user.id, // Use the authenticated user's ID
        title: ticketData.subject,
      };

      const newTicket = await createTicket(ticketWithProfile);
      toast({
        title: "Success",
        description: "Ticket created successfully",
        variant: "default",
      });
      // navigate(`/tickets/${newTicket.id}`);
      navigate("/user/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create ticket",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
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
              My Support Tickets
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p>{profile?.name}</p>
              <p>User</p>
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
            <TabsList className="grid w-auto grid-cols-2 bg-white border border-blue-200">
              <TabsTrigger
                value="tickets"
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <TicketIcon className="h-4 w-4" />
                My Tickets ({filteredTickets.length})
              </TabsTrigger>
              <TabsTrigger
                value="create"
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Plus className="h-4 w-4" />
                Create Ticket
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
              dropdownOptions={dropdownOptions} // Add this line
            />

            {/* Tickets Grid */}
            {filteredTickets.length === 0 ? (
              <div className="text-center py-12">
                <TicketIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tickets found
                </h3>
                <p className="text-gray-500 mb-4">
                  Get started by creating your first ticket.
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
                    onStatusChange={() => {}}
                    onAssigneeChange={() => {}}
                    onClick={handleTicketClick}
                    isAdmin={false}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="create">
            <TicketForm
              onSubmit={handleCreateTicket}
              loading={loading}
              dropdownOptions={dropdownOptions}
            />
          </TabsContent>
        </Tabs>

        {/* Ticket Modal */}
        <TicketModal
          ticket={selectedTicket}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onStatusChange={() => {}}
          onAssigneeChange={() => {}}
          isAdmin={false}
        />
      </div>
    </div>
  );
};

export default UserDashboard;
