import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFileUpload } from "@/hooks/useFileUpload";
import {
  FileUp,
  HardDrive,
  ImagePlus,
  Loader2,
  Paperclip,
  Upload,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type FileInputMode = "upload" | "drive";

interface PhotoUploaderProps {
  onUpload: (data: {
    title: string;
    caption: string;
    imageUrl: string;
  }) => void;
  isLoading?: boolean;
  /** If provided, shows category label in save button */
  categoryLabel?: string;
}

export default function PhotoUploader({
  onUpload,
  isLoading,
  categoryLabel,
}: PhotoUploaderProps) {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileInputMode, setFileInputMode] = useState<FileInputMode>("upload");
  const [driveLink, setDriveLink] = useState("");

  const { uploadFile } = useFileUpload();

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Sirf image files allowed hain (JPG, PNG, GIF, WebP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size 10MB se kam honi chahiye.");
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setImageUrl("");

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const cdnUrl = await uploadFile(file, (pct) => setUploadProgress(pct));
      if (!cdnUrl || cdnUrl.trim() === "") {
        throw new Error("CDN URL empty returned");
      }
      setImageUrl(cdnUrl);
      toast.success("Photo successfully upload ho gaya!");
    } catch (err) {
      console.error("Photo upload failed:", err);
      toast.error("Photo upload nahi ho saka. Dobara try karein.");
      URL.revokeObjectURL(localPreview);
      setPreviewUrl("");
      setImageUrl("");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const clearImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageUrl("");
    setPreviewUrl("");
  };

  const handleFileModeChange = (mode: FileInputMode) => {
    setFileInputMode(mode);
    setImageUrl("");
    setDriveLink("");
    clearImage();
    setUploadProgress(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = fileInputMode === "drive" ? driveLink.trim() : imageUrl;
    if (!finalUrl) return;
    onUpload({ title, caption, imageUrl: finalUrl });
    // Reset form
    setTitle("");
    setCaption("");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageUrl("");
    setPreviewUrl("");
    setUploadProgress(0);
    setDriveLink("");
    setFileInputMode("upload");
  };

  const inputClass =
    "bg-[oklch(0.1_0_0)] border-[oklch(0.3_0.02_91.7)] focus:border-primary text-foreground placeholder:text-muted-foreground";

  const isBusy = isLoading || isUploading;
  const finalUrl = fileInputMode === "drive" ? driveLink.trim() : imageUrl;
  const canSubmit = !isBusy && !!finalUrl;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <Label className="text-foreground text-sm font-body mb-1 block">
          Photo Title
        </Label>
        <Input
          data-ocid="gallery.photo.input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Classroom, Annual Day 2024"
          className={inputClass}
        />
      </div>

      {/* Caption */}
      <div>
        <Label className="text-foreground text-sm font-body mb-1 block">
          Caption{" "}
          <span className="text-muted-foreground/60 text-xs">(optional)</span>
        </Label>
        <Input
          data-ocid="gallery.photo.textarea"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Brief description..."
          className={inputClass}
        />
      </div>

      {/* Mode toggle: Upload vs Google Drive */}
      <div>
        <span className="block text-foreground text-sm font-body mb-2">
          Photo Source
        </span>
        <div
          data-ocid="gallery.photo.toggle"
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
          <>
            {!previewUrl ? (
              <label
                data-ocid="gallery.photo.dropzone"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
                  block cursor-pointer rounded-lg border-2 border-dashed transition-colors
                  flex flex-col items-center justify-center gap-2 py-8 px-4
                  ${
                    isDragging
                      ? "border-primary bg-[oklch(0.15_0.04_91.7)]"
                      : "border-[oklch(0.3_0.02_91.7)] bg-[oklch(0.1_0_0)] hover:border-primary hover:bg-[oklch(0.13_0.02_91.7)]"
                  }
                `}
              >
                <ImagePlus className="h-8 w-8 text-primary opacity-80" />
                <p className="text-sm text-muted-foreground text-center">
                  <span className="text-primary font-medium">
                    Click to choose
                  </span>{" "}
                  or drag &amp; drop a photo
                </p>
                <p className="text-xs text-muted-foreground/60">
                  JPG, PNG, GIF, WebP (max 10MB)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                  aria-label="Upload photo"
                />
              </label>
            ) : (
              <div className="relative rounded-lg overflow-hidden border border-[oklch(0.3_0.02_91.7)] bg-[oklch(0.1_0_0)]">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
                {!isUploading && (
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 rounded-full bg-[oklch(0.08_0_0)]/80 p-1 text-foreground hover:bg-destructive hover:text-white transition-colors"
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                {isUploading ? (
                  <div className="px-3 py-2 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-primary font-medium">
                        Uploading... {uploadProgress}%
                      </p>
                      <div className="mt-1 h-1 rounded-full bg-[oklch(0.2_0_0)] overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : imageUrl ? (
                  <div className="px-3 py-2 flex items-center gap-1.5">
                    <Paperclip className="h-3 w-3 text-green-400" />
                    <p className="text-xs text-green-400">
                      Photo ready to save
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-destructive px-3 py-2">
                    ✗ Upload failed — please try again
                  </p>
                )}
              </div>
            )}

            {/* Alternative: also show file picker label when no preview */}
            {!previewUrl && (
              <label className="mt-2 cursor-pointer rounded-lg border border-dashed border-[oklch(0.25_0.02_91.7)] transition-colors flex items-center gap-3 px-4 py-3 bg-[oklch(0.1_0_0)] hover:border-primary hover:bg-[oklch(0.13_0.02_91.7)] hidden">
                <FileUp className="h-5 w-5 text-muted-foreground shrink-0" />
                <span className="text-sm text-primary font-medium">
                  Choose from device
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            )}
          </>
        )}

        {/* Google Drive link input */}
        {fileInputMode === "drive" && (
          <div className="space-y-2">
            <Input
              data-ocid="gallery.drive.input"
              value={driveLink}
              onChange={(e) => setDriveLink(e.target.value)}
              placeholder="https://drive.google.com/file/d/..."
              className="bg-[oklch(0.1_0_0)] border-emerald-700/50 focus:border-emerald-500 text-foreground placeholder:text-muted-foreground"
            />
            <p className="text-muted-foreground/70 text-xs font-body">
              Google Drive mein file/photo open karein → Share → &quot;Anyone
              with the link&quot; enable karein → link copy karein aur paste
              karein.
            </p>
          </div>
        )}
      </div>

      {/* Save button */}
      <Button
        type="submit"
        disabled={!canSubmit}
        data-ocid="gallery.photo.save_button"
        className="w-full bg-primary text-primary-foreground hover:bg-gold-light font-heading disabled:opacity-50"
      >
        {isBusy ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {isUploading ? "Uploading..." : "Saving..."}
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Save{categoryLabel ? ` to ${categoryLabel}` : " Photo"}
          </>
        )}
      </Button>
    </form>
  );
}
