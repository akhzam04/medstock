export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

export interface Medicine {
    id: number;
    name: string;
    manufacturer: string;
    category: string;
    unit: string;
    price: number;
}

export interface Patient {
    id: number;
    name: string;
    age: number;
    gender: string;
    phone: string;
    email: string;
    address: string;
}

export interface Prescription {
    id: number;
    patient_name: string;
    doctor_name: string;
    date: string;
    status: string;
    total_amount: number;
}

export interface InventoryItem {
    id: number;
    medicine_name: string;
    batch_number: string;
    expiry_date: string;
    quantity: number;
    unit: string;
    purchase_price: number;
    selling_price: number;
}
