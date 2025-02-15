interface LoginData{
    email: string;
    password: string;
}
interface RegisterData{
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
    userName?: string;
    birthday?: string;
}
interface UserData{
    id: string;
    email:string;
    firstName: string;
    lastName?: string | null;
    userName?: string | null;
    birthday?: string | null;
    height?: number | null;
    weight?: number | null;
    allergies?: string[] | null;
    createdAt: string;
}

export type { LoginData, RegisterData, UserData };