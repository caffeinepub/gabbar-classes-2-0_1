import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type ClassLevel = {
    #Nursery;
    #Class1;
    #Class2;
    #Class3;
    #Class4;
    #Class5;
    #Class6;
    #Class7;
    #Class8;
  };

  type ContentType = {
    #pdf;
    #worksheet;
    #video;
    #test;
    #message;
  };

  type Faculty = {
    id : Text;
    name : Text;
    subject : Text;
    qualification : Text;
    bio : Text;
    photoUrl : Text;
    displayOrder : Nat;
  };

  type GalleryItem = {
    id : Text;
    title : Text;
    imageUrl : Text;
    caption : Text;
    uploadedAt : Int;
  };

  type ClassContent = {
    id : Text;
    classLevel : ClassLevel;
    contentType : ContentType;
    title : Text;
    description : Text;
    url : Text;
    body : Text;
    createdAt : Int;
  };

  type Batch = {
    id : Text;
    className : Text;
    batchName : Text;
    schedule : Text;
    timing : Text;
    fee : Nat;
    totalSeats : Nat;
    availableSeats : Nat;
    startDate : Int;
    isActive : Bool;
  };

  type AdmissionInquiry = {
    id : Text;
    name : Text;
    mobile : Text;
    email : Text;
    classLevel : ClassLevel;
    message : Text;
    createdAt : Int;
    isRead : Bool;
  };

  type FeeDetail = {
    totalFee : Nat;
    paidFee : Nat;
    dueDate : Text;
    status : Text;
  };

  type StudentRecord = {
    id : Text;
    studentName : Text;
    fatherName : Text;
    mobile : Text;
    classLevel : ClassLevel;
    rollNo : Text;
    feeDetail : FeeDetail;
    createdAt : Int;
  };

  type UserProfile = {
    name : Text;
    role : Text;
    enrolledClasses : [Text];
  };

  type OldActor = {
    faculty : Map.Map<Text, Faculty>;
    gallery : Map.Map<Text, GalleryItem>;
    classContent : Map.Map<Text, ClassContent>;
    batches : Map.Map<Text, Batch>;
    admissionInquiries : Map.Map<Text, AdmissionInquiry>;
    studentRecords : Map.Map<Text, StudentRecord>;
    userProfiles : Map.Map<Principal, UserProfile>;
    nextId : Nat;
    adminAssigned : Bool;
  };

  type NewActor = {
    faculty : Map.Map<Text, Faculty>;
    gallery : Map.Map<Text, GalleryItem>;
    classContent : Map.Map<Text, ClassContent>;
    batches : Map.Map<Text, Batch>;
    admissionInquiries : Map.Map<Text, AdmissionInquiry>;
    studentRecords : Map.Map<Text, StudentRecord>;
    userProfiles : Map.Map<Principal, UserProfile>;
    nextId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    {
      faculty = old.faculty;
      gallery = old.gallery;
      classContent = old.classContent;
      batches = old.batches;
      admissionInquiries = old.admissionInquiries;
      studentRecords = old.studentRecords;
      userProfiles = old.userProfiles;
      nextId = old.nextId;
    };
  };
};
