import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProfile } from "@/hooks/useProfile";
import { fetchTicketOptions } from "@/lib/utils/ticketOptions";
import { Plus, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";

interface TicketFormData {
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

interface TicketFormProps {
  onSubmit: (ticket: TicketFormData) => void;
  loading?: boolean;
}

export const TicketForm = ({ onSubmit, loading }: TicketFormProps) => {
  const { profile } = useProfile();
  const [options, setOptions] = useState({
    branches: [],
    categories: [],
    services: [],
    subcategories: [],
    networks: [],
    priorities: [],
    statuses: [],
    assignees: [],
  });
  const [formData, setFormData] = useState<TicketFormData>({
    branch: "",
    services: "",
    category: "",
    subCategory: "",
    network: "",
    subject: "",
    description: "",
    ticketFile: null,
    title: "",
    priority: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    const loadOptions = async () => {
      const fetchedOptions = await fetchTicketOptions();
      setOptions(fetchedOptions);
      // Set default priority to "Medium" if available
      const mediumPriority = fetchedOptions.priorities.find(
        (p) => p.name.toLowerCase() === "medium"
      );
      if (mediumPriority) {
        setFormData((prev) => ({ ...prev, priority: mediumPriority.id }));
      }
    };
    loadOptions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile) {
      console.error("User profile not available");
      return;
    }

    // Find the default "Open" status
    const openStatus = options.statuses.find((s) => s.name === "Open");
    if (!openStatus) {
      console.error('Default "Open" status not found');
      return;
    }

    const ticketData: TicketFormData = {
      branch: formData.branch,
      services: formData.services,
      category: formData.category,
      subCategory: formData.subCategory,
      network: formData.network,
      subject: formData.subject,
      description: formData.description,
      ticketFile: formData.ticketFile,
      title: formData.title,
      priority: formData.priority,
      tags: formData.tags,
    };

    onSubmit(ticketData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, ticketFile: file }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Create New Ticket
        </CardTitle>
        <p className="text-sm text-gray-600">
          Ticket code will be auto-generated
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Branch and Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="branch">Branch *</Label>
              <Select
                value={formData.branch}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, branch: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  {options.branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="services">Services *</Label>
              <Select
                value={formData.services}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, services: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="IT Support">IT Support</SelectItem>
                  <SelectItem value="Customer Service">
                    Customer Service
                  </SelectItem>
                  <SelectItem value="Human Resources">
                    Human Resources
                  </SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Database Administration">
                    Database Administration
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category and Sub-Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="Technical Issue">
                    Technical Issue
                  </SelectItem>
                  <SelectItem value="Feature Request">
                    Feature Request
                  </SelectItem>
                  <SelectItem value="Bug Report">Bug Report</SelectItem>
                  <SelectItem value="Access Request">Access Request</SelectItem>
                  <SelectItem value="Documentation">Documentation</SelectItem>
                  <SelectItem value="Training">Training</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subCategory">Sub-Category *</Label>
              <Select
                value={formData.subCategory}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, subCategory: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sub-category" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="Software Problem">
                    Software Problem
                  </SelectItem>
                  <SelectItem value="Hardware Issue">Hardware Issue</SelectItem>
                  <SelectItem value="Network Problem">
                    Network Problem
                  </SelectItem>
                  <SelectItem value="Performance Issue">
                    Performance Issue
                  </SelectItem>
                  <SelectItem value="UI Enhancement">UI Enhancement</SelectItem>
                  <SelectItem value="Security Issue">Security Issue</SelectItem>
                  <SelectItem value="Data Issue">Data Issue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Network and Subject */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="network">Network/System *</Label>
              <Select
                value={formData.network}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, network: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select network/system" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="Internal Network">
                    Internal Network
                  </SelectItem>
                  <SelectItem value="Customer Portal">
                    Customer Portal
                  </SelectItem>
                  <SelectItem value="Production Database">
                    Production Database
                  </SelectItem>
                  <SelectItem value="Development Environment">
                    Development Environment
                  </SelectItem>
                  <SelectItem value="Email System">Email System</SelectItem>
                  <SelectItem value="File Server">File Server</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                type="text"
                value={formData.subject}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, subject: e.target.value }))
                }
                placeholder="Brief title of the issue or request"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Detailed description of the issue or request"
              rows={4}
              required
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="ticketFile">Attachment</Label>
            <div className="flex items-center gap-2">
              <Input
                id="ticketFile"
                type="file"
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <Upload className="h-4 w-4 text-gray-400" />
            </div>
            {formData.ticketFile && (
              <p className="text-sm text-gray-600">
                Selected: {formData.ticketFile.name}
              </p>
            )}
          </div>

          {/* Priority */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, priority: value as any }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
              />
              <Button
                type="button"
                onClick={addTag}
                size="sm"
                variant="outline"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-red-500"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={loading}
          >
            {loading ? "Creating Ticket..." : "Create Ticket"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
