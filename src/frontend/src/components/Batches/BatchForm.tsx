import type { Batch } from "@/backend.d";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface BatchFormProps {
  initial?: Partial<Batch>;
  onSubmit: (data: Batch) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

function generateId() {
  return `batch_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export default function BatchForm({
  initial,
  onSubmit,
  onCancel,
  isLoading,
}: BatchFormProps) {
  const [form, setForm] = useState<Batch>({
    id: initial?.id ?? generateId(),
    batchName: initial?.batchName ?? "",
    className: initial?.className ?? "",
    timing: initial?.timing ?? "",
    schedule: initial?.schedule ?? "",
    fee: initial?.fee ?? 0n,
    totalSeats: initial?.totalSeats ?? 30n,
    availableSeats: initial?.availableSeats ?? 30n,
    isActive: initial?.isActive ?? true,
    startDate: initial?.startDate ?? BigInt(Date.now()),
  });

  const handleChange = (
    field: keyof Batch,
    value: string | boolean | bigint,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const inputClass =
    "bg-[oklch(0.1_0_0)] border-[oklch(0.3_0.02_91.7)] focus:border-primary text-foreground placeholder:text-muted-foreground";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-foreground text-sm font-body">
            Batch Name *
          </Label>
          <Input
            value={form.batchName}
            onChange={(e) => handleChange("batchName", e.target.value)}
            placeholder="e.g. Morning Batch A"
            className={inputClass}
            required
          />
        </div>
        <div>
          <Label className="text-foreground text-sm font-body">Class *</Label>
          <Input
            value={form.className}
            onChange={(e) => handleChange("className", e.target.value)}
            placeholder="e.g. Class 5"
            className={inputClass}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-foreground text-sm font-body">Timing *</Label>
          <Input
            value={form.timing}
            onChange={(e) => handleChange("timing", e.target.value)}
            placeholder="e.g. 7:00 AM – 9:00 AM"
            className={inputClass}
            required
          />
        </div>
        <div>
          <Label className="text-foreground text-sm font-body">Schedule</Label>
          <Input
            value={form.schedule}
            onChange={(e) => handleChange("schedule", e.target.value)}
            placeholder="e.g. Mon–Sat"
            className={inputClass}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label className="text-foreground text-sm font-body">
            Monthly Fee (₹)
          </Label>
          <Input
            type="number"
            value={Number(form.fee)}
            onChange={(e) => handleChange("fee", BigInt(e.target.value || "0"))}
            placeholder="1500"
            className={inputClass}
          />
        </div>
        <div>
          <Label className="text-foreground text-sm font-body">
            Total Seats
          </Label>
          <Input
            type="number"
            value={Number(form.totalSeats)}
            onChange={(e) =>
              handleChange("totalSeats", BigInt(e.target.value || "0"))
            }
            className={inputClass}
          />
        </div>
        <div>
          <Label className="text-foreground text-sm font-body">
            Available Seats
          </Label>
          <Input
            type="number"
            value={Number(form.availableSeats)}
            onChange={(e) =>
              handleChange("availableSeats", BigInt(e.target.value || "0"))
            }
            className={inputClass}
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Switch
          checked={form.isActive}
          onCheckedChange={(v) => handleChange("isActive", v)}
          data-ocid="batches.active.switch"
          className="data-[state=checked]:bg-primary"
        />
        <Label className="text-foreground text-sm font-body">
          Active Batch
        </Label>
      </div>
      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          data-ocid="batches.save_button"
          className="flex-1 bg-primary text-primary-foreground hover:bg-gold-light font-heading"
        >
          {isLoading ? "Saving..." : initial?.id ? "Update Batch" : "Add Batch"}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          data-ocid="batches.cancel_button"
          variant="outline"
          className="border-[oklch(0.3_0.02_91.7)] text-muted-foreground hover:text-foreground"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
