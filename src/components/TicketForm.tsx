// src/components/TicketForm.tsx
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/utils/supabase";
import { TicketFormData } from "@/types/ticket";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

interface TicketFormProps {
  onSubmit: (data: TicketFormData) => Promise<void>;
  loading: boolean;
  dropdownOptions: {
    branches: { id: number; name: string }[];
    categories: { id: number; name: string }[];
    services: { id: number; name: string }[];
    subcategories: { id: number; name: string; category_id?: number }[];
    networks: { id: number; name: string }[];
    priorities: { id: number; name: string; level?: number }[];
  };
}

export const TicketForm = ({
  onSubmit,
  loading,
  dropdownOptions,
}: TicketFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TicketFormData>();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const selectedCategory = watch("category");

  // Filter subcategories based on selected category
  const filteredSubcategories = dropdownOptions.subcategories.filter(
    (subcategory) => subcategory.category_id === Number(selectedCategory)
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmitHandler = async (data: TicketFormData) => {
    try {
      let attachmentUrl = null;

      if (file) {
        // Verify session first
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError || !session) throw new Error("Not authenticated");

        // Create unique file path with user ID
        const fileExt = file.name.split(".").pop();
        const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;

        // Upload with error handling
        const { error: uploadError } = await supabase.storage
          .from("attachment") // Double-check this name!
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type || "application/octet-stream",
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("attachment").getPublicUrl(fileName);

        attachmentUrl = publicUrl;
      }

      const ticketData = {
        ...data,
        branch: Number(data.branch),
        category: Number(data.category),
        subcategory: data.subcategory ? Number(data.subcategory) : null,
        services: Number(data.services),
        network: data.network ? Number(data.network) : null,
        priority: Number(data.priority),
        attachment: attachmentUrl,
        status: 1,
      };

      await onSubmit(ticketData);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Branch */}
          <div className="space-y-2">
            <Label htmlFor="branch">Branch</Label>
            <Select
              onValueChange={(value) => setValue("branch", Number(value))}
              {...register("branch", { required: "Branch is required" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                {dropdownOptions.branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id.toString()}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.branch && (
              <p className="text-sm text-red-500">{errors.branch.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              onValueChange={(value) => setValue("category", Number(value))}
              {...register("category", { required: "Category is required" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {dropdownOptions.categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          {/* Service */}
          <div className="space-y-2">
            <Label htmlFor="services">Service</Label>
            <Select
              onValueChange={(value) => setValue("services", Number(value))}
              {...register("services", { required: "Service is required" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                {dropdownOptions.services.map((service) => (
                  <SelectItem key={service.id} value={service.id.toString()}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.services && (
              <p className="text-sm text-red-500">{errors.services.message}</p>
            )}
          </div>

          {/* Subcategory */}
          <div className="space-y-2">
            <Label htmlFor="subcategory">Subcategory</Label>
            <Select
              onValueChange={(value) => setValue("subcategory", Number(value))}
              {...register("subcategory")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subcategory (optional)" />
              </SelectTrigger>
              <SelectContent>
                {filteredSubcategories.map((subcategory) => (
                  <SelectItem
                    key={subcategory.id}
                    value={subcategory.id.toString()}
                  >
                    {subcategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Network */}
          <div className="space-y-2">
            <Label htmlFor="network">Network</Label>
            <Select
              onValueChange={(value) => setValue("network", Number(value))}
              {...register("network")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select network (optional)" />
              </SelectTrigger>
              <SelectContent>
                {dropdownOptions.networks.map((network) => (
                  <SelectItem key={network.id} value={network.id.toString()}>
                    {network.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              onValueChange={(value) => setValue("priority", Number(value))}
              {...register("priority", { required: "Priority is required" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {dropdownOptions.priorities
                  .sort((a, b) => (a.level || 0) - (b.level || 0))
                  .map((priority) => (
                    <SelectItem
                      key={priority.id}
                      value={priority.id.toString()}
                    >
                      {priority.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.priority && (
              <p className="text-sm text-red-500">{errors.priority.message}</p>
            )}
          </div>
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            {...register("subject", { required: "Subject is required" })}
            placeholder="Briefly describe your issue"
          />
          {errors.subject && (
            <p className="text-sm text-red-500">{errors.subject.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register("description", {
              required: "Description is required",
            })}
            placeholder="Provide detailed information about your issue"
            rows={5}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Attachment */}
        <div className="space-y-2">
          <Label htmlFor="attachment">Attachment (optional)</Label>
          <Input
            id="attachment"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <p className="text-sm text-gray-500">
            Upload any relevant files (PDF, DOC, JPG, PNG)
          </p>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (optional)</Label>
          <Input
            id="tags"
            {...register("tags")}
            placeholder="Comma-separated tags (e.g., urgent, hardware, software)"
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Ticket"}
          </Button>
        </div>
      </form>
    </div>
  );
};
