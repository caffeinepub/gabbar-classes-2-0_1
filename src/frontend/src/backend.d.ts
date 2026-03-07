import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Batch {
    id: string;
    fee: bigint;
    timing: string;
    isActive: boolean;
    totalSeats: bigint;
    availableSeats: bigint;
    schedule: string;
    className: string;
    batchName: string;
    startDate: bigint;
}
export interface ClassContent {
    id: string;
    url: string;
    title: string;
    contentType: ContentType;
    body: string;
    createdAt: bigint;
    description: string;
    classLevel: ClassLevel;
}
export interface AdmissionInquiry {
    id: string;
    name: string;
    createdAt: bigint;
    isRead: boolean;
    email: string;
    message: string;
    classLevel: ClassLevel;
    mobile: string;
}
export interface Stats {
    facultyCount: bigint;
    contentCount: bigint;
    galleryCount: bigint;
    inquiryCount: bigint;
    batchCount: bigint;
}
export interface Faculty {
    id: string;
    bio: string;
    subject: string;
    displayOrder: bigint;
    name: string;
    photoUrl: string;
    qualification: string;
}
export interface GalleryItem {
    id: string;
    title: string;
    imageUrl: string;
    caption: string;
    uploadedAt: bigint;
}
export interface UserProfile {
    enrolledClasses: Array<string>;
    name: string;
    role: string;
}
export enum ClassLevel {
    Class1 = "Class1",
    Class2 = "Class2",
    Class3 = "Class3",
    Class4 = "Class4",
    Class5 = "Class5",
    Class6 = "Class6",
    Class7 = "Class7",
    Class8 = "Class8",
    Nursery = "Nursery"
}
export enum ContentType {
    pdf = "pdf",
    video = "video",
    test = "test",
    message = "message",
    worksheet = "worksheet"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBatch(batch: Batch): Promise<void>;
    addClassContent(content: ClassContent): Promise<void>;
    addFaculty(facultyMember: Faculty): Promise<void>;
    addGalleryItem(item: GalleryItem): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteBatch(id: string): Promise<void>;
    deleteClassContent(id: string): Promise<void>;
    deleteFaculty(id: string): Promise<void>;
    deleteGalleryItem(id: string): Promise<void>;
    getActiveBatches(): Promise<Array<Batch>>;
    getAllAdmissionInquiries(): Promise<Array<AdmissionInquiry>>;
    getAllBatches(): Promise<Array<Batch>>;
    getAllFaculty(): Promise<Array<Faculty>>;
    getAllGalleryItems(): Promise<Array<GalleryItem>>;
    getByClass(classLevel: ClassLevel): Promise<Array<ClassContent>>;
    getByClassAndType(classLevel: ClassLevel, contentType: ContentType): Promise<Array<ClassContent>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getStats(): Promise<Stats>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markInquiryAsRead(id: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitAdmissionInquiry(inquiry: AdmissionInquiry): Promise<void>;
    updateBatch(id: string, updatedData: Batch): Promise<void>;
    updateClassContent(id: string, updatedData: ClassContent): Promise<void>;
    updateFaculty(id: string, updatedData: Faculty): Promise<void>;
}
