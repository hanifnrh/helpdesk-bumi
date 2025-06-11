// src/types/ticket.ts
export interface TicketFormData {
  branch: string;
  services: string;
  category: string;
  subCategory: string;
  network: string;
  subject: string;
  description: string;
  ticketFile: File | null;
  title: string;
  priority: string;
  tags: string[];
}

export interface Ticket {
  id: string;
  created_at: string;
  branch: number;
  category: number;
  services: number;
  subcategory: number;
  network: number;
  subject: string;
  description: string;
  attachment: string | null;
  priority: number;
  tags: string;
  status: number;
  assignee: number | null;
  profile: string;
}