import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;
    onUpload({ title, caption, imageUrl });
    setTitle("");
    setCaption("");
    setImageUrl("");
  };

  const inputClass =
    "bg-[oklch(0.1_0_0)] border-[oklch(0.3_0.02_91.7)] focus:border-primary text-foreground placeholder:text-muted-foreground";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <Label className="text-foreground text-sm font-body">Photo URL *</Label>
        <Input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://..."
          className={inputClass}
          required
        />
      </div>
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
        disabled={isLoading}
        data-ocid="gallery.upload.upload_button"
        className="w-full bg-primary text-primary-foreground hover:bg-gold-light font-heading"
      >
        <Upload className="h-4 w-4 mr-2" />
        {isLoading ? "Adding..." : "Add Photo"}
      </Button>
    </form>
  );
}
