import type { ClassContent, ClassLevel } from "@/backend.d";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentType } from "@/hooks/useQueries";
import {
  ClipboardList,
  FileText,
  MessageSquare,
  PenTool,
  Video,
} from "lucide-react";
import ContentList from "./ContentList";

interface ContentTabsProps {
  classLevel: ClassLevel;
  contents: ClassContent[];
  isAdmin: boolean;
  onDelete: (id: string) => void;
}

const TABS = [
  {
    type: ContentType.pdf,
    label: "PDFs",
    icon: FileText,
    ocid: "class.pdf.tab",
  },
  {
    type: ContentType.worksheet,
    label: "Worksheets",
    icon: PenTool,
    ocid: "class.worksheet.tab",
  },
  {
    type: ContentType.message,
    label: "Messages",
    icon: MessageSquare,
    ocid: "class.message.tab",
  },
  {
    type: ContentType.video,
    label: "Videos",
    icon: Video,
    ocid: "class.video.tab",
  },
  {
    type: ContentType.test,
    label: "Tests",
    icon: ClipboardList,
    ocid: "class.test.tab",
  },
];

export default function ContentTabs({
  classLevel: _classLevel,
  contents,
  isAdmin,
  onDelete,
}: ContentTabsProps) {
  return (
    <Tabs defaultValue={ContentType.pdf}>
      <TabsList className="bg-[oklch(0.1_0_0)] border border-[oklch(0.25_0.02_91.7)] p-1 gap-1 w-full flex overflow-x-auto">
        {TABS.map((tab) => (
          <TabsTrigger
            key={tab.type}
            value={tab.type}
            data-ocid={tab.ocid}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold flex-1 min-w-0"
          >
            <tab.icon className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {TABS.map((tab) => {
        const filtered = contents.filter((c) => c.contentType === tab.type);
        return (
          <TabsContent key={tab.type} value={tab.type} className="mt-4">
            <ContentList
              items={filtered}
              contentType={tab.type}
              isAdmin={isAdmin}
              onDelete={onDelete}
            />
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
