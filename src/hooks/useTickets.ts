import { supabase } from '@/lib/utils/supabase';
import { Ticket } from '@/types/ticket';
import { useEffect, useState } from 'react';

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState({
    branches: [],
    categories: [],
    services: [],
    subcategories: [],
    networks: [],
    priorities: [],
    statuses: [],
    assignees: []
  });

  // In your useTickets.ts, modify the queries to be more explicit
  const fetchDropdownOptions = async () => {
    try {
      setLoading(true);

      const queries = [
        supabase.from('branches').select('id, branch_name').order('branch_name'),
        supabase.from('categories').select('id, category_name').order('category_name'),
        supabase.from('services').select('id, service_name').order('service_name'),
        supabase.from('subcategories').select('id, subcategory_name, category_id').order('subcategory_name'),
        supabase.from('networks').select('id, network_name').order('network_name'),
        supabase.from('priorities').select('id, priority_name, level').order('level'),
        supabase.from('statuses').select('id, status_name').order('status_name'),
        supabase.from('assignee').select('id, assignee_name').order('assignee_name')
      ];

      const results = await Promise.all(queries);

      setDropdownOptions({
        branches: results[0].data?.map(b => ({ id: b.id, name: b.branch_name })) || [],
        categories: results[1].data?.map(c => ({ id: c.id, name: c.category_name })) || [],
        services: results[2].data?.map(s => ({ id: s.id, name: s.service_name })) || [],
        subcategories: results[3].data?.map(sc => ({
          id: sc.id,
          name: sc.subcategory_name,
          category_id: sc.category_id
        })) || [],
        networks: results[4].data?.map(n => ({ id: n.id, name: n.network_name })) || [],
        priorities: results[5].data?.map(p => ({
          id: p.id,
          name: p.priority_name,
          level: p.level
        })) || [],
        statuses: results[6].data?.map(st => ({ id: st.id, name: st.status_name })) || [],
        assignees: results[7].data?.map(a => ({ id: a.id, name: a.assignee_name })) || []
      });

    } catch (error) {
      console.error('Error fetching dropdown options:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdownOptions();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ticket')
      .select(`
        *,
        branch:branches(name),
        category:categories(name),
        services:services(name),
        subcategory:subcategories(name),
        network:networks(name),
        priority:priorities(name, level),
        status:statuses(name),
        assignee:assignee(name),
        profile:profiles(name)
      `)
      .order('created_at', { ascending: false });

    if (!error) {
      setTickets(data || []);
    }
    setLoading(false);
  };

  const createTicket = async (ticketData: any) => {
    setLoading(true);
    try {
      // Get and verify session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) throw new Error("Not authenticated");

      // Ensure required fields are present
      const completeData = {
        ...ticketData,
        profile: session.user.id, // Use the authenticated user's ID
        status: ticketData.status || 1, // Default status if not provided
        created_at: new Date().toISOString() // Add current timestamp
      };

      const { data, error } = await supabase
        .from('ticket')
        .insert([completeData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Ticket creation failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getTicketsByUser = (userId: string) => {
    console.log('Current user ID:', userId);
    console.log('All tickets:', tickets);

    const userTickets = tickets.filter(ticket => {
      // Handle both cases where profile might be an object or UUID string
      const ticketProfileId = typeof ticket.profile === 'object'
        ? ticket.profile.id
        : ticket.profile;

      return ticketProfileId === userId;
    });

    console.log('Filtered tickets:', userTickets);
    return userTickets;
  };

  const updateTicketStatus = async (ticketId: string, status: Ticket["status"]) => {
    await supabase.from("ticket").update({ status }).eq("id", ticketId);
    fetchTickets();
  };

  const updateTicketAssignee = async (ticketId: string, assignee: string) => {
    await supabase.from("ticket").update({ assignee }).eq("id", ticketId);
    fetchTickets();
  };

  return {
    tickets,
    loading,
    createTicket,
    dropdownOptions,
    updateTicketStatus,
    updateTicketAssignee,
    getTicketsByUser,
    fetchTickets
  };
};