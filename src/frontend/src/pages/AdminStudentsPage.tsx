import type { StudentRecord } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ClassLevel,
  useAddStudentRecord,
  useDeleteStudentRecord,
  useIsAdmin,
  useStudentCountByClass,
  useStudentsByClass,
  useUpdateStudentRecord,
} from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  GraduationCap,
  Loader2,
  Pencil,
  Plus,
  Shield,
  Trash2,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const CLASS_OPTIONS: { value: ClassLevel; label: string }[] = [
  { value: ClassLevel.Nursery, label: "Nursery" },
  { value: ClassLevel.Class1, label: "Class 1" },
  { value: ClassLevel.Class2, label: "Class 2" },
  { value: ClassLevel.Class3, label: "Class 3" },
  { value: ClassLevel.Class4, label: "Class 4" },
  { value: ClassLevel.Class5, label: "Class 5" },
  { value: ClassLevel.Class6, label: "Class 6" },
  { value: ClassLevel.Class7, label: "Class 7" },
  { value: ClassLevel.Class8, label: "Class 8" },
];

function getClassLabel(level: ClassLevel): string {
  return CLASS_OPTIONS.find((c) => c.value === level)?.label ?? level;
}

function FeeStatusBadge({ status }: { status: string }) {
  if (status === "Paid") {
    return (
      <Badge className="bg-green-900/50 text-green-300 border border-green-700/50 font-body text-xs">
        Paid
      </Badge>
    );
  }
  if (status === "Partial") {
    return (
      <Badge className="bg-amber-900/50 text-amber-300 border border-amber-700/50 font-body text-xs">
        Partial
      </Badge>
    );
  }
  return (
    <Badge className="bg-red-900/50 text-red-300 border border-red-700/50 font-body text-xs">
      Pending
    </Badge>
  );
}

interface StudentFormData {
  studentName: string;
  fatherName: string;
  mobile: string;
  rollNo: string;
  totalFee: string;
  paidFee: string;
  dueDate: string;
  feeStatus: string;
}

const emptyForm: StudentFormData = {
  studentName: "",
  fatherName: "",
  mobile: "",
  rollNo: "",
  totalFee: "",
  paidFee: "",
  dueDate: "",
  feeStatus: "Pending",
};

function studentToForm(s: StudentRecord): StudentFormData {
  return {
    studentName: s.studentName,
    fatherName: s.fatherName,
    mobile: s.mobile,
    rollNo: s.rollNo,
    totalFee: Number(s.feeDetail.totalFee).toString(),
    paidFee: Number(s.feeDetail.paidFee).toString(),
    dueDate: s.feeDetail.dueDate,
    feeStatus: s.feeDetail.status,
  };
}

