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
      .from('tickets')
      .select(`
        *,
        branch:branches(name),
        category:categories(name),
        services:services(name),
        subcategory:subcategories(name),
        network:networks(name),
        priority:priorities(name),
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
      const { data, error } = await supabase
        .from('tickets')
        .insert([ticketData])
        .select(`
          *,
          branch:branches(name),
          category:categories(name),
          services:services(name),
          subcategory:subcategories(name),
          network:networks(name),
          priority:priorities(name),
          status:statuses(name),
          assignee:assignee(name),
          profile:profiles(name)
        `)
        .single();

      if (error) throw error;

      setTickets(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getTicketsByUser = (userId: string) => {
    return tickets.filter(ticket => ticket.profile === userId);
  };

  return {
    tickets,
    loading,
    createTicket,
    dropdownOptions,
    getTicketsByUser,
    fetchTickets
  };
};