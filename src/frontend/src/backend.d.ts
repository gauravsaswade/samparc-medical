import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Seller {
    id: SellerId;
    status: SellerStatus;
    name: string;
    createdAt: bigint;
    documentsSubmitted: Array<string>;
    businessName: string;
    email: string;
    passwordHash: string;
    phone: string;
}
export type SellerId = bigint;
export interface CustomerCredentials {
    id: CustomerId;
    name: string;
    createdAt: bigint;
    email: string;
    passwordHash: string;
    phone: string;
}
export interface Customer {
    id: CustomerId;
    name: string;
    createdAt: bigint;
    email: string;
    passwordHash: string;
    phone: string;
}
export type AppointmentId = bigint;
export interface SellerCredentials {
    id: SellerId;
    status: SellerStatus;
    name: string;
    createdAt: bigint;
    businessName: string;
    email: string;
    passwordHash: string;
    phone: string;
}
export type SectionName = string;
export type CustomerId = bigint;
export type MedicineId = bigint;
export interface Medicine {
    id: MedicineId;
    name: string;
    description: string;
    available: boolean;
    category: string;
    price: bigint;
}
export interface SellerMedicine {
    id: SellerMedicineId;
    name: string;
    createdAt: bigint;
    description: string;
    available: boolean;
    category: string;
    sellerId: SellerId;
    price: bigint;
}
export type SellerMedicineId = bigint;
export interface Appointment {
    id: AppointmentId;
    status: string;
    submittedAt: string;
    email: string;
    message: string;
    preferredDate: string;
    patientName: string;
    phone: string;
    department: string;
}
export enum SellerStatus {
    Approved = "Approved",
    Suspended = "Suspended",
    Rejected = "Rejected",
    Pending = "Pending"
}
export interface backendInterface {
    addMedicine(name: string, description: string, price: bigint, category: string): Promise<MedicineId>;
    addSellerMedicine(sellerId: SellerId, name: string, description: string, price: bigint, category: string): Promise<SellerMedicineId>;
    deleteAppointment(id: AppointmentId): Promise<void>;
    deleteCustomer(id: CustomerId): Promise<void>;
    deleteMedicine(id: MedicineId): Promise<void>;
    deleteSeller(id: SellerId): Promise<void>;
    deleteSellerMedicine(id: SellerMedicineId): Promise<void>;
    editMedicine(id: MedicineId, name: string, description: string, price: bigint, category: string, available: boolean): Promise<void>;
    editSellerMedicine(id: SellerMedicineId, name: string, description: string, price: bigint, category: string, available: boolean): Promise<void>;
    getAllContent(): Promise<Array<[SectionName, string]>>;
    getAvailableMedicines(): Promise<Array<Medicine>>;
    getContent(section: SectionName): Promise<string>;
    getCustomer(id: CustomerId): Promise<Customer>;
    getMedicalProduct(id: MedicineId): Promise<Medicine>;
    getMedicinesByCategory(category: string): Promise<Array<Medicine>>;
    getMedicinesSortedByPrice(): Promise<Array<Medicine>>;
    getSeller(id: SellerId): Promise<Seller>;
    getSellerByEmail(email: string): Promise<Seller | null>;
    listAllSellerMedicines(): Promise<Array<SellerMedicine>>;
    listAppointments(): Promise<Array<Appointment>>;
    listCustomerCredentials(): Promise<Array<CustomerCredentials>>;
    listCustomers(): Promise<Array<Customer>>;
    listMedicines(): Promise<Array<Medicine>>;
    listSellerCredentials(): Promise<Array<SellerCredentials>>;
    listSellerMedicines(sellerId: SellerId): Promise<Array<SellerMedicine>>;
    listSellers(): Promise<Array<Seller>>;
    loginCustomer(email: string, passwordHash: string): Promise<Customer>;
    loginSeller(email: string, passwordHash: string): Promise<Seller>;
    registerCustomer(name: string, email: string, phone: string, passwordHash: string): Promise<CustomerId>;
    registerSeller(name: string, email: string, phone: string, businessName: string, passwordHash: string, documentDescriptions: Array<string>): Promise<SellerId>;
    searchMedicines(search: string): Promise<Array<Medicine>>;
    submitAppointment(patientName: string, phone: string, email: string, department: string, preferredDate: string, message: string, submittedAt: string): Promise<AppointmentId>;
    updateAppointmentStatus(id: AppointmentId, status: string): Promise<void>;
    updateContent(section: SectionName, content: string): Promise<void>;
    updateSellerStatus(id: SellerId, status: SellerStatus): Promise<void>;
}
