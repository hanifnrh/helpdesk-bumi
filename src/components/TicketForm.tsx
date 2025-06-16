// src/components/TicketForm.tsx
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/utils/supabase";
import { TicketFormData } from "@/types/ticket";
import { CloudUpload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Combobox } from "./ui/combobox";
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
    categories: { id: number; name: string; service_id?: number }[];
    services: { id: number; name: string }[];
    subcategories: { id: number; name: string; category_id?: number }[];
    networks: { id: number; name: string; category_id?: number }[];
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
  const selectedService = watch("services");

  // Filter subcategories based on selected category
  const filteredCategories = dropdownOptions.categories.filter(
    (category) => category.service_id === Number(selectedService)
  );

  const filteredSubcategories = dropdownOptions.subcategories.filter(
    (subcategory) => subcategory.category_id === Number(selectedCategory)
  );

  const filteredNetworks = dropdownOptions.networks.filter(
    (network) => network.category_id === Number(selectedCategory)
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

        const fileExt = file.name.split(".").pop();
        const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("attachment")
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
    <div className="bg-white dmsans-regular rounded-lg shadow p-6">
      <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Branch */}
          <div className="space-y-2">
            <Label htmlFor="branch">
              Branch <span className="text-red-500">*</span>
            </Label>
            <Combobox
              options={dropdownOptions.branches.map(b => ({
                value: b.id.toString(),
                label: b.name
              }))}
              value={watch("branch")?.toString() || ""}
              onValueChange={(value) => setValue("branch", Number(value))}
              placeholder="Select branch"
              disabled={loading}
            />
            {errors.branch && (
              <p className="text-sm text-red-500">{errors.branch.message}</p>
            )}
          </div>

          {/* Service */}
          <div className="space-y-2">
            <Label htmlFor="services">
              Service <span className="text-red-500">*</span>
            </Label>
            <Combobox
              options={dropdownOptions.services.map(s => ({
                value: s.id.toString(),
                label: s.name
              }))}
              value={watch("services")?.toString() || ""}
              onValueChange={(value) => setValue("services", Number(value))}
              placeholder="Select service"
              disabled={loading}
            />
            {errors.services && (
              <p className="text-sm text-red-500">{errors.services.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-red-500">*</span>
            </Label>
            <Combobox
              options={filteredCategories.map(c => ({
                value: c.id.toString(),
                label: c.name
              }))}
              value={watch("category")?.toString() || ""}
              onValueChange={(value) => setValue("category", Number(value))}
              placeholder={selectedService ? "Select category" : "Select service first"}
              disabled={!selectedService || loading}
            />
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          {/* Subcategory */}
          <div className="space-y-2">
            <Label htmlFor="subcategory">Subcategory <span className="text-red-500">*</span></Label>
            <Combobox
              options={filteredSubcategories.map(sc => ({
                value: sc.id.toString(),
                label: sc.name
              }))}
              value={watch("subcategory")?.toString() || ""}
              onValueChange={(value) => setValue("subcategory", Number(value))}
              placeholder={selectedCategory ? "Select subcategory" : "Select category first"}
              disabled={!selectedCategory || loading}
            />
          </div>

          {/* Network */}
          <div className="space-y-2">
            <Label htmlFor="network">Network (optional)</Label>
            <Combobox
              options={filteredNetworks.map(n => ({
                value: n.id.toString(),
                label: n.name
              }))}
              value={watch("network")?.toString() || ""}
              onValueChange={(value) => setValue("network", Number(value))}
              placeholder={selectedCategory ? "Select network" : "Select category first"}
              disabled={!selectedCategory || loading}
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">
              Priority <span className="text-red-500">*</span>
            </Label>
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
                      className="dmsans-light"
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
          <Label htmlFor="subject">
            Subject <span className="text-red-500">*</span>
          </Label>
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
          <Label htmlFor="description">
            Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            {...register("description", {
              required: "Description is required",
            })}
            placeholder="Provide detailed information about your issue"
            rows={5}
            className="dmsans-light"
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
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileChange}
          />

          {!file ? (
            <div
              onClick={() => document.getElementById("attachment")?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const droppedFile = e.dataTransfer.files?.[0];
                if (droppedFile) {
                  const fakeEvent = {
                    target: { files: [droppedFile] },
                  } as unknown as React.ChangeEvent<HTMLInputElement>;
                  handleFileChange(fakeEvent);
                }
              }}
              className="flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition hover:bg-blue-50"
            >
              <CloudUpload className="text-muted-foreground" />
              <div className="text-muted-foreground text-sm">
                Click or drag and drop a file here
              </div>
              <p className="text-xs text-gray-500">
                Supported formats: PDF, DOC, JPG, PNG
              </p>
            </div>
          ) : (
            <div className="relative rounded-lg border p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground truncate">
                  {file.name}
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-sm px-2 py-1 rounded-md bg-red-100 text-red-500 hover:text-red-600 hover:bg-red-200 transition-all"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (optional)</Label>
          <Input
            id="tags"
            {...register("tags")}
            placeholder="Comma-separated tags (e.g., urgent, hardware, software)"
            className="dmsans-light"
          />
        </div>

        <div className="flex justify-center">
          <Button type="submit" disabled={loading} className="bg-blue-100 text-blue-500 hover:bg-blue-200 hover:text-blue-700 transition-all font-semibold">
            {loading ? "Creating..." : "Create Ticket"}
          </Button>
        </div>
      </form>
    </div>
  );
};
