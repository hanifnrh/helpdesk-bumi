
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';

interface TicketFiltersProps {
  onSearchChange: (search: string) => void;
  onStatusFilter: (status: string) => void;
  onPriorityFilter: (priority: string) => void;
  onCategoryFilter: (category: string) => void;
  activeFilters: {
    search: string;
    status: string;
    priority: string;
    category: string;
  };
  onClearFilters: () => void;
}

export const TicketFilters = ({
  onSearchChange,
  onStatusFilter,
  onPriorityFilter,
  onCategoryFilter,
  activeFilters,
  onClearFilters
}: TicketFiltersProps) => {
  const hasActiveFilters = Object.values(activeFilters).some(filter => filter !== '' && filter !== 'all');

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Filter className="h-4 w-4" />
        Filters
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-6 px-2 text-xs"
          >
            Clear all
            <X className="h-3 w-3 ml-1" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tickets..."
            value={activeFilters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <Select value={activeFilters.status} onValueChange={onStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select value={activeFilters.priority} onValueChange={onPriorityFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select value={activeFilters.category} onValueChange={onCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Bug">Bug</SelectItem>
            <SelectItem value="Feature Request">Feature Request</SelectItem>
            <SelectItem value="Support">Support</SelectItem>
            <SelectItem value="Documentation">Documentation</SelectItem>
            <SelectItem value="Performance">Performance</SelectItem>
            <SelectItem value="Security">Security</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {activeFilters.search}
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => onSearchChange('')}
              />
            </Badge>
          )}
          {activeFilters.status && activeFilters.status !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {activeFilters.status}
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => onStatusFilter('all')}
              />
            </Badge>
          )}
          {activeFilters.priority && activeFilters.priority !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Priority: {activeFilters.priority}
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => onPriorityFilter('all')}
              />
            </Badge>
          )}
          {activeFilters.category && activeFilters.category !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {activeFilters.category}
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => onCategoryFilter('all')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
