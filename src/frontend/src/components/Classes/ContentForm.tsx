import type { ClassContent, ClassLevel } from "@/backend.d";
import { Button } from "@/components/ui/button";
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
import { ContentType } from "@/hooks/useQueries";
import { useState } from "react";

interface ContentFormProps {
  classLevel: ClassLevel;
  onSubmit: (content: ClassContent) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

function generateId() {
  return `content_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export default function ContentForm({
  classLevel,
  onSubmit,
  onCancel,
  isLoading,
}: ContentFormProps) {
  const [form, setForm] = useState<ClassContent>({
    id: generateId(),
    title: "",
    description: "",
    url: "",
    body: "",
    contentType: ContentType.pdf,
    classLevel,
    createdAt: BigInt(Date.now()),
  });

  const handleChange = (
    field: keyof ClassContent,
    value: string | ContentType | ClassLevel | bigint,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit(form);
  };

  const inputClass =
    "bg-[oklch(0.1_0_0)] border-[oklch(0.3_0.02_91.7)] focus:border-primary text-foreground placeholder:text-muted-foreground";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-foreground text-sm font-body">
          Content Type
        </Label>
        <Select
          value={form.contentType}
          onValueChange={(v) => handleChange("contentType", v as ContentType)}
        >
          <SelectTrigger className={inputClass}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[oklch(0.13_0_0)] border-[oklch(0.25_0.02_91.7)]">
            <SelectItem value={ContentType.pdf}>PDF</SelectItem>
            <SelectItem value={ContentType.worksheet}>Worksheet</SelectItem>
            <SelectItem value={ContentType.video}>Video</SelectItem>
            <SelectItem value={ContentType.test}>Test</SelectItem>
            <SelectItem value={ContentType.message}>Message</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-foreground text-sm font-body">Title *</Label>
        <Input
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Content title"
          className={inputClass}
          required
        />
      </div>
      <div>
        <Label className="text-foreground text-sm font-body">Description</Label>
        <Input
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Brief description"
          className={inputClass}
        />
      </div>
      {form.contentType !== ContentType.message && (
        <div>
          <Label className="text-foreground text-sm font-body">
            Resource URL
          </Label>
          <Input
            value={form.url}
            onChange={(e) => handleChange("url", e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        </div>
      )}
      {form.contentType === ContentType.message && (
        <div>
          <Label className="text-foreground text-sm font-body">
            Message Body
          </Label>
          <Textarea
            value={form.body}
            onChange={(e) => handleChange("body", e.target.value)}
            placeholder="Write your message here..."
            className={`${inputClass} resize-none h-24`}
          />
        </div>
      )}
      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          data-ocid="class.content.save_button"
          className="flex-1 bg-primary text-primary-foreground hover:bg-gold-light font-heading"
        >
          {isLoading ? "Adding..." : "Add Content"}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          data-ocid="class.content.cancel_button"
          variant="outline"
          className="border-[oklch(0.3_0.02_91.7)] text-muted-foreground hover:text-foreground"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
