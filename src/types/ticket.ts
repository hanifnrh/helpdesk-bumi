export interface TicketFormData {
  branch: string;
  services: string;
  category: string;
  subcategory?: string;
  network?: string;
  subject: string;
  description: string;
  priority: string;
  tags?: string;
}

export interface Ticket {
  id: string;
  created_at: string;
  title: string;
  subject: string;
  description: string;
  branch: number | { id: number; name: string };
  category: number | { id: number; name: string };
  services: number | { id: number; name: string };
  subcategory: number | { id: number; name: string } | null;
  network: number | { id: number; name: string } | null;
  priority: number | { id: number; name: string };
  status: number | { id: number; name: string };
  tags: string | null;
  attachment: string | null;
  assignee: number | null | { id: number; name: string };
  profile: string | { id: string; name: string };
}