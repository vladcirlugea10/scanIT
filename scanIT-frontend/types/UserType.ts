interface LoginData{
    email: string;
    password: string;
}
interface RegisterData{
    email: string;
    password: string;
    userName: string;
    firstName?: string;
    lastName?: string;
    birthday?: string;
}
interface UserData{
    _id: string;
    email:string;
    userName: string;
    firstName: string;
    lastName?: string | null;
    birthday?: string | null;
    height?: number | null;
    weight?: number | null;
    gender?: string | null;
    allergies?: string[] | null;
    scannedProducts?: ScannedProduct[] | null;
    createdAt: Date;
}
interface UpdateData{
    firstName?: string;
    lastName?: string;
    userName?: string;
    email?: string;
    birthday?: string;
    height?: number;
    weight?: number;
    gender?: string;
}

export type { LoginData, RegisterData, UserData, UpdateData };