function StudentFormDialog({
  open,
  onOpenChange,
  classLevel,
  editTarget,
  onClose,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  classLevel: ClassLevel;
  editTarget?: StudentRecord;
  onClose: () => void;
}) {
  const addStudent = useAddStudentRecord();
  const updateStudent = useUpdateStudentRecord();
  const [form, setForm] = useState<StudentFormData>(
    editTarget ? studentToForm(editTarget) : emptyForm,
  );

  const isEditing = !!editTarget;
  const isPending = addStudent.isPending || updateStudent.isPending;

  const set = (key: keyof StudentFormData, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.studentName.trim()) {
      toast.error("Student name is required.");
      return;
    }
    if (!form.fatherName.trim()) {
      toast.error("Father name is required.");
      return;
    }
    if (!form.mobile.trim()) {
      toast.error("Mobile number is required.");
      return;
    }

    const record: StudentRecord = {
      id: editTarget?.id ?? crypto.randomUUID(),
      studentName: form.studentName.trim(),
      fatherName: form.fatherName.trim(),
      mobile: form.mobile.trim(),
      rollNo: form.rollNo.trim(),
      classLevel,
      createdAt: editTarget?.createdAt ?? BigInt(Date.now()) * 1_000_000n,
      feeDetail: {
        totalFee: BigInt(Math.round(Number.parseFloat(form.totalFee) || 0)),
        paidFee: BigInt(Math.round(Number.parseFloat(form.paidFee) || 0)),
        dueDate: form.dueDate.trim(),
        status: form.feeStatus,
      },
    };

    try {
      if (isEditing) {
        await updateStudent.mutateAsync({ id: editTarget!.id, data: record });
        toast.success("Student record updated!");
      } else {
        await addStudent.mutateAsync(record);
        toast.success("Student added successfully!");
      }
      onClose();
    } catch {
      toast.error("Failed to save student record. Please try again.");
    }
  };

  const inputClass =
    "bg-[oklch(0.13_0_0)] border-[oklch(0.3_0.02_91.7)] text-foreground font-body placeholder:text-muted-foreground/50 focus:border-primary h-10";
  const labelClass =
    "text-muted-foreground font-body text-xs uppercase tracking-wider";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-[oklch(0.13_0_0)] border-[oklch(0.3_0.02_91.7)] max-w-lg max-h-[90vh] overflow-y-auto"
        data-ocid="admin.student.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-gold-gradient font-display text-xl">
            {isEditing ? "Edit Student" : "Add New Student"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Student Name */}
          <div className="space-y-1.5">
            <Label className={labelClass}>Student Name *</Label>
            <Input
              data-ocid="admin.student.name.input"
              className={inputClass}
              placeholder="Enter student full name"
              value={form.studentName}
              onChange={(e) => set("studentName", e.target.value)}
            />
          </div>

          {/* Father Name */}
          <div className="space-y-1.5">
            <Label className={labelClass}>Father Name *</Label>
            <Input
              data-ocid="admin.student.father.input"
              className={inputClass}
              placeholder="Enter father's full name"
              value={form.fatherName}
              onChange={(e) => set("fatherName", e.target.value)}
            />
          </div>

          {/* Mobile */}
          <div className="space-y-1.5">
            <Label className={labelClass}>Mobile Number *</Label>
            <Input
              data-ocid="admin.student.mobile.input"
              className={inputClass}
              placeholder="e.g. 9876543210"
              value={form.mobile}
              onChange={(e) => set("mobile", e.target.value)}
            />
          </div>

          {/* Roll No */}
          <div className="space-y-1.5">
            <Label className={labelClass}>Roll Number</Label>
            <Input
              data-ocid="admin.student.rollno.input"
              className={inputClass}
              placeholder="e.g. 01"
              value={form.rollNo}
              onChange={(e) => set("rollNo", e.target.value)}
            />
          </div>

          {/* Fee Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className={labelClass}>Total Fee (₹)</Label>
              <Input
                data-ocid="admin.student.totalfee.input"
                className={inputClass}
                placeholder="e.g. 5000"
                type="number"
                min="0"
                value={form.totalFee}
                onChange={(e) => set("totalFee", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className={labelClass}>Paid Fee (₹)</Label>
              <Input
                data-ocid="admin.student.paidfee.input"
                className={inputClass}
                placeholder="e.g. 2500"
                type="number"
                min="0"
                value={form.paidFee}
                onChange={(e) => set("paidFee", e.target.value)}
              />
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-1.5">
            <Label className={labelClass}>Due Date</Label>
            <Input
              data-ocid="admin.student.duedate.input"
              className={inputClass}
              placeholder="e.g. 15 Jan 2026"
              value={form.dueDate}
              onChange={(e) => set("dueDate", e.target.value)}
            />
          </div>

          {/* Fee Status */}
          <div className="space-y-1.5">
            <Label className={labelClass}>Fee Status</Label>
            <Select
              value={form.feeStatus}
              onValueChange={(v) => set("feeStatus", v)}
            >
              <SelectTrigger
                data-ocid="admin.student.feestatus.select"
                className="bg-[oklch(0.13_0_0)] border-[oklch(0.3_0.02_91.7)] text-foreground font-body h-10"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[oklch(0.15_0_0)] border-[oklch(0.3_0.02_91.7)]">
                <SelectItem value="Paid" className="text-green-300 font-body">
                  Paid
                </SelectItem>
                <SelectItem
                  value="Partial"
                  className="text-amber-300 font-body"
                >
                  Partial
                </SelectItem>
                <SelectItem value="Pending" className="text-red-300 font-body">
                  Pending
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-3 pt-2">
          <Button
            data-ocid="admin.student.cancel_button"
            variant="outline"
            onClick={onClose}
            className="border-[oklch(0.3_0.02_91.7)] text-muted-foreground hover:text-foreground font-body"
          >
            Cancel
          </Button>
          <Button
            data-ocid="admin.student.submit_button"
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-primary text-primary-foreground hover:bg-gold-light font-heading font-semibold"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              "Update Student"
            ) : (
              "Add Student"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteConfirmDialog({
  open,
  onOpenChange,
  studentName,
  onConfirm,
  isPending,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  studentName: string;
  onConfirm: () => void;
  isPending: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-[oklch(0.13_0_0)] border-[oklch(0.3_0.02_91.7)] max-w-sm"
        data-ocid="admin.student.delete.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground font-display text-lg">
            Delete Student
          </DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground font-body text-sm py-2">
          Are you sure you want to remove{" "}
          <span className="text-foreground font-semibold">{studentName}</span>?
          This action cannot be undone.
        </p>
        <DialogFooter className="gap-3">
          <Button
            data-ocid="admin.student.delete.cancel_button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[oklch(0.3_0.02_91.7)] text-muted-foreground font-body"
          >
            Cancel
          </Button>
          <Button
            data-ocid="admin.student.delete.confirm_button"
            onClick={onConfirm}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white font-heading font-semibold"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminStudentsPage() {
  const { data: isAdmin } = useIsAdmin();
  const [selectedClass, setSelectedClass] = useState<ClassLevel>(
    ClassLevel.Nursery,
  );
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<StudentRecord | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<StudentRecord | undefined>();

  const { data: students = [], isLoading: studentsLoading } =
    useStudentsByClass(selectedClass);
  const { data: studentCount = 0n } = useStudentCountByClass(selectedClass);
  const deleteStudent = useDeleteStudentRecord();

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteStudent.mutateAsync({
        id: deleteTarget.id,
        classLevel: selectedClass,
      });
      toast.success("Student removed.");
      setDeleteTarget(undefined);
    } catch {
      toast.error("Failed to delete student.");
    }
  };

  if (!isAdmin) {
    return (
      <main className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4">
        <div
          className="dark-card rounded-2xl border border-[oklch(0.862_0.196_91.7/0.3)] p-10 text-center max-w-sm"
          data-ocid="admin.students.error_state"
        >
          <Shield className="h-10 w-10 text-primary/40 mx-auto mb-3" />
          <p className="text-foreground font-display font-bold text-lg">
            Admin Access Required
          </p>
          <p className="text-muted-foreground font-body text-sm mt-2">
            You need admin privileges to manage students.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Nav */}
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-body text-sm"
          data-ocid="admin.students.back.link"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Admin Panel
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[oklch(0.862_0.196_91.7/0.15)] border border-[oklch(0.862_0.196_91.7/0.4)] flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-primary/70 font-body text-xs tracking-widest uppercase">
                Admin
              </p>
              <h1 className="text-3xl font-display font-bold text-gold-gradient">
                Manage Students
              </h1>
            </div>
          </div>

          <Button
            data-ocid="admin.students.add.open_modal_button"
            onClick={() => {
              setEditTarget(undefined);
              setAddOpen(true);
            }}
            className="bg-primary text-primary-foreground hover:bg-gold-light font-heading font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Student
          </Button>
        </motion.div>

        {/* Class Selector + Count Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <Label className="text-muted-foreground font-body text-sm whitespace-nowrap">
              Select Class:
            </Label>
            <Select
              value={selectedClass}
              onValueChange={(v) => setSelectedClass(v as ClassLevel)}
            >
              <SelectTrigger
                data-ocid="admin.students.class.select"
                className="bg-[oklch(0.13_0_0)] border-[oklch(0.3_0.02_91.7)] text-foreground font-heading font-semibold h-10 w-44"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[oklch(0.15_0_0)] border-[oklch(0.3_0.02_91.7)]">
                {CLASS_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="text-foreground font-body"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Student count chip */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[oklch(0.862_0.196_91.7/0.08)] border border-[oklch(0.862_0.196_91.7/0.25)]">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span className="font-display font-bold text-gold-gradient text-lg">
              {Number(studentCount)}
            </span>
            <span className="text-muted-foreground font-body text-sm">
              Total Students in {getClassLabel(selectedClass)}
            </span>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {studentsLoading ? (
            <div
              data-ocid="admin.students.list.loading_state"
              className="space-y-3"
            >
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  className="h-14 rounded-xl bg-[oklch(0.15_0_0)]"
                />
              ))}
            </div>
          ) : students.length === 0 ? (
            <div
              data-ocid="admin.students.empty_state"
              className="dark-card rounded-xl border border-[oklch(0.25_0.02_91.7)] p-14 text-center"
            >
              <Users className="h-12 w-12 text-primary/25 mx-auto mb-4" />
              <p className="text-foreground font-display font-semibold text-lg">
                No students added yet.
              </p>
              <p className="text-muted-foreground font-body text-sm mt-2">
                Click{" "}
                <span className="text-primary font-semibold">Add Student</span>{" "}
                to begin.
              </p>
            </div>
          ) : (
            <div className="dark-card rounded-xl border border-[oklch(0.25_0.02_91.7)] overflow-hidden">
              <div className="overflow-x-auto">
                <Table data-ocid="admin.students.table">
                  <TableHeader>
                    <TableRow className="border-[oklch(0.25_0.02_91.7)] hover:bg-transparent">
                      <TableHead className="text-primary/70 font-heading text-xs uppercase tracking-wider">
                        Roll No
                      </TableHead>
                      <TableHead className="text-primary/70 font-heading text-xs uppercase tracking-wider">
                        Student Name
                      </TableHead>
                      <TableHead className="text-primary/70 font-heading text-xs uppercase tracking-wider">
                        Father Name
                      </TableHead>
                      <TableHead className="text-primary/70 font-heading text-xs uppercase tracking-wider">
                        Mobile
                      </TableHead>
                      <TableHead className="text-primary/70 font-heading text-xs uppercase tracking-wider">
                        Total Fee
                      </TableHead>
                      <TableHead className="text-primary/70 font-heading text-xs uppercase tracking-wider">
                        Paid
                      </TableHead>
                      <TableHead className="text-primary/70 font-heading text-xs uppercase tracking-wider">
                        Due Date
                      </TableHead>
                      <TableHead className="text-primary/70 font-heading text-xs uppercase tracking-wider">
                        Status
                      </TableHead>
                      <TableHead className="text-primary/70 font-heading text-xs uppercase tracking-wider text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student, idx) => (
                      <TableRow
                        key={student.id}
                        data-ocid={`admin.students.item.${idx + 1}`}
                        className="border-[oklch(0.2_0.01_91.7)] hover:bg-[oklch(0.862_0.196_91.7/0.04)] transition-colors"
                      >
                        <TableCell className="text-muted-foreground font-body text-sm font-medium">
                          {student.rollNo || "—"}
                        </TableCell>
                        <TableCell className="text-foreground font-body text-sm font-semibold">
                          {student.studentName}
                        </TableCell>
                        <TableCell className="text-muted-foreground font-body text-sm">
                          {student.fatherName}
                        </TableCell>
                        <TableCell className="text-muted-foreground font-body text-sm">
                          {student.mobile}
                        </TableCell>
                        <TableCell className="text-foreground font-body text-sm">
                          ₹{Number(student.feeDetail.totalFee).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-foreground font-body text-sm">
                          ₹{Number(student.feeDetail.paidFee).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-muted-foreground font-body text-sm">
                          {student.feeDetail.dueDate || "—"}
                        </TableCell>
                        <TableCell>
                          <FeeStatusBadge status={student.feeDetail.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              data-ocid={`admin.students.edit_button.${idx + 1}`}
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditTarget(student);
                                setAddOpen(true);
                              }}
                              className="h-8 w-8 p-0 border-[oklch(0.3_0.02_91.7)] text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              data-ocid={`admin.students.delete_button.${idx + 1}`}
                              size="sm"
                              variant="outline"
                              onClick={() => setDeleteTarget(student)}
                              className="h-8 w-8 p-0 border-[oklch(0.3_0.02_91.7)] text-muted-foreground hover:text-red-400 hover:border-red-600 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Fee Summary Footer */}
              <div className="border-t border-[oklch(0.25_0.02_91.7)] px-6 py-3 flex flex-wrap items-center justify-between gap-3 bg-[oklch(0.862_0.196_91.7/0.03)]">
                <p className="text-muted-foreground font-body text-xs">
                  {students.length} students · {getClassLabel(selectedClass)}
                </p>
                <div className="flex gap-4 text-xs font-body">
                  <span className="text-green-400">
                    Paid:{" "}
                    {
                      students.filter((s) => s.feeDetail.status === "Paid")
                        .length
                    }
                  </span>
                  <span className="text-amber-400">
                    Partial:{" "}
                    {
                      students.filter((s) => s.feeDetail.status === "Partial")
                        .length
                    }
                  </span>
                  <span className="text-red-400">
                    Pending:{" "}
                    {
                      students.filter((s) => s.feeDetail.status === "Pending")
                        .length
                    }
                  </span>
                  <span className="text-primary font-semibold">
                    Total Collected: ₹
                    {students
                      .reduce((sum, s) => sum + Number(s.feeDetail.paidFee), 0)
                      .toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Add/Edit Dialog */}
      {addOpen && (
        <StudentFormDialog
          open={addOpen}
          onOpenChange={(v) => {
            if (!v) {
              setAddOpen(false);
              setEditTarget(undefined);
            } else {
              setAddOpen(v);
            }
          }}
          classLevel={selectedClass}
          editTarget={editTarget}
          onClose={() => {
            setAddOpen(false);
            setEditTarget(undefined);
          }}
        />
      )}

      {/* Delete Confirm Dialog */}
      {deleteTarget && (
        <DeleteConfirmDialog
          open={!!deleteTarget}
          onOpenChange={(v) => {
            if (!v) setDeleteTarget(undefined);
          }}
          studentName={deleteTarget.studentName}
          onConfirm={handleDelete}
          isPending={deleteStudent.isPending}
        />
      )}
    </main>
  );
}
