export interface MovieInputSubmitting {
    form?: boolean;
}

export interface MovieFormDataError {
    original_file?: boolean;
    title?: boolean;
    description?: boolean;
}   

export interface MovieFormDataFields {
    original_file: string | number | readonly string[] | undefined;
    title: string;
    description: string;
}

export interface MovieFormDataTarget extends EventTarget {
    original_file: { value: string | number | readonly string[] | undefined };
    title: { value: string };
    description: { value: string };
}