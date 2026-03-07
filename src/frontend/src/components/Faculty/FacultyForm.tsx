import type { Faculty } from "@/backend.d";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface FacultyFormProps {
  initial?: Partial<Faculty>;
  onSubmit: (data: Faculty) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

function generateId() {
  return `fac_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export default function FacultyForm({
  initial,
  onSubmit,
  onCancel,
  isLoading,
}: FacultyFormProps) {
  const [form, setForm] = useState<Faculty>({
    id: initial?.id ?? generateId(),
    name: initial?.name ?? "",
    subject: initial?.subject ?? "",
    qualification: initial?.qualification ?? "",
    bio: initial?.bio ?? "",
    photoUrl: initial?.photoUrl ?? "",
    displayOrder: initial?.displayOrder ?? 0n,
  });

  const handleChange = (field: keyof Faculty, value: string | bigint) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.subject.trim()) return;
    onSubmit(form);
  };

  const inputClass =
    "bg-[oklch(0.1_0_0)] border-[oklch(0.3_0.02_91.7)] focus:border-primary text-foreground placeholder:text-muted-foreground";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label
          htmlFor="faculty-name"
          className="text-foreground text-sm font-body"
        >
          Full Name *
        </Label>
        <Input
          id="faculty-name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="e.g. Priya Sharma"
          className={inputClass}
          required
        />
      </div>
      <div>
        <Label
          htmlFor="faculty-subject"
          className="text-foreground text-sm font-body"
        >
          Subject *
        </Label>
        <Input
          id="faculty-subject"
          value={form.subject}
          onChange={(e) => handleChange("subject", e.target.value)}
          placeholder="e.g. Mathematics"
          className={inputClass}
          required
        />
      </div>
      <div>
        <Label
          htmlFor="faculty-bio"
          className="text-foreground text-sm font-body"
        >
          About / Information
        </Label>
        <Textarea
          id="faculty-bio"
          value={form.bio}
          onChange={(e) => handleChange("bio", e.target.value)}
          placeholder="Write about the faculty member, their experience, achievements..."
          className={`${inputClass} resize-none h-28`}
        />
      </div>
      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          data-ocid="faculty.save_button"
          className="flex-1 bg-primary text-primary-foreground hover:bg-gold-light font-heading"
        >
          {isLoading
            ? "Saving..."
            : initial?.id
              ? "Update Faculty"
              : "Add Faculty"}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          data-ocid="faculty.cancel_button"
          variant="outline"
          className="border-[oklch(0.3_0.02_91.7)] text-muted-foreground hover:text-foreground"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
