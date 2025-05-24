export interface AuthInputSubmitting {
    form?: boolean;
    keywords?: boolean;
}

export interface AuthFormDataError {
    username?: boolean;
    email?: boolean;
    password?: boolean;
}   

export interface AuthFormDataFields {
    username:string;
    email: string;
    password: string;
}

export interface AuthFormDataTarget extends EventTarget {
    username: { value: string };
    email: { value: string };
    password: { value: string };
}