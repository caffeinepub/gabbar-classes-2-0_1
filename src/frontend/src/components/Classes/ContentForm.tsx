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
import { useFileUpload } from "@/hooks/useFileUpload";
import { ContentType } from "@/hooks/useQueries";
import { FileUp, HardDrive, Loader2, Paperclip, Upload } from "lucide-react";
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

type FileInputMode = "upload" | "drive";

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileInputMode, setFileInputMode] = useState<FileInputMode>("upload");

  const { uploadFile } = useFileUpload();

  const handleChange = (
    field: keyof ClassContent,
    value: string | ContentType | ClassLevel | bigint,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleContentTypeChange = (v: ContentType) => {
    setForm((prev) => ({ ...prev, contentType: v, url: "", body: "" }));
    setSelectedFileName("");
    setUploadProgress(0);
    setFileInputMode("upload");
  };

  const handleFileModeChange = (mode: FileInputMode) => {
    setFileInputMode(mode);
    // Clear URL when switching modes
    handleChange("url", "");
    setSelectedFileName("");
    setUploadProgress(0);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    handleChange("url", ""); // Clear previous URL while uploading
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const cdnUrl = await uploadFile(file, (pct) => setUploadProgress(pct));
      handleChange("url", cdnUrl);
    } catch (err) {
      console.error("File upload failed:", err);
      setSelectedFileName("");
      handleChange("url", "");
    } finally {
      setIsUploading(false);
    }
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

  const isBusy = isLoading || isUploading;

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

      {/* File-based section for PDF / Worksheet */}
      {isFileBased && (
        <div>
          <span className="block text-foreground text-sm font-body mb-2">
            {form.contentType === ContentType.pdf
              ? "PDF File"
              : "Worksheet File"}
          </span>

          {/* Mode toggle: Upload vs Google Drive */}
          <div
            data-ocid="class.content.drive_link.toggle"
            className="flex items-center gap-1 p-1 bg-[oklch(0.1_0_0)] rounded-lg border border-[oklch(0.25_0.02_91.7)] mb-3 w-fit"
          >
            <button
              type="button"
              onClick={() => handleFileModeChange("upload")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-heading font-semibold transition-all ${
                fileInputMode === "upload"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Upload className="h-3 w-3" />
              Upload File
            </button>
            <button
              type="button"
              onClick={() => handleFileModeChange("drive")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-heading font-semibold transition-all ${
                fileInputMode === "drive"
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <HardDrive className="h-3 w-3" />
              Google Drive Link
            </button>
          </div>

          {/* Upload from device */}
          {fileInputMode === "upload" && (
            <label
              data-ocid="class.content.file.upload_button"
              className={`
                mt-1 cursor-pointer rounded-lg border-2 border-dashed transition-colors
                flex items-center gap-3 px-4 py-3
                ${
                  isUploading
                    ? "border-primary bg-[oklch(0.12_0.03_91.7)] cursor-wait"
                    : selectedFileName && form.url
                      ? "border-primary bg-[oklch(0.12_0.03_91.7)]"
                      : "border-[oklch(0.3_0.02_91.7)] bg-[oklch(0.1_0_0)] hover:border-primary hover:bg-[oklch(0.13_0.02_91.7)]"
                }
              `}
            >
              {isUploading ? (
                <div className="flex items-center gap-3 w-full">
                  <Loader2 className="h-5 w-5 text-primary shrink-0 animate-spin" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-primary font-medium truncate">
                      Uploading {selectedFileName}... {uploadProgress}%
                    </p>
                    <div className="mt-1 h-1 rounded-full bg-[oklch(0.2_0_0)] overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : selectedFileName && form.url ? (
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
                disabled={isUploading}
              />
            </label>
          )}

          {/* Google Drive link input */}
          {fileInputMode === "drive" && (
            <div className="space-y-2">
              <Input
                data-ocid="class.content.drive_link.input"
                value={form.url}
                onChange={(e) => handleChange("url", e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
                className="bg-[oklch(0.1_0_0)] border-emerald-700/50 focus:border-emerald-500 text-foreground placeholder:text-muted-foreground"
              />
              <p className="text-muted-foreground/70 text-xs font-body">
                Google Drive link paste karein. Make sure &quot;Anyone with the
                link&quot; access is on.
              </p>
            </div>
          )}
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
          disabled={isBusy}
          data-ocid="class.content.save_button"
          className="flex-1 bg-primary text-primary-foreground hover:bg-gold-light font-heading"
        >
          {isBusy ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isUploading ? "Uploading file..." : "Adding..."}
            </>
          ) : (
            "Add Content"
          )}
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
