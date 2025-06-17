import { AdminTicketCard } from "@/components/AdminTicketCard";
import { AdminTicketModal } from "@/components/AdminTicketModal";
import { TicketFilters } from "@/components/TicketFilters";
import { TicketForm } from "@/components/TicketForm";
import { TicketStats } from "@/components/TicketStats";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "@/components/UserManagement";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useAdminTickets } from "@/hooks/useAdminTickets";
import { useProfile } from "@/hooks/useProfile";
import { useUsers } from "@/hooks/useUsers";
import { supabase } from "@/lib/utils/supabase";
import { Ticket } from "@/types/ticket";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { ChevronsUpDown, LogOut, Plus, Ticket as TicketIcon, User, UserRoundPen } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("tickets");
  const navigate = useNavigate();
  const { updateUserProfile, loading: usersLoading } = useUsers();
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    priority: "all",
    category: "all",
    assignee: "all"
  });
  const {
    tickets,
    setTickets,
    loading: ticketsLoading,
    createTicket,
    dropdownOptions,
    fetchTickets: fetchAllTickets,
  } = useAdminTickets();

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({ ...prev, status }));
    fetchAllTickets({ ...filters, status });
  };

  const handlePriorityFilter = (priority: string) => {
    setFilters((prev) => ({ ...prev, priority }));
    fetchAllTickets({ ...filters, priority });
  };

  const handleCategoryFilter = (category: string) => {
    setFilters((prev) => ({ ...prev, category }));
    fetchAllTickets({ ...filters, category });
  };

  const handleAssigneeFilter = (assignee: string) => {
    setFilters((prev) => ({ ...prev, assignee }));
    fetchAllTickets({ ...filters, assignee });
  };

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
    fetchAllTickets({ ...filters, search });
  };

  const clearFilters = () => {
    const newFilters = {
      search: "",
      status: "all",
      priority: "all",
      category: "all",
      assignee: "all"
    };
    setFilters(newFilters);
    fetchAllTickets(newFilters);
  };

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

  const handleStatusChange = async (ticketId: string, status: number) => {
    try {
      setTickets(prevTickets => prevTickets.map(t =>
        t.id === ticketId ? { ...t, status } : t
      ));
      setSelectedTicket(prev => prev && prev.id === ticketId ? { ...prev, status } : prev);

      await supabase.from("ticket").update({ status, updated_at: new Date().toISOString() }).eq("id", ticketId);

      toast({
        title: "Success",
        description: "Ticket status updated",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleAssigneeChange = async (ticketId: string, assigneeId: number) => {
    try {
      // Find the full assignee object from dropdownOptions
      const newAssignee = dropdownOptions.assignees?.find(a => a.id === assigneeId) || assigneeId;

      // Update the ticket in your state with the full assignee object
      setTickets(prevTickets => prevTickets.map(t =>
        t.id === ticketId
          ? { ...t, assignee: newAssignee }
          : t
      ));

      // Update the selected ticket in modal if it's the same ticket
      setSelectedTicket(prev =>
        prev && prev.id === ticketId
          ? { ...prev, assignee: newAssignee }
          : prev
      );

      // Call your API to update the assignee
      await supabase.from("ticket").update({
        assignee: assigneeId,
        updated_at: new Date().toISOString()
      }).eq("id", ticketId);

      toast({
        title: "Success",
        description: "Assignee updated",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update assignee",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <div className="min-h-screen dmsans-regular bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between py-0 sm:py-4">
          <div className="text-left space-y-4 flex-1">
            <div className="flex flex-col items-start justify-center gap-3">
              <a href="/">
                <img
                  src="/assets/logo-bumi.png"
                  alt="Bumi Logo"
                  width={50}
                  className="w-44 h-auto"
                />
                <h1 className="text-xl sm:text-4xl dmsans-semibold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
                  Helpdesk System
                </h1>
              </a>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <p className="text-sm sm:text-lg text-gray-800 dmsans-semibold">
              Welcome back,
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="profile" className="bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 hover:text-zinc-800 flex items-center rounded-xl gap-2 px-2">
                  <div className="flex items-center gap-4 cursor-pointer">
                    <p className="capitalize dmsans-regular bg-violet-100 text-violet-500 rounded-md py-1 px-3 text-xs sm:text-sm">
                      {profile?.role}
                    </p>
                    <div className="text-right">
                      <p className="dmsans-regular text-sm sm:text-lg flex items-center gap-2">{profile?.name} <ChevronsUpDown /></p>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel className="dmsans-regular text-base">Profile</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup className="dmsans-regular text-base flex flex-col gap-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/editprofile', { state: { profile } })}
                    className="w-full border-blue-200 text-blue-500 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <UserRoundPen className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
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
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs"
              >
                <TicketIcon className="h-4 w-4" />
                All Tickets ({tickets.length})
              </TabsTrigger>
              <TabsTrigger
                value="create"
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs"
              >
                <Plus className="h-4 w-4" />
                Create Ticket
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs"
              >
                <User className="h-4 w-4" />
                Manage User
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="tickets" className="space-y-6">
            {/* Filters */}
            <TicketFilters
              onSearchChange={handleSearchChange}
              onStatusFilter={handleStatusFilter}
              onPriorityFilter={handlePriorityFilter}
              onCategoryFilter={handleCategoryFilter}
              onAssigneeFilter={handleAssigneeFilter}
              activeFilters={filters}
              onClearFilters={clearFilters}
              dropdownOptions={dropdownOptions}
            />

            {/* Tickets Grid */}
            {tickets.length === 0 ? (
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
                {tickets.map((ticket) => (
                  <AdminTicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onClick={handleTicketClick}
                    onStatusChange={handleStatusChange}
                    onAssigneeChange={handleAssigneeChange}
                    dropdownOptions={dropdownOptions}
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

          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>
        </Tabs>

        {/* Ticket Modal */}
        <AdminTicketModal
          ticket={selectedTicket}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onStatusChange={handleStatusChange}
          onAssigneeChange={handleAssigneeChange}
          dropdownOptions={dropdownOptions}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
