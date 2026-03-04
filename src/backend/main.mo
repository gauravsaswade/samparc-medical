import Order "mo:core/Order";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Runtime "mo:core/Runtime";

import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";



actor {
  include MixinStorage();

  type MedicineId = Nat;
  type SectionName = Text;
  type AppointmentId = Nat;
  type CustomerId = Nat;
  type SellerId = Nat;
  type SellerMedicineId = Nat;

  type Medicine = {
    id : MedicineId;
    name : Text;
    description : Text;
    price : Nat;
    category : Text;
    available : Bool;
  };

  module Medicine {
    public func compareByPrice(m1 : Medicine, m2 : Medicine) : Order.Order {
      Nat.compare(m1.price, m2.price);
    };
  };

  type Appointment = {
    id : AppointmentId;
    patientName : Text;
    phone : Text;
    email : Text;
    department : Text;
    preferredDate : Text;
    message : Text;
    status : Text; // "Pending", "Confirmed", "Cancelled"
    submittedAt : Text;
  };

  type EditableContent = {
    heroText : Text;
    aboutText : Text;
    services : [Text];
    announcements : [Text];
  };

  type SellerStatus = {
    #Pending;
    #Approved;
    #Rejected;
    #Suspended;
  };

  type Customer = {
    id : CustomerId;
    name : Text;
    email : Text;
    phone : Text;
    passwordHash : Text;
    createdAt : Int;
  };

  type Seller = {
    id : SellerId;
    name : Text;
    email : Text;
    phone : Text;
    businessName : Text;
    passwordHash : Text;
    status : SellerStatus;
    documentsSubmitted : [Text];
    createdAt : Int;
  };

  type SellerMedicine = {
    id : SellerMedicineId;
    sellerId : SellerId;
    name : Text;
    description : Text;
    price : Nat;
    category : Text;
    available : Bool;
    createdAt : Int;
  };

  type ProductImage = {
    productId : Nat;
    imagePath : Text;
    name : Text;
    size : Nat;
    productType : Text;
    blobRef : Storage.ExternalBlob;
  };

  type SellerDocument = {
    sellerId : Nat;
    documentPath : Text;
    name : Text;
    size : Nat;
    blobRef : Storage.ExternalBlob;
  };

  type ProductVideo = {
    productId : Nat;
    videoPath : Text;
    name : Text;
    size : Nat;
    productType : Text;
    blobRef : Storage.ExternalBlob;
  };

  type ProductDocument = {
    productId : Nat;
    documentPath : Text;
    name : Text;
    size : Nat;
    productType : Text;
    blobRef : Storage.ExternalBlob;
  };

  type CustomerCredentials = {
    id : CustomerId;
    name : Text;
    email : Text;
    phone : Text;
    passwordHash : Text;
    createdAt : Int;
  };

  type SellerCredentials = {
    id : SellerId;
    name : Text;
    email : Text;
    phone : Text;
    businessName : Text;
    passwordHash : Text;
    status : SellerStatus;
    createdAt : Int;
  };

  var nextMedicineId : MedicineId = 1;
  var nextAppointmentId : AppointmentId = 1;
  var nextCustomerId : CustomerId = 1;
  var nextSellerId : SellerId = 1;
  var nextSellerMedicineId : SellerMedicineId = 1;

  let medicines = Map.empty<MedicineId, Medicine>();
  let contentSections = Map.empty<SectionName, Text>();
  let appointments = Map.empty<AppointmentId, Appointment>();
  let customers = Map.empty<CustomerId, Customer>();
  let sellers = Map.empty<SellerId, Seller>();
  let sellerMedicines = Map.empty<SellerMedicineId, SellerMedicine>();

  func getNextMedicineId() : MedicineId {
    let currentId = nextMedicineId;
    nextMedicineId += 1;
    currentId;
  };

  func getNextAppointmentId() : AppointmentId {
    let currentId = nextAppointmentId;
    nextAppointmentId += 1;
    currentId;
  };

  func getNextCustomerId() : CustomerId {
    let currentId = nextCustomerId;
    nextCustomerId += 1;
    currentId;
  };

  func getNextSellerId() : SellerId {
    let currentId = nextSellerId;
    nextSellerId += 1;
    currentId;
  };

  func getNextSellerMedicineId() : SellerMedicineId {
    let currentId = nextSellerMedicineId;
    nextSellerMedicineId += 1;
    currentId;
  };

  // Medicine Management

  public shared ({ caller }) func addMedicine(
    name : Text,
    description : Text,
    price : Nat,
    category : Text,
  ) : async MedicineId {
    let id = getNextMedicineId();
    let medicine : Medicine = {
      id;
      name;
      description;
      price;
      category;
      available = true;
    };
    medicines.add(id, medicine);
    id;
  };

  public shared ({ caller }) func editMedicine(
    id : MedicineId,
    name : Text,
    description : Text,
    price : Nat,
    category : Text,
    available : Bool,
  ) : async () {
    switch (medicines.get(id)) {
      case (null) { Runtime.trap("Medicine not found") };
      case (?medicine) {
        let updatedMedicine : Medicine = {
          id;
          name;
          description;
          price;
          category;
          available;
        };
        medicines.add(id, updatedMedicine);
      };
    };
  };

  public shared ({ caller }) func deleteMedicine(id : MedicineId) : async () {
    if (not medicines.containsKey(id)) {
      Runtime.trap("Medicine not found");
    };
    medicines.remove(id);
  };

  public query ({ caller }) func listMedicines() : async [Medicine] {
    medicines.toArray().map(func((_, v)) { v });
  };

  public query ({ caller }) func getMedicinesByCategory(category : Text) : async [Medicine] {
    let filteredIter = medicines.values().filter(
      func(med) { Text.equal(med.category, category) }
    );
    filteredIter.toArray();
  };

  public query ({ caller }) func getAvailableMedicines() : async [Medicine] {
    let filteredIter = medicines.values().filter(
      func(med) { med.available }
    );
    filteredIter.toArray();
  };

  public query ({ caller }) func getMedicinesSortedByPrice() : async [Medicine] {
    let allMedicines = medicines.toArray().map(func((_, v)) { v });
    allMedicines.sort(Medicine.compareByPrice);
  };

  // Content Management

  public shared ({ caller }) func updateContent(section : SectionName, content : Text) : async () {
    contentSections.add(section, content);
  };

  public query ({ caller }) func getContent(section : SectionName) : async Text {
    switch (contentSections.get(section)) {
      case (null) { Runtime.trap("Content section not found") };
      case (?content) { content };
    };
  };

  public query ({ caller }) func getAllContent() : async [(SectionName, Text)] {
    contentSections.toArray();
  };

  public query ({ caller }) func getMedicalProduct(id : MedicineId) : async Medicine {
    switch (medicines.get(id)) {
      case (null) { Runtime.trap("Medicine not found") };
      case (?medicine) { medicine };
    };
  };

  public query ({ caller }) func searchMedicines(search : Text) : async [Medicine] {
    let filteredIter = medicines.values().filter(
      func(med) { med.name.contains(#text search) }
    );
    filteredIter.toArray();
  };

  // Appointment Booking

  public shared ({ caller }) func submitAppointment(
    patientName : Text,
    phone : Text,
    email : Text,
    department : Text,
    preferredDate : Text,
    message : Text,
    submittedAt : Text,
  ) : async AppointmentId {
    let id = getNextAppointmentId();
    let appointment : Appointment = {
      id;
      patientName;
      phone;
      email;
      department;
      preferredDate;
      message;
      status = "Pending";
      submittedAt;
    };
    appointments.add(id, appointment);
    id;
  };

  public query ({ caller }) func listAppointments() : async [Appointment] {
    appointments.toArray().map(func((_, v)) { v });
  };

  public shared ({ caller }) func updateAppointmentStatus(id : AppointmentId, status : Text) : async () {
    switch (appointments.get(id)) {
      case (null) { Runtime.trap("Appointment not found") };
      case (?appointment) {
        let updatedAppointment : Appointment = {
          appointment with status
        };
        appointments.add(id, updatedAppointment);
      };
    };
  };

  public shared ({ caller }) func deleteAppointment(id : AppointmentId) : async () {
    if (not appointments.containsKey(id)) {
      Runtime.trap("Appointment not found");
    };
    appointments.remove(id);
  };

  // Customers

  public shared ({ caller }) func registerCustomer(
    name : Text,
    email : Text,
    phone : Text,
    passwordHash : Text,
  ) : async CustomerId {
    let existing = customers.values().find(
      func(c) { Text.equal(c.email, email) }
    );
    if (existing != null) {
      Runtime.trap("Email already registered");
    };

    let id = getNextCustomerId();
    let customer : Customer = {
      id;
      name;
      email;
      phone;
      passwordHash;
      createdAt = Time.now();
    };
    customers.add(id, customer);
    id;
  };

  public query ({ caller }) func loginCustomer(email : Text, passwordHash : Text) : async Customer {
    switch (customers.values().find(func(c) { Text.equal(c.email, email) })) {
      case (null) { Runtime.trap("Email not found") };
      case (?customer) {
        if (Text.equal(customer.passwordHash, passwordHash)) {
          customer;
        } else {
          Runtime.trap("Invalid password");
        };
      };
    };
  };

  public query ({ caller }) func getCustomer(id : CustomerId) : async Customer {
    switch (customers.get(id)) {
      case (null) { Runtime.trap("Customer not found") };
      case (?customer) { customer };
    };
  };

  public query ({ caller }) func listCustomers() : async [Customer] {
    customers.toArray().map(func((_, v)) { v });
  };

  public shared ({ caller }) func deleteCustomer(id : CustomerId) : async () {
    if (not customers.containsKey(id)) {
      Runtime.trap("Customer not found");
    };
    customers.remove(id);
  };

  // Sellers

  public shared ({ caller }) func registerSeller(
    name : Text,
    email : Text,
    phone : Text,
    businessName : Text,
    passwordHash : Text,
    documentDescriptions : [Text],
  ) : async SellerId {
    let existing = sellers.values().find(
      func(s) { Text.equal(s.email, email) }
    );
    if (existing != null) {
      Runtime.trap("Email already registered");
    };

    let id = getNextSellerId();
    let seller : Seller = {
      id;
      name;
      email;
      phone;
      businessName;
      passwordHash;
      status = #Pending;
      documentsSubmitted = documentDescriptions;
      createdAt = Time.now();
    };
    sellers.add(id, seller);
    id;
  };

  public query ({ caller }) func loginSeller(email : Text, passwordHash : Text) : async Seller {
    switch (sellers.values().find(func(s) { Text.equal(s.email, email) })) {
      case (null) { Runtime.trap("Email not found") };
      case (?seller) {
        if (Text.equal(seller.passwordHash, passwordHash)) {
          seller;
        } else {
          Runtime.trap("Invalid password");
        };
      };
    };
  };

  public query ({ caller }) func getSeller(id : SellerId) : async Seller {
    switch (sellers.get(id)) {
      case (null) { Runtime.trap("Seller not found") };
      case (?seller) { seller };
    };
  };

  public query ({ caller }) func getSellerByEmail(email : Text) : async ?Seller {
    sellers.values().find(func(s) { Text.equal(s.email, email) });
  };

  public query ({ caller }) func listSellers() : async [Seller] {
    sellers.toArray().map(func((_, v)) { v });
  };

  public shared ({ caller }) func updateSellerStatus(id : SellerId, status : SellerStatus) : async () {
    switch (sellers.get(id)) {
      case (null) { Runtime.trap("Seller not found") };
      case (?seller) {
        let updatedSeller : Seller = {
          seller with status
        };
        sellers.add(id, updatedSeller);
      };
    };
  };

  public shared ({ caller }) func deleteSeller(id : SellerId) : async () {
    if (not sellers.containsKey(id)) {
      Runtime.trap("Seller not found");
    };
    sellers.remove(id);
  };

  // Seller Medicines

  public shared ({ caller }) func addSellerMedicine(
    sellerId : SellerId,
    name : Text,
    description : Text,
    price : Nat,
    category : Text,
  ) : async SellerMedicineId {
    ignore switch (sellers.get(sellerId)) {
      case (null) { Runtime.trap("Seller not found") };
      case (?_) {};
    };

    let id = getNextSellerMedicineId();
    let sellerMedicine : SellerMedicine = {
      id;
      sellerId;
      name;
      description;
      price;
      category;
      available = true;
      createdAt = Time.now();
    };
    sellerMedicines.add(id, sellerMedicine);
    id;
  };

  public shared ({ caller }) func editSellerMedicine(
    id : SellerMedicineId,
    name : Text,
    description : Text,
    price : Nat,
    category : Text,
    available : Bool,
  ) : async () {
    switch (sellerMedicines.get(id)) {
      case (null) { Runtime.trap("Seller medicine not found") };
      case (?sellerMedicine) {
        let updatedSellerMedicine : SellerMedicine = {
          id;
          sellerId = sellerMedicine.sellerId;
          name;
          description;
          price;
          category;
          available;
          createdAt = sellerMedicine.createdAt;
        };
        sellerMedicines.add(id, updatedSellerMedicine);
      };
    };
  };

  public shared ({ caller }) func deleteSellerMedicine(id : SellerMedicineId) : async () {
    if (not sellerMedicines.containsKey(id)) {
      Runtime.trap("Seller medicine not found");
    };
    sellerMedicines.remove(id);
  };

  public query ({ caller }) func listSellerMedicines(sellerId : SellerId) : async [SellerMedicine] {
    let filteredIter = sellerMedicines.values().filter(
      func(m) { m.sellerId == sellerId }
    );
    filteredIter.toArray();
  };

  public query ({ caller }) func listAllSellerMedicines() : async [SellerMedicine] {
    sellerMedicines.toArray().map(func((_, v)) { v });
  };

  // New credential query functions

  public query ({ caller }) func listCustomerCredentials() : async [CustomerCredentials] {
    customers.toArray().map(func((_, customer)) {
      {
        id = customer.id;
        name = customer.name;
        email = customer.email;
        phone = customer.phone;
        passwordHash = customer.passwordHash;
        createdAt = customer.createdAt;
      };
    });
  };

  public query ({ caller }) func listSellerCredentials() : async [SellerCredentials] {
    sellers.toArray().map(func((_, seller)) {
      {
        id = seller.id;
        name = seller.name;
        email = seller.email;
        phone = seller.phone;
        businessName = seller.businessName;
        passwordHash = seller.passwordHash;
        status = seller.status;
        createdAt = seller.createdAt;
      };
    });
  };
};
