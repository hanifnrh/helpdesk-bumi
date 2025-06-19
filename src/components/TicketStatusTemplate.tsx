import * as React from 'react';

interface TicketStatusTemplateProps {
    ticketId: string;
    title: string;
    status: string;
}

export const TicketStatusTemplate: React.FC<Readonly<TicketStatusTemplateProps>> = ({
    ticketId,
    title,
    status,
}) => (
    <div>
        <h1>Ticket Status Updated</h1>
        <p><strong>Ticket #:</strong> {ticketId}</p>
        <p><strong>Title:</strong> {title}</p>
        <p><strong>New Status:</strong> {status}</p>
        <p>Please contact us if you have any questions.</p>
    </div>
);