
import { useState, useEffect } from 'react';
import { Ticket, TicketFormData } from '@/types/ticket';

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration with new fields and user associations
  useEffect(() => {
    const mockTickets: Ticket[] = [
      {
        ticketID: 'TKT-001',
        id: '1',
        code: crypto.randomUUID(),
        branch: 'BYD Branch',
        services: 'IT Support',
        category: 'Technical Issue',
        subCategory: 'Software Problem',
        network: 'Internal Network',
        subject: 'Login System Issue',
        title: 'Login page not loading',
        description: 'Users are reporting that the login page takes too long to load and sometimes shows a 404 error.',
        ticketFile: null,
        timestamp: new Date('2024-06-01T10:00:00Z'),
        status: 'open',
        priority: 'high',
        assignee: 'ICT Department',
        reporter: 'Alice Johnson',
        reporterEmail: 'alice@company.com',
        reporterPhone: '+6281234567892',
        reporterId: '3',
        createdAt: new Date('2024-06-01T10:00:00Z'),
        updatedAt: new Date('2024-06-01T10:00:00Z'),
        tags: ['login', 'frontend', 'critical']
      },
      {
        ticketID: 'TKT-002',
        id: '2',
        code: crypto.randomUUID(),
        branch: 'Hyundai Branch',
        services: 'Customer Service',
        category: 'Feature Request',
        subCategory: 'UI Enhancement',
        network: 'Customer Portal',
        subject: 'Dark Mode Implementation',
        title: 'Add dark mode support',
        description: 'Implement dark mode theme across the entire application for better user experience.',
        ticketFile: null,
        timestamp: new Date('2024-05-28T14:30:00Z'),
        status: 'in-progress',
        priority: 'medium',
        assignee: 'ICT Department',
        reporter: 'Regular User',
        reporterEmail: 'user@company.com',
        reporterPhone: '+6281234567891',
        reporterId: '2',
        createdAt: new Date('2024-05-28T14:30:00Z'),
        updatedAt: new Date('2024-06-01T09:15:00Z'),
        tags: ['ui', 'theme', 'enhancement']
      },
      {
        ticketID: 'TKT-003',
        id: '3',
        code: crypto.randomUUID(),
        branch: 'Bumi Auto Head Office',
        services: 'Database Administration',
        category: 'Technical Issue',
        subCategory: 'Performance Issue',
        network: 'Production Database',
        subject: 'Database Connection Timeout',
        title: 'Database connection timeout',
        description: 'Application is experiencing intermittent database connection timeouts during peak hours.',
        ticketFile: null,
        timestamp: new Date('2024-05-25T08:00:00Z'),
        status: 'resolved',
        priority: 'critical',
        assignee: 'ICT Department',
        reporter: 'Admin User',
        reporterEmail: 'admin@company.com',
        reporterPhone: '+6281234567890',
        reporterId: '1',
        createdAt: new Date('2024-05-25T08:00:00Z'),
        updatedAt: new Date('2024-05-30T16:45:00Z'),
        tags: ['database', 'performance', 'backend']
      }
    ];
    setTickets(mockTickets);
  }, []);

  const createTicket = (ticketData: TicketFormData) => {
    setLoading(true);
    const newTicket: Ticket = {
      ticketID: `TKT-${String(Date.now()).slice(-3).padStart(3, '0')}`,
      id: Date.now().toString(),
      code: crypto.randomUUID(), // Auto-generate UUID for ticket code
      ...ticketData,
      title: ticketData.subject, // Map subject to title for compatibility
      timestamp: new Date(),
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setTimeout(() => {
      setTickets(prev => [newTicket, ...prev]);
      setLoading(false);
    }, 500);
  };

  const updateTicketStatus = (ticketId: string, status: Ticket['status']) => {
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status, updatedAt: new Date() }
          : ticket
      )
    );
  };

  const updateTicketAssignee = (ticketId: string, assignee: string) => {
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, assignee, updatedAt: new Date() }
          : ticket
      )
    );
  };

  const getTicketsByUser = (userId: string) => {
    return tickets.filter(ticket => ticket.reporterId === userId);
  };

  return {
    tickets,
    loading,
    createTicket,
    updateTicketStatus,
    updateTicketAssignee,
    getTicketsByUser
  };
};
