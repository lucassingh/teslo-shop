export interface IUser {
    [x: string]: any;
    _id: string;
    name: string;
    email: string;
    password?: string;
    role: string;
    createdAt?: string;
    updatedAt?: string;
}