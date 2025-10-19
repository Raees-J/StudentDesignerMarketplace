// src/auth/authTypes.ts
export interface Admin {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface Customer {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    paymentMethod?: string;
}