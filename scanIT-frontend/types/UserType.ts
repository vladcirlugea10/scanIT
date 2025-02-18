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
    id: string;
    email:string;
    userName: string;
    firstName?: string | null;
    lastName?: string | null;
    birthday?: string | null;
    height?: number | null;
    weight?: number | null;
    allergies?: string[] | null;
    createdAt: Date;
}

export type { LoginData, RegisterData, UserData };