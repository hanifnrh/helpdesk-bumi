import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search, X } from "lucide-react";

interface TicketFiltersProps {
  onSearchChange: (search: string) => void;
  onStatusFilter: (status: string) => void;
  onPriorityFilter: (priority: string) => void;
  onCategoryFilter: (category: string) => void;
  onAssigneeFilter: (assignee: string) => void;
  activeFilters: {
    search: string;
    status: string;
    priority: string;
    category: string;
    assignee: string;
  };
  onClearFilters: () => void;
  dropdownOptions: {
    statuses: { id: string; name: string }[];
    priorities: { id: string; name: string }[];
    categories: { id: string; name: string }[];
    assignees: { id: string; name: string }[];
  };
}

export const TicketFilters = ({
  onSearchChange,
  onStatusFilter,
  onPriorityFilter,
  onCategoryFilter,
  onAssigneeFilter,
  activeFilters,
  onClearFilters,
  dropdownOptions,
}: TicketFiltersProps) => {
  const hasActiveFilters = Object.values(activeFilters).some(
    (filter) => filter !== "" && filter !== "all"
  );

  return (
    <div className="bg-white dmsans-regular p-4 rounded-lg border border-gray-200 space-y-4">
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

      <div className="grid grid-cols-1 gap-4">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* // Status Filter */}
          <Select value={activeFilters.status} onValueChange={onStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="dmsans-light">All Statuses</SelectItem>
              {[...dropdownOptions.statuses]
                .sort((a, b) => Number(a.id) - Number(b.id))
                .map((status) => (
                  <SelectItem key={status.id} value={status.id} className="dmsans-light">
                    {status.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {/* // Priority Filter */}
          <Select value={activeFilters.priority} onValueChange={onPriorityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="dmsans-light">All Priorities</SelectItem>
              {dropdownOptions.priorities.map((priority) => (
                <SelectItem key={priority.id} value={priority.id} className="dmsans-light">
                  {priority.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* // Category Filter */}
          <Select value={activeFilters.category} onValueChange={onCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="dmsans-light">All Categories</SelectItem>
              {dropdownOptions.categories.map((category) => (
                <SelectItem key={category.id} value={category.id} className="dmsans-light">
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* // Assignee Filter */}
          <Select value={activeFilters.assignee} onValueChange={onAssigneeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="dmsans-light">All Assignee</SelectItem>
              {dropdownOptions.assignees.map((assignee) => (
                <SelectItem key={assignee.id} value={assignee.id} className="dmsans-light">
                  {assignee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.status && activeFilters.status !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status:{" "}
              {dropdownOptions.statuses.find(
                (s) => s.id === activeFilters.status
              )?.name || activeFilters.status}
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => onStatusFilter("all")}
              />
            </Badge>
          )}

          {activeFilters.priority && activeFilters.priority !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Priority:{" "}
              {dropdownOptions.priorities.find(
                (p) => p.id === activeFilters.priority
              )?.name || activeFilters.priority}
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => onPriorityFilter("all")}
              />
            </Badge>
          )}

          {activeFilters.category && activeFilters.category !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category:{" "}
              {dropdownOptions.categories.find(
                (c) => c.id === activeFilters.category
              )?.name || activeFilters.category}
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => onCategoryFilter("all")}
              />
            </Badge>
          )}

          {activeFilters.assignee && activeFilters.assignee !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Assignee:{" "}
              {dropdownOptions.categories.find(
                (c) => c.id === activeFilters.assignee
              )?.name || activeFilters.assignee}
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => onAssigneeFilter("all")}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
