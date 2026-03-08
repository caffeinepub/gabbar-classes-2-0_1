import type { ClassContent, StudentRecord } from "@/backend.d";
import ContentForm from "@/components/Classes/ContentForm";
import ContentTabs from "@/components/Classes/ContentTabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  useAddClassContent,
  useClassContent,
  useDeleteClassContent,
  useIsAdmin,
  useStudentCountByClass,
  useStudentsByClass,
} from "@/hooks/useQueries";
import { useParams } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, GraduationCap, Plus, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const CLASS_LEVEL_MAP: Record<string, ClassLevel> = {
  Nursery: ClassLevel.Nursery,
  Class1: ClassLevel.Class1,
  Class2: ClassLevel.Class2,
  Class3: ClassLevel.Class3,
  Class4: ClassLevel.Class4,
  Class5: ClassLevel.Class5,
  Class6: ClassLevel.Class6,
  Class7: ClassLevel.Class7,
  Class8: ClassLevel.Class8,
};

const CLASS_LABELS: Record<string, string> = {
  Nursery: "Nursery",
  Class1: "Class 1",
  Class2: "Class 2",
  Class3: "Class 3",
  Class4: "Class 4",
  Class5: "Class 5",
  Class6: "Class 6",
  Class7: "Class 7",
  Class8: "Class 8",
};

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

function StudentRow({
  student,
  index,
}: { student: StudentRecord; index: number }) {
  return (
    <TableRow
      data-ocid={`students.item.${index + 1}`}
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
    </TableRow>
  );
}

function StudentsSection({
  classLevel,
  displayLabel,
  isAdmin,
}: {
  classLevel: ClassLevel;
  displayLabel: string;
  isAdmin: boolean;
}) {
  const { data: studentCount = 0n, isLoading: countLoading } =
    useStudentCountByClass(classLevel);
  const { data: students = [], isLoading: studentsLoading } =
    useStudentsByClass(classLevel);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="mt-10"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[oklch(0.862_0.196_91.7/0.1)] border border-[oklch(0.862_0.196_91.7/0.3)] flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-gold-gradient section-heading">
              Students
            </h2>
            <p className="text-muted-foreground font-body text-xs mt-0.5">
              {displayLabel} · Enrollment Details
            </p>
          </div>
        </div>

        {/* Student Count Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[oklch(0.862_0.196_91.7/0.08)] border border-[oklch(0.862_0.196_91.7/0.25)]">
          <GraduationCap className="h-4 w-4 text-primary" />
          {countLoading ? (
            <Skeleton className="h-5 w-16 bg-[oklch(0.18_0_0)]" />
          ) : (
            <span className="font-display font-bold text-gold-gradient text-lg">
              {Number(studentCount)}
            </span>
          )}
          <span className="text-muted-foreground font-body text-sm">
            Total Students
          </span>
        </div>
      </div>

      {/* Admin: Full student table */}
      {isAdmin ? (
        <>
          {studentsLoading ? (
            <div data-ocid="students.loading_state" className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className="h-14 rounded-xl bg-[oklch(0.15_0_0)]"
                />
              ))}
            </div>
          ) : students.length === 0 ? (
            <div
              data-ocid="students.empty_state"
              className="dark-card rounded-xl border border-[oklch(0.25_0.02_91.7)] p-10 text-center"
            >
              <Users className="h-10 w-10 text-primary/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-body text-sm">
                No students added yet.
              </p>
              <p className="text-muted-foreground/60 font-body text-xs mt-1">
                Go to Admin → Manage Students to add students.
              </p>
            </div>
          ) : (
            <div className="dark-card rounded-xl border border-[oklch(0.25_0.02_91.7)] overflow-hidden">
              <div className="overflow-x-auto">
                <Table data-ocid="students.table">
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student, idx) => (
                      <StudentRow
                        key={student.id}
                        student={student}
                        index={idx}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Summary footer */}
              <div className="border-t border-[oklch(0.25_0.02_91.7)] px-6 py-3 flex items-center justify-between bg-[oklch(0.862_0.196_91.7/0.03)]">
                <p className="text-muted-foreground font-body text-xs">
                  Showing {students.length} of {Number(studentCount)} students
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
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Non-admin: only show count summary */
        <div className="dark-card rounded-xl border border-[oklch(0.25_0.02_91.7)] p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[oklch(0.862_0.196_91.7/0.1)] border border-[oklch(0.862_0.196_91.7/0.25)] flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground font-body text-sm">
                Total Enrolled Students in {displayLabel}
              </p>
              <p className="text-3xl font-display font-bold text-gold-gradient">
                {countLoading ? "..." : Number(studentCount)}
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function ClassPage() {
  const { classLevel: rawLevel } = useParams({ from: "/classes/$classLevel" });
  const classLevel = CLASS_LEVEL_MAP[rawLevel] ?? ClassLevel.Nursery;
  const displayLabel = CLASS_LABELS[rawLevel] ?? rawLevel;

  const { data: contents = [], isLoading } = useClassContent(classLevel);
  const { data: isAdmin } = useIsAdmin();
  const addContent = useAddClassContent();
  const deleteContent = useDeleteClassContent();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAdd = async (content: ClassContent) => {
    try {
      await addContent.mutateAsync(content);
      toast.success("Content added successfully!");
      setDialogOpen(false);
    } catch {
      toast.error("Failed to add content.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContent.mutateAsync({ id, classLevel });
      toast.success("Content removed.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back nav */}
        <Link
          to="/library"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-body text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Library
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
        >
          <div>
            <p className="text-primary/70 font-body text-sm tracking-widest uppercase mb-2">
              CBSE · Study Materials
            </p>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-gold-gradient section-heading">
              {displayLabel}
            </h1>
          </div>

          {isAdmin && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  data-ocid="class.content.add.open_modal_button"
                  className="bg-primary text-primary-foreground hover:bg-gold-light font-heading font-semibold"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Content
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[oklch(0.13_0_0)] border-[oklch(0.3_0.02_91.7)] max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-gold-gradient font-display text-xl">
                    Add Content for {displayLabel}
                  </DialogTitle>
                </DialogHeader>
                <ContentForm
                  classLevel={classLevel}
                  onSubmit={handleAdd}
                  onCancel={() => setDialogOpen(false)}
                  isLoading={addContent.isPending}
                />
              </DialogContent>
            </Dialog>
          )}
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div data-ocid="class.content.loading_state" className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                className="h-20 rounded-xl bg-[oklch(0.15_0_0)]"
              />
            ))}
          </div>
        )}

        {/* Content Tabs */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ContentTabs
              classLevel={classLevel}
              contents={contents}
              isAdmin={!!isAdmin}
              onDelete={handleDelete}
            />
          </motion.div>
        )}

        {/* Students Section */}
        <StudentsSection
          classLevel={classLevel}
          displayLabel={displayLabel}
          isAdmin={!!isAdmin}
        />
      </div>
    </main>
  );
}
