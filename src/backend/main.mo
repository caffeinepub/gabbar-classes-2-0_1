import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Bool "mo:core/Bool";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  
  include MixinStorage();

  // User Profile Type
  public type UserProfile = {
    name : Text;
    role : Text; // "admin" or "student"
    enrolledClasses : [Text]; // For students: list of class levels they're enrolled in
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Enum types
  module ClassLevel {
    public type ClassLevel = {
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

    public func fromText(text : Text) : ?ClassLevel {
      switch (text) {
        case ("Nursery") { ?#Nursery };
        case ("Class1") { ?#Class1 };
        case ("Class2") { ?#Class2 };
        case ("Class3") { ?#Class3 };
        case ("Class4") { ?#Class4 };
        case ("Class5") { ?#Class5 };
        case ("Class6") { ?#Class6 };
        case ("Class7") { ?#Class7 };
        case ("Class8") { ?#Class8 };
        case (_) { null };
      };
    };

    public func toText(classLevel : ClassLevel) : Text {
      switch (classLevel) {
        case (#Nursery) { "Nursery" };
        case (#Class1) { "Class1" };
        case (#Class2) { "Class2" };
        case (#Class3) { "Class3" };
        case (#Class4) { "Class4" };
        case (#Class5) { "Class5" };
        case (#Class6) { "Class6" };
        case (#Class7) { "Class7" };
        case (#Class8) { "Class8" };
      };
    };
  };

  module ContentType {
    public type ContentType = {
      #pdf;
      #worksheet;
      #video;
      #test;
      #message;
    };

    public func fromText(text : Text) : ?ContentType {
      switch (text) {
        case ("pdf") { ?#pdf };
        case ("worksheet") { ?#worksheet };
        case ("video") { ?#video };
        case ("test") { ?#test };
        case ("message") { ?#message };
        case (_) { null };
      };
    };
  };

  // Types
  public type Faculty = {
    id : Text;
    name : Text;
    subject : Text;
    qualification : Text;
    bio : Text;
    photoUrl : Text;
    displayOrder : Nat;
  };

  public type GalleryItem = {
    id : Text;
    title : Text;
    imageUrl : Text;
    caption : Text;
    uploadedAt : Int;
  };

  public type ClassContent = {
    id : Text;
    classLevel : ClassLevel.ClassLevel;
    contentType : ContentType.ContentType;
    title : Text;
    description : Text;
    url : Text;
    body : Text;
    createdAt : Int;
  };

  public type Batch = {
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

  public type AdmissionInquiry = {
    id : Text;
    name : Text;
    mobile : Text;
    email : Text;
    classLevel : ClassLevel.ClassLevel;
    message : Text;
    createdAt : Int;
    isRead : Bool;
  };

  public type FeeDetail = {
    totalFee : Nat;
    paidFee : Nat;
    dueDate : Text;
    status : Text; // "Paid"/"Partial"/"Pending"
  };

  public type StudentRecord = {
    id : Text;
    studentName : Text;
    fatherName : Text;
    mobile : Text;
    classLevel : ClassLevel.ClassLevel;
    rollNo : Text;
    feeDetail : FeeDetail;
    createdAt : Int;
  };

  public type Stats = {
    facultyCount : Nat;
    galleryCount : Nat;
    contentCount : Nat;
    batchCount : Nat;
    inquiryCount : Nat;
    studentCount : Nat;
  };

  // Comparison modules for sorting
  module GalleryItem {
    public func compare(a : GalleryItem, b : GalleryItem) : Order.Order {
      Int.compare(b.uploadedAt, a.uploadedAt);
    };
  };

  // Storage
  var nextId = 0;

  func generateId() : Text {
    let id = nextId;
    nextId += 1;
    id.toText();
  };

  let faculty = Map.empty<Text, Faculty>();
  let gallery = Map.empty<Text, GalleryItem>();
  let classContent = Map.empty<Text, ClassContent>();
  let batches = Map.empty<Text, Batch>();
  let admissionInquiries = Map.empty<Text, AdmissionInquiry>();
  let studentRecords = Map.empty<Text, StudentRecord>();

  // Helper function to check if student is enrolled in a class
  func isEnrolledInClass(caller : Principal, classLevel : ClassLevel.ClassLevel) : Bool {
    switch (userProfiles.get(caller)) {
      case (?profile) {
        let classText = ClassLevel.toText(classLevel);
        profile.enrolledClasses.find<Text>(func(c) { c == classText }) != null;
      };
      case (null) { false };
    };
  };

  // Faculty - Admin only for add/update/delete
  public shared ({ caller }) func addFaculty(facultyMember : Faculty) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add faculty");
    };
    let id = generateId();
    let newMember = {
      id;
      name = facultyMember.name;
      subject = facultyMember.subject;
      qualification = facultyMember.qualification;
      bio = facultyMember.bio;
      photoUrl = facultyMember.photoUrl;
      displayOrder = facultyMember.displayOrder;
    };
    faculty.add(id, newMember);
  };

  public shared ({ caller }) func updateFaculty(id : Text, updatedData : Faculty) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update faculty");
    };
    switch (faculty.get(id)) {
      case (?_) {
        let updatedMember = { updatedData with id };
        faculty.add(id, updatedMember);
      };
      case (null) {
        Runtime.trap("Faculty member not found");
      };
    };
  };

  public shared ({ caller }) func deleteFaculty(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete faculty");
    };
    if (not faculty.containsKey(id)) {
      Runtime.trap("Faculty member not found");
    };
    faculty.remove(id);
  };

  // Public - anyone can view faculty
  public query ({ caller }) func getAllFaculty() : async [Faculty] {
    faculty.values().toArray();
  };

  // Gallery - Admin only for add/delete
  public shared ({ caller }) func addGalleryItem(item : GalleryItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add gallery items");
    };
    let id = generateId();
    let newItem = {
      id;
      title = item.title;
      imageUrl = item.imageUrl;
      caption = item.caption;
      uploadedAt = Time.now();
    };
    gallery.add(id, newItem);
  };

  public shared ({ caller }) func deleteGalleryItem(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete gallery items");
    };
    if (not gallery.containsKey(id)) {
      Runtime.trap("Gallery item not found");
    };
    gallery.remove(id);
  };

  // Public - anyone can view gallery
  public query ({ caller }) func getAllGalleryItems() : async [GalleryItem] {
    gallery.values().toArray().sort();
  };

  // ClassContent - Admin only for add/update/delete
  public shared ({ caller }) func addClassContent(content : ClassContent) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add class content");
    };
    let id = generateId();
    let newContent = {
      id;
      classLevel = content.classLevel;
      contentType = content.contentType;
      title = content.title;
      description = content.description;
      url = content.url;
      body = content.body;
      createdAt = Time.now();
    };
    classContent.add(id, newContent);
  };

  public shared ({ caller }) func updateClassContent(id : Text, updatedData : ClassContent) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update class content");
    };
    switch (classContent.get(id)) {
      case (?_) {
        let updatedContent = { updatedData with id };
        classContent.add(id, updatedContent);
      };
      case (null) {
        Runtime.trap("Class content not found");
      };
    };
  };

  public shared ({ caller }) func deleteClassContent(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete class content");
    };
    if (not classContent.containsKey(id)) {
      Runtime.trap("Class content not found");
    };
    classContent.remove(id);
  };

  // Public access - anyone including guests can view class content
  public query ({ caller }) func getByClass(classLevel : ClassLevel.ClassLevel) : async [ClassContent] {
    let iter = classContent.values().filter(
      func(item) {
        item.classLevel == classLevel;
      }
    );
    iter.toArray();
  };

  public query ({ caller }) func getByClassAndType(classLevel : ClassLevel.ClassLevel, contentType : ContentType.ContentType) : async [ClassContent] {
    let iter = classContent.values().filter(
      func(item) {
        item.classLevel == classLevel and item.contentType == contentType;
      }
    );
    iter.toArray();
  };

  // Batches - Admin only for add/update/delete
  public shared ({ caller }) func addBatch(batch : Batch) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add batches");
    };
    let id = generateId();
    let newBatch = { batch with id };
    batches.add(id, newBatch);
  };

  public shared ({ caller }) func updateBatch(id : Text, updatedData : Batch) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update batches");
    };
    switch (batches.get(id)) {
      case (?_) {
        let updatedBatch = { updatedData with id };
        batches.add(id, updatedBatch);
      };
      case (null) {
        Runtime.trap("Batch not found");
      };
    };
  };

  public shared ({ caller }) func deleteBatch(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete batches");
    };
    if (not batches.containsKey(id)) {
      Runtime.trap("Batch not found");
    };
    batches.remove(id);
  };

  // Public - anyone can view batches
  public query ({ caller }) func getAllBatches() : async [Batch] {
    batches.values().toArray();
  };

  public query ({ caller }) func getActiveBatches() : async [Batch] {
    let iter = batches.values().filter(
      func(item) { item.isActive }
    );
    iter.toArray();
  };

  // Admission Inquiries - Public submit, admin-only view/mark
  public shared ({ caller }) func submitAdmissionInquiry(inquiry : AdmissionInquiry) : async () {
    // Public - anyone can submit an inquiry (including guests)
    let id = generateId();
    let newInquiry = {
      id;
      name = inquiry.name;
      mobile = inquiry.mobile;
      email = inquiry.email;
      classLevel = inquiry.classLevel;
      message = inquiry.message;
      createdAt = Time.now();
      isRead = false;
    };
    admissionInquiries.add(id, newInquiry);
  };

  public query ({ caller }) func getAllAdmissionInquiries() : async [AdmissionInquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view admission inquiries");
    };
    admissionInquiries.values().toArray();
  };

  public shared ({ caller }) func markInquiryAsRead(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can mark inquiries as read");
    };
    switch (admissionInquiries.get(id)) {
      case (?inquiry) {
        let updatedInquiry = { inquiry with isRead = true };
        admissionInquiries.add(id, updatedInquiry);
      };
      case (null) {
        Runtime.trap("Inquiry not found");
      };
    };
  };

  // Student Records - Admin only for mutations
  public shared ({ caller }) func addStudentRecord(record : StudentRecord) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add student records");
    };
    let id = generateId();
    let newRecord = {
      id;
      studentName = record.studentName;
      fatherName = record.fatherName;
      mobile = record.mobile;
      classLevel = record.classLevel;
      rollNo = record.rollNo;
      feeDetail = record.feeDetail;
      createdAt = Time.now();
    };
    studentRecords.add(id, newRecord);
  };

  public shared ({ caller }) func updateStudentRecord(id : Text, updatedData : StudentRecord) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update student records");
    };
    switch (studentRecords.get(id)) {
      case (?_) {
        let updatedRecord = { updatedData with id };
        studentRecords.add(id, updatedRecord);
      };
      case (null) {
        Runtime.trap("Student record not found");
      };
    };
  };

  public shared ({ caller }) func deleteStudentRecord(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete student records");
    };
    if (not studentRecords.containsKey(id)) {
      Runtime.trap("Student record not found");
    };
    studentRecords.remove(id);
  };

  public query ({ caller }) func getStudentsByClass(classLevel : ClassLevel.ClassLevel) : async [StudentRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view student records");
    };
    let iter = studentRecords.values().filter(
      func(record) {
        record.classLevel == classLevel;
      }
    );
    iter.toArray();
  };

  // Public - anyone can see student count for a class
  public query ({ caller }) func getStudentCountByClass(classLevel : ClassLevel.ClassLevel) : async Nat {
    let iter = studentRecords.values().filter(
      func(record) {
        record.classLevel == classLevel;
      }
    );
    iter.toArray().size();
  };

  public query ({ caller }) func getAllStudents() : async [StudentRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all student records");
    };
    studentRecords.values().toArray();
  };

  // Stats - Admin only
  public query ({ caller }) func getStats() : async Stats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view stats");
    };
    {
      facultyCount = faculty.size();
      galleryCount = gallery.size();
      contentCount = classContent.size();
      batchCount = batches.size();
      inquiryCount = admissionInquiries.size();
      studentCount = studentRecords.size();
    };
  };

  public shared ({ caller }) func claimFirstAdmin() : async Bool {
    if (caller.isAnonymous()) { return false };
    accessControlState.userRoles.add(caller, #admin);
    true;
  };
};

