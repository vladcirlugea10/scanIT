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

export type { LoginData, RegisterData };