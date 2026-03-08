import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAllAdmissionInquiries,
  useMarkInquiryAsRead,
} from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Mail, MessageSquare, Phone } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

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

export default function AdminInquiriesPage() {
  const { data: inquiries = [], isLoading } = useAllAdmissionInquiries();
  const markRead = useMarkInquiryAsRead();

  const handleMarkRead = async (id: string) => {
    try {
      await markRead.mutateAsync(id);
      toast.success("Marked as read.");
    } catch {
      toast.error("Failed to update.");
    }
  };

  const unreadCount = inquiries.filter((i) => !i.isRead).length;

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-body text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Admin
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-gold-gradient section-heading">
              Admission Inquiries
            </h1>
            <p className="text-muted-foreground font-body text-sm mt-2">
              {unreadCount > 0 ? (
                <span className="text-primary font-semibold">
                  {unreadCount} unread
                </span>
              ) : (
                "All caught up!"
              )}{" "}
              · {inquiries.length} total
            </p>
          </div>
        </motion.div>

        {isLoading && (
          <div data-ocid="inquiries.loading_state" className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                className="h-28 rounded-xl bg-[oklch(0.15_0_0)]"
              />
            ))}
          </div>
        )}

        {!isLoading && inquiries.length === 0 && (
          <div
            data-ocid="inquiries.empty_state"
            className="text-center py-20 dark-card rounded-xl border border-[oklch(0.25_0.02_91.7)]"
          >
            <MessageSquare className="h-12 w-12 text-primary/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-body text-lg">
              No inquiries yet
            </p>
            <p className="text-muted-foreground/60 font-body text-sm mt-2">
              Admission inquiries will appear here.
            </p>
          </div>
        )}

        {!isLoading && inquiries.length > 0 && (
          <div className="space-y-4">
            {inquiries.map((inquiry, i) => (
              <motion.div
                key={inquiry.id}
                data-ocid={`inquiries.item.${i + 1}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`dark-card rounded-xl p-5 border transition-all ${
                  !inquiry.isRead
                    ? "border-[oklch(0.862_0.196_91.7/0.4)] bg-[oklch(0.14_0.005_91.7)]"
                    : "border-[oklch(0.2_0_0)]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-foreground font-heading font-bold">
                        {inquiry.name}
                      </h3>
                      <Badge className="bg-[oklch(0.862_0.196_91.7/0.15)] text-primary border border-[oklch(0.862_0.196_91.7/0.3)] text-xs">
                        {CLASS_LABELS[inquiry.classLevel] ?? inquiry.classLevel}
                      </Badge>
                      {!inquiry.isRead && (
                        <Badge className="bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
                      {inquiry.mobile && (
                        <a
                          href={`tel:${inquiry.mobile}`}
                          className="flex items-center gap-1.5 text-muted-foreground hover:text-primary text-sm font-body transition-colors"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          {inquiry.mobile}
                        </a>
                      )}
                      {inquiry.email && (
                        <a
                          href={`mailto:${inquiry.email}`}
                          className="flex items-center gap-1.5 text-muted-foreground hover:text-primary text-sm font-body transition-colors"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          {inquiry.email}
                        </a>
                      )}
                    </div>
                    {inquiry.message && (
                      <p className="text-muted-foreground text-sm font-body mt-2 line-clamp-2">
                        {inquiry.message}
                      </p>
                    )}
                  </div>
                  {!inquiry.isRead && (
                    <Button
                      size="sm"
                      onClick={() => handleMarkRead(inquiry.id)}
                      disabled={markRead.isPending}
                      variant="outline"
                      className="flex-shrink-0 border-[oklch(0.862_0.196_91.7/0.3)] text-primary hover:bg-[oklch(0.862_0.196_91.7/0.1)] text-xs"
                    >
                      <Check className="h-3 w-3 mr-1" /> Mark Read
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
