import { supabase } from "./supabase";

export const fetchTicketOptions = async () => {
    const [
        branches,
        categories,
        services,
        subcategories,
        networks,
        priorities,
        statuses,
        assignees
    ] = await Promise.all([
        supabase.from('branches').select('id, name'),
        supabase.from('categories').select('id, name'),
        supabase.from('services').select('id, name'),
        supabase.from('subcategories').select('id, name'),
        supabase.from('networks').select('id, name'),
        supabase.from('priorities').select('id, name'),
        supabase.from('statuses').select('id, name'),
        supabase.from('assignee').select('id, name')
    ]);

    return {
        branches: branches.data || [],
        categories: categories.data || [],
        services: services.data || [],
        subcategories: subcategories.data || [],
        networks: networks.data || [],
        priorities: priorities.data || [],
        statuses: statuses.data || [],
        assignees: assignees.data || []
    };
};