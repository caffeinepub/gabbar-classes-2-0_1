import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type AdmissionInquiry,
  type Batch,
  type ClassContent,
  ClassLevel,
  ContentType,
  type Faculty,
  type FeeDetail,
  type GalleryItem,
  type Stats,
  type StudentRecord,
  type UserProfile,
  UserRole,
} from "../backend.d";
import { useActor } from "./useActor";

export type { StudentRecord, FeeDetail };

export { ClassLevel, ContentType, UserRole };

// ── Auth / Role ───────────────────────────────────────────────────────
export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    retry: 2,
  });
}

export function useUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery<UserRole>({
    queryKey: ["userRole"],
    queryFn: async () => {
      if (!actor) return UserRole.guest;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCallerProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["callerProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Stats ─────────────────────────────────────────────────────────────
export function useStats() {
  const { actor, isFetching } = useActor();
  return useQuery<Stats>({
    queryKey: ["stats"],
    queryFn: async () => {
      if (!actor)
        return {
          facultyCount: 0n,
          contentCount: 0n,
          galleryCount: 0n,
          inquiryCount: 0n,
          batchCount: 0n,
          studentCount: 0n,
        };
      return actor.getStats();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Faculty ───────────────────────────────────────────────────────────
export function useAllFaculty() {
  const { actor, isFetching } = useActor();
  return useQuery<Faculty[]>({
    queryKey: ["faculty"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllFaculty();
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}

export function useAddFaculty() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (faculty: Faculty) => {
      if (!actor) throw new Error("Not connected");
      return actor.addFaculty(faculty);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["faculty"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useUpdateFaculty() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Faculty }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateFaculty(id, data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["faculty"] }),
  });
}

export function useDeleteFaculty() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteFaculty(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["faculty"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

// ── Gallery ───────────────────────────────────────────────────────────
export function useAllGalleryItems() {
  const { actor, isFetching } = useActor();
  return useQuery<GalleryItem[]>({
    queryKey: ["gallery"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllGalleryItems();
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}

export function useAddGalleryItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: GalleryItem) => {
      if (!actor) throw new Error("Not connected");
      return actor.addGalleryItem(item);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gallery"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useDeleteGalleryItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteGalleryItem(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gallery"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

// ── Class Content ─────────────────────────────────────────────────────
export function useClassContent(classLevel: ClassLevel) {
  const { actor, isFetching } = useActor();
  return useQuery<ClassContent[]>({
    queryKey: ["classContent", classLevel],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getByClass(classLevel);
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}

export function useClassContentByType(
  classLevel: ClassLevel,
  contentType: ContentType,
) {
  const { actor, isFetching } = useActor();
  return useQuery<ClassContent[]>({
    queryKey: ["classContent", classLevel, contentType],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getByClassAndType(classLevel, contentType);
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}

export function useAddClassContent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (content: ClassContent) => {
      if (!actor) throw new Error("Not connected");
      return actor.addClassContent(content);
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({
        queryKey: ["classContent", variables.classLevel],
      });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useDeleteClassContent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      classLevel: _classLevel,
    }: { id: string; classLevel: ClassLevel }) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteClassContent(id);
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({
        queryKey: ["classContent", variables.classLevel],
      });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

// ── Batches ───────────────────────────────────────────────────────────
export function useAllBatches() {
  const { actor, isFetching } = useActor();
  return useQuery<Batch[]>({
    queryKey: ["batches"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBatches();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}

export function useActiveBatches() {
  const { actor, isFetching } = useActor();
  return useQuery<Batch[]>({
    queryKey: ["activeBatches"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveBatches();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddBatch() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (batch: Batch) => {
      if (!actor) throw new Error("Not connected");
      return actor.addBatch(batch);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["batches"] });
      qc.invalidateQueries({ queryKey: ["activeBatches"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useUpdateBatch() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Batch }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateBatch(id, data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["batches"] });
      qc.invalidateQueries({ queryKey: ["activeBatches"] });
    },
  });
}

export function useDeleteBatch() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteBatch(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["batches"] });
      qc.invalidateQueries({ queryKey: ["activeBatches"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

// ── Admission Inquiries ───────────────────────────────────────────────
export function useSubmitAdmissionInquiry() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (inquiry: AdmissionInquiry) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitAdmissionInquiry(inquiry);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inquiries"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useAllAdmissionInquiries() {
  const { actor, isFetching } = useActor();
  return useQuery<AdmissionInquiry[]>({
    queryKey: ["inquiries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAdmissionInquiries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMarkInquiryAsRead() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.markInquiryAsRead(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inquiries"] }),
  });
}

export function useSaveCallerProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["callerProfile"] }),
  });
}

// ── Student Records ───────────────────────────────────────────────────
export function useStudentsByClass(classLevel: ClassLevel) {
  const { actor, isFetching } = useActor();
  return useQuery<StudentRecord[]>({
    queryKey: ["students", classLevel],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getStudentsByClass(classLevel);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useStudentCountByClass(classLevel: ClassLevel) {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["studentCount", classLevel],
    queryFn: async () => {
      if (!actor) return 0n;
      try {
        return await actor.getStudentCountByClass(classLevel);
      } catch {
        return 0n;
      }
    },
    enabled: !isFetching,
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useAddStudentRecord() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (record: StudentRecord) => {
      if (!actor) throw new Error("Not connected");
      return actor.addStudentRecord(record);
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["students", variables.classLevel] });
      qc.invalidateQueries({
        queryKey: ["studentCount", variables.classLevel],
      });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useUpdateStudentRecord() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: StudentRecord }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateStudentRecord(id, data);
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({
        queryKey: ["students", variables.data.classLevel],
      });
      qc.invalidateQueries({
        queryKey: ["studentCount", variables.data.classLevel],
      });
    },
  });
}

export function useDeleteStudentRecord() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      classLevel: _classLevel,
    }: { id: string; classLevel: ClassLevel }) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteStudentRecord(id);
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["students", variables.classLevel] });
      qc.invalidateQueries({
        queryKey: ["studentCount", variables.classLevel],
      });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}
