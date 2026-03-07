import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus, Upload, X } from "lucide-react";
import { useState } from "react";

interface PhotoUploaderProps {
  onUpload: (data: {
    title: string;
    caption: string;
    imageUrl: string;
  }) => void;
  isLoading?: boolean;
}

export default function PhotoUploader({
  onUpload,
  isLoading,
}: PhotoUploaderProps) {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImageUrl(dataUrl);
      setPreviewUrl(dataUrl);
    };
    reader.readAsDataURL(file);
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
    setImageUrl("");
    setPreviewUrl("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return;
    onUpload({ title, caption, imageUrl });
    setTitle("");
    setCaption("");
    setImageUrl("");
    setPreviewUrl("");
  };

  const inputClass =
    "bg-[oklch(0.1_0_0)] border-[oklch(0.3_0.02_91.7)] focus:border-primary text-foreground placeholder:text-muted-foreground";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* File drop zone / picker */}
      {!previewUrl ? (
        <label
          data-ocid="gallery.upload.dropzone"
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
            <span className="text-primary font-medium">Click to choose</span> or
            drag &amp; drop a photo
          </p>
          <p className="text-xs text-muted-foreground/60">
            JPG, PNG, GIF, WebP supported
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
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 rounded-full bg-[oklch(0.08_0_0)]/80 p-1 text-foreground hover:bg-destructive hover:text-white transition-colors"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="text-xs text-muted-foreground px-3 py-2">
            ✓ Photo selected — ready to upload
          </p>
        </div>
      )}

      <div>
        <Label className="text-foreground text-sm font-body">Title</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Photo title"
          className={inputClass}
        />
      </div>
      <div>
        <Label className="text-foreground text-sm font-body">Caption</Label>
        <Input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Brief caption..."
          className={inputClass}
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading || !imageUrl}
        data-ocid="gallery.upload.upload_button"
        className="w-full bg-primary text-primary-foreground hover:bg-gold-light font-heading disabled:opacity-50"
      >
        <Upload className="h-4 w-4 mr-2" />
        {isLoading ? "Uploading..." : "Upload Photo"}
      </Button>
    </form>
  );
}
