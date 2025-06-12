import { supabase } from "./supabase";

export const createTicket = async (ticketData: any) => {
    const { data, error } = await supabase
        .from('ticket')
        .insert([ticketData])
        .select();

    if (error) {
        console.error('Error creating ticket:', error);
        throw error;
    }

    return data?.[0];
};
