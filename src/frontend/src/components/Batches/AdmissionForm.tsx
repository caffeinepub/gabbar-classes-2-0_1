import type { AdmissionInquiry } from "@/backend.d";
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
import { useSubmitAdmissionInquiry } from "@/hooks/useQueries";
import { ClassLevel } from "@/hooks/useQueries";
import { useState } from "react";
import { toast } from "sonner";

const CLASS_LEVEL_LABELS: Record<ClassLevel, string> = {
  [ClassLevel.Nursery]: "Nursery",
  [ClassLevel.Class1]: "Class 1",
  [ClassLevel.Class2]: "Class 2",
  [ClassLevel.Class3]: "Class 3",
  [ClassLevel.Class4]: "Class 4",
  [ClassLevel.Class5]: "Class 5",
  [ClassLevel.Class6]: "Class 6",
  [ClassLevel.Class7]: "Class 7",
  [ClassLevel.Class8]: "Class 8",
};

function generateId() {
  return `inq_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export default function AdmissionForm() {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    classLevel: ClassLevel.Class1 as ClassLevel,
    message: "",
  });

  const { mutateAsync, isPending } = useSubmitAdmissionInquiry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const inquiry: AdmissionInquiry = {
        id: generateId(),
        name: form.name,
        mobile: form.mobile,
        email: form.email,
        classLevel: form.classLevel,
        message: form.message,
        createdAt: BigInt(Date.now()),
        isRead: false,
      };
      await mutateAsync(inquiry);
      toast.success("Inquiry submitted successfully! We'll contact you soon.");
      setForm({
        name: "",
        mobile: "",
        email: "",
        classLevel: ClassLevel.Class1,
        message: "",
      });
    } catch {
      toast.error("Failed to submit. Please try again.");
    }
  };

  const inputClass =
    "bg-[oklch(0.1_0_0)] border-[oklch(0.3_0.02_91.7)] focus:border-primary text-foreground placeholder:text-muted-foreground";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor="adm-name"
            className="text-foreground text-sm font-body"
          >
            Student Name *
          </Label>
          <Input
            id="adm-name"
            data-ocid="admission.name.input"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Full name"
            className={inputClass}
            required
          />
        </div>
        <div>
          <Label
            htmlFor="adm-mobile"
            className="text-foreground text-sm font-body"
          >
            Mobile Number *
          </Label>
          <Input
            id="adm-mobile"
            data-ocid="admission.mobile.input"
            type="tel"
            value={form.mobile}
            onChange={(e) => setForm((p) => ({ ...p, mobile: e.target.value }))}
            placeholder="10-digit mobile"
            className={inputClass}
            pattern="[0-9]{10}"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor="adm-email"
            className="text-foreground text-sm font-body"
          >
            Email
          </Label>
          <Input
            id="adm-email"
            data-ocid="admission.email.input"
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="email@example.com"
            className={inputClass}
          />
        </div>
        <div>
          <Label className="text-foreground text-sm font-body">
            Class Applying For *
          </Label>
          <Select
            value={form.classLevel}
            onValueChange={(v) =>
              setForm((p) => ({ ...p, classLevel: v as ClassLevel }))
            }
          >
            <SelectTrigger
              data-ocid="admission.class.select"
              className={inputClass}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[oklch(0.13_0_0)] border-[oklch(0.25_0.02_91.7)]">
              {Object.entries(CLASS_LEVEL_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label
          htmlFor="adm-message"
          className="text-foreground text-sm font-body"
        >
          Message (optional)
        </Label>
        <Textarea
          id="adm-message"
          data-ocid="admission.message.textarea"
          value={form.message}
          onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
          placeholder="Any specific queries or requirements..."
          className={`${inputClass} resize-none h-24`}
        />
      </div>
      <Button
        type="submit"
        disabled={isPending}
        data-ocid="admission.submit.submit_button"
        className="w-full bg-primary text-primary-foreground hover:bg-gold-light font-heading font-bold text-base py-5 gold-glow transition-all duration-300"
      >
        {isPending ? "Submitting..." : "Submit Inquiry"}
      </Button>
    </form>
  );
}
