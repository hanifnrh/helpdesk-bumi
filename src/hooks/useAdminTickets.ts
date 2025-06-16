import { supabase } from '@/lib/utils/supabase';
import { Ticket } from '@/types/ticket';
import { useEffect, useState } from 'react';

export const useAdminTickets = () => {
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

    const fetchDropdownOptions = async () => {
        try {
            setLoading(true);
            const queries = [
                supabase.from('branches').select('id, branch_name').order('branch_name'),
                supabase.from('categories').select('id, category_name, service_id').order('category_name'),
                supabase.from('services').select('id, service_name').order('service_name'),
                supabase.from('subcategories').select('id, subcategory_name, category_id').order('subcategory_name'),
                supabase.from('networks').select('id, network_name, category_id').order('network_name'),
                supabase.from('priorities').select('id, priority_name, level').order('level'),
                supabase.from('statuses').select('id, status_name').order('status_name'),
                supabase.from('assignee').select('id, assignee_name').order('assignee_name')
            ];

            const results = await Promise.all(queries);
            setDropdownOptions({
                branches: results[0].data?.map(b => ({ id: b.id, name: b.branch_name })) || [],
                categories: results[1].data?.map(c => ({
                    id: c.id,
                    name: c.category_name,
                    service_id: c.service_id
                })) || [],
                services: results[2].data?.map(s => ({ id: s.id, name: s.service_name })) || [],
                subcategories: results[3].data?.map(sc => ({
                    id: sc.id,
                    name: sc.subcategory_name,
                    category_id: sc.category_id
                })) || [],
                networks: results[4].data?.map(n => ({
                    id: n.id,
                    name: n.network_name,
                    category_id: n.category_id
                })) || [],
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

    const fetchTickets = async (filters = {
        search: "",
        status: "all",
        priority: "all",
        category: "all",
        assignee: "all"
    }) => {
        setLoading(true);
        try {
            let query = supabase
                .from('ticket')
                .select(`
                *,
                id,
                created_at,
                title,
                subject,
                description,
                branch:branches(id, branch_name),
                category:categories(id, category_name),
                services:services(id, service_name),
                subcategory:subcategories(id, subcategory_name),
                network:networks(id, network_name),
                priority:priorities(id, priority_name, level),
                status:statuses(id, status_name),
                tags,
                attachment,
                assignee:assignee(id, assignee_name),
                profile:profiles(id, name, phone, email)
                `)
                .order('created_at', { ascending: false });

            if (filters.status !== "all") {
                query = query.eq('status', filters.status);
            }
            if (filters.priority !== "all") {
                query = query.eq('priority', filters.priority);
            }
            if (filters.category !== "all") {
                query = query.eq('category', filters.category);
            }
            if (filters.assignee !== "all") {
                query = query.eq('assignee', filters.assignee);
            }
            if (filters.search) {
                query = query.or(
                    `subject.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
                );
            }

            const { data, error } = await query;
            if (error) throw error;
            setTickets(data || []);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const createTicket = async (ticketData: any) => {
        setLoading(true);
        try {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !session) throw new Error("Not authenticated");

            const completeData = {
                ...ticketData,
                profile: session.user.id,
                status: ticketData.status || 1,
                priority: ticketData.priority || 2,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('ticket')
                .insert([completeData])
                .select()
                .single();

            if (error) throw error;
            await fetchTickets();
            return data;
        } catch (error) {
            console.error('Ticket creation failed:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateTicketStatus = async (ticketId: string, status: Ticket["status"]) => {
        await supabase
            .from("ticket")
            .update({
                status,
                updated_at: new Date().toISOString()
            })
            .eq("id", ticketId);
        await fetchTickets();
    };

    const updateTicketAssignee = async (ticketId: string, assignee: string) => {
        await supabase
            .from("ticket")
            .update({
                assignee,
                updated_at: new Date().toISOString()
            })
            .eq("id", ticketId);
        await fetchTickets();
    };

    useEffect(() => {
        fetchDropdownOptions();
        fetchTickets();
    }, []);

    return {
        tickets,
        setTickets,
        loading,
        createTicket,
        dropdownOptions,
        updateTicketStatus,
        updateTicketAssignee,
        fetchTickets
    };
};