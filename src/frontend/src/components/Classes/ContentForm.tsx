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
import { FileUp, Paperclip } from "lucide-react";
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
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleChange = (
    field: keyof ClassContent,
    value: string | ContentType | ClassLevel | bigint,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleContentTypeChange = (v: ContentType) => {
    setForm((prev) => ({ ...prev, contentType: v, url: "", body: "" }));
    setSelectedFileName("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      handleChange("url", dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit(form);
  };

  const inputClass =
    "bg-[oklch(0.1_0_0)] border-[oklch(0.3_0.02_91.7)] focus:border-primary text-foreground placeholder:text-muted-foreground";

  const isFileBased =
    form.contentType === ContentType.pdf ||
    form.contentType === ContentType.worksheet;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-foreground text-sm font-body">
          Content Type
        </Label>
        <Select
          value={form.contentType}
          onValueChange={(v) => handleContentTypeChange(v as ContentType)}
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

      {/* File upload for PDF / Worksheet — uses <label> for native accessibility */}
      {isFileBased && (
        <div>
          <span className="block text-foreground text-sm font-body mb-1">
            {form.contentType === ContentType.pdf
              ? "PDF File"
              : "Worksheet File"}
          </span>
          <label
            data-ocid="class.content.file.upload_button"
            className={`
              mt-1 cursor-pointer rounded-lg border-2 border-dashed transition-colors
              flex items-center gap-3 px-4 py-3
              ${
                selectedFileName
                  ? "border-primary bg-[oklch(0.12_0.03_91.7)]"
                  : "border-[oklch(0.3_0.02_91.7)] bg-[oklch(0.1_0_0)] hover:border-primary hover:bg-[oklch(0.13_0.02_91.7)]"
              }
            `}
          >
            {selectedFileName ? (
              <>
                <Paperclip className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-foreground truncate">
                  {selectedFileName}
                </span>
              </>
            ) : (
              <>
                <FileUp className="h-5 w-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-primary font-medium">
                      Click to choose file
                    </span>{" "}
                    from your device
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    PDF, DOC, DOCX, JPG, PNG
                  </p>
                </div>
              </>
            )}
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="sr-only"
              aria-label="Upload file"
            />
          </label>
        </div>
      )}

      {/* URL input for Video / Test */}
      {(form.contentType === ContentType.video ||
        form.contentType === ContentType.test) && (
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

      {/* Body textarea for Message */}
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